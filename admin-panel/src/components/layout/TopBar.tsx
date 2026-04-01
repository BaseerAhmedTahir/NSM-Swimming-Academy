"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, LogOut, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import api from "@/lib/api";
import AddStudentModal from "../students/AddStudentModal";
import { toast } from "sonner";

export function TopBar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());

    const notifiedReminders = useRef<Map<string, number>>(new Map()); // id -> timestamp shown
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    
    // Prominent Reminder Dialog State
    const [showReminder, setShowReminder] = useState(false);
    const [latestReminder, setLatestReminder] = useState<any>(null);
    const RE_ALERT_AFTER_MS = 10 * 60 * 1000; // re-alert after 10 min if not dismissed

    useEffect(() => {
        // Update every minute
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        
        // Fetch real reminders only if user has permission for the reminders module
        const checkReminders = async () => {
            // SUPER_ADMIN always has access. STAFF only if 'reminders' is in their branch permissions.
            const hasRemindersAccess = user?.role === 'SUPER_ADMIN' || 
                (Array.isArray(user?.permissions) 
                    ? user.permissions.includes('reminders')
                    : true); // fallback: allow if permissions not yet loaded
            
            if (!hasRemindersAccess) return;
            
            try {
                const res = await api.get('/reminders');
                if (res.data.success) {
                    const results = res.data.data.results || res.data.data;
                    const now = new Date();
                    
                    results.forEach((r: any) => {
                        const isPending = r.status === 'PENDING' || r.status === 'pending';
                        // Also catch SNOOZED reminders whose snooze period has expired
                        const isSnoozedAndExpired = (r.status === 'SNOOZED' || r.status === 'snoozed') &&
                            r.snoozedUntil && new Date(r.snoozedUntil) <= now;
                        if (!isPending && !isSnoozedAndExpired) return;
                        
                        const sched = new Date(r.scheduledDate || r.dueDate || r.createdAt);
                        if (sched > now) return; // not due yet
                        
                        // === KEY FIX: Only alert the RECIPIENT, not the sender ===
                        // For OTHER_BRANCH reminders: only alert if THIS branch is the TARGET
                        const isOtherBranchReminder = r.reminderFor === 'OTHER_BRANCH';
                        const myBranchId = user?.branchId;
                        if (isOtherBranchReminder) {
                            // Skip if we are the SENDER (branchId matches our branch)
                            // Only show if we are the TARGET (targetBranchId matches our branch)
                            if (!myBranchId || r.targetBranchId !== myBranchId) return;
                        }
                        
                        // Re-alert if last shown was > 10 min ago (or never shown)
                        const lastShown = notifiedReminders.current.get(r.id);
                        if (lastShown && (now.getTime() - lastShown < RE_ALERT_AFTER_MS)) return;
                        
                        notifiedReminders.current.set(r.id, now.getTime());
                        
                        // Parse message
                        let parsedTitle = r.title || "Scheduled Reminder";
                        let parsedMessage = r.description || "";
                        if (r.message && r.message.includes('\n')) {
                            const parts = r.message.split('\n');
                            parsedTitle = parts[0];
                            parsedMessage = parts.slice(1).join('\n');
                        } else if (r.message) {
                            parsedMessage = r.message;
                        }

                        // Show prominent dialog
                        setLatestReminder({ ...r, parsedTitle, parsedMessage });
                        setShowReminder(true);
                    });
                }
            } catch (err) { console.error(err); }
        };

        checkReminders();
        const reminderInterval = setInterval(checkReminders, 15000); // 15s poll
        
        return () => {
            clearInterval(timer);
            clearInterval(reminderInterval);
        };
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="h-auto min-h-[5rem] py-3 md:py-0 md:h-20 bg-card border-b border-border/50 px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-10 w-full animate-in slide-in-from-top-4 duration-300">

            {/* Left side info */}
            <div className="flex flex-col flex-1 min-w-0 mr-2 md:mr-4">
                <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight truncate">
                    Welcome back, <span className="text-primary tracking-normal">{user?.name || "Admin"}</span> 👋
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-1">
                    <span className="bg-secondary/10 text-secondary px-1.5 md:px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold tracking-wider uppercase shrink-0">
                        Live
                    </span>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                        {format(currentDate, "EEE, MMM do yyyy")}
                    </span>
                </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">

                {/* Search */}
                {/* <div className="relative hidden md:flex items-center group">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search students, staff..."
                        className="w-64 pl-9 h-10 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-xl transition-all shadow-sm"
                    />
                </div> */}

                {/* Quick Action */}
                <Button 
                    onClick={() => setIsAddStudentOpen(true)}
                    variant="outline" 
                    className="h-10 px-4 rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 hidden lg:flex font-semibold shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Add Student
                </Button>

                <AddStudentModal 
                    isOpen={isAddStudentOpen} 
                    onClose={() => setIsAddStudentOpen(false)} 
                />

                {/* Notifications */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative h-10 w-10 shrink-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-full transition-colors"
                    onClick={() => router.push('/notifications')}
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-card animate-pulse" />
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full shrink-0 border-2 border-primary/20 hover:border-primary transition-colors hover:bg-transparent">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatar-placeholder.png" alt="@admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl border-border/50 shadow-xl" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">{user?.role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Staff Admin'}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.id || 'admin'}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        {/* <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg transition-colors font-medium">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Academy Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" /> */}
                        <DropdownMenuItem onClick={handleLogout} className="text-error focus:text-error focus:bg-error/10 cursor-pointer rounded-lg transition-colors font-medium">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            {/* Prominent Reminder Alert Dialog */}
            <Dialog open={showReminder} onOpenChange={async (open) => {
                if (!open && latestReminder) {
                    // X button / outside click = snooze for 10 min
                    const snoozeUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                    try { await api.post(`/reminders/${latestReminder.id}/snooze`, { snoozeUntil }); } catch { /* ignore */ }
                    notifiedReminders.current.delete(latestReminder.id);
                    setShowReminder(false);
                }
            }}>
                <DialogContent className="sm:max-w-[450px] rounded-3xl border-2 border-primary/30 shadow-2xl bg-card" onPointerDownOutside={(e) => e.preventDefault()}>
                    <DialogHeader className="items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-4">
                            <Bell className="w-10 h-10 text-primary animate-bounce" />
                        </div>
                        <DialogTitle className="text-2xl font-black">🔔 {latestReminder?.parsedTitle || latestReminder?.title || "New Reminder!"}</DialogTitle>
                        <DialogDescription className="font-bold text-primary mt-1">
                            {latestReminder?.scheduledDate ? new Date(latestReminder.scheduledDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl my-2 text-center">
                        <p className="font-bold text-foreground">{latestReminder?.parsedMessage || latestReminder?.description || latestReminder?.message || "No message body."}</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={async () => {
                            if (!latestReminder) return;
                            const snoozeUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                            try {
                                await api.post(`/reminders/${latestReminder.id}/snooze`, { snoozeUntil });
                                notifiedReminders.current.delete(latestReminder.id);
                            } catch { /* ignore */ }
                            setShowReminder(false);
                        }}>⏰ Snooze 10 min</Button>
                        <Button className="flex-1 rounded-xl font-bold bg-primary hover:bg-primary/90" onClick={async () => {
                            if (!latestReminder) return;
                            try { await api.put(`/reminders/${latestReminder.id}`, { status: 'COMPLETED' }); } catch { /* ignore */ }
                            notifiedReminders.current.delete(latestReminder.id);
                            setShowReminder(false);
                        }}>✓ Got it, Dismiss</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
