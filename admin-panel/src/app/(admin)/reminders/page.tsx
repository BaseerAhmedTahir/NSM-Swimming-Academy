"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, Mail, Building2, User, Clock, Edit, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Reminder {
    id: string;
    title: string;
    message: string;
    targetType: 'self' | 'branch' | 'email';
    targetDisplayLabel: string; // what to show in the "To/From" field
    scheduledTime: string;
    status: 'pending' | 'sent' | 'completed' | 'snoozed';
    isIncoming?: boolean;
    reminderFor?: string;
}



export default function RemindersPage() {
    const { user } = useAuth();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [branches, setBranches] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [targetType, setTargetType] = useState<'self' | 'branch' | 'email'>('self');
    const [targetValue, setTargetValue] = useState("");
    const [scheduledDateTime, setScheduledDateTime] = useState("");

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);


    const handleAddReminder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scheduledDateTime) return toast.error("Please select a schedule date and time.");
        if (targetType === 'branch' && !targetValue) return toast.error("Please select a target branch.");
        if (targetType === 'email' && !targetValue) return toast.error("Please enter an email address.");

        setIsSubmitting(true);
        try {
            const dueDate = new Date(scheduledDateTime).toISOString();
            const payload: any = {
                title,
                description: message,
                dueDate,
                targetType,
                targetValue,
                type: 'CUSTOM'
            };

            if (isEditMode && editingId) {
                await api.put(`/reminders/${editingId}`, payload);
                toast.success("Reminder updated successfully!");
            } else {
                await api.post('/reminders', payload);
                toast.success("Reminder scheduled successfully!");
            }
            setIsAddModalOpen(false);
            resetForm();
            fetchReminders();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to schedule reminder.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setTargetType('self');
        setTargetValue("");
        setScheduledDateTime("");
        setIsEditMode(false);
        setEditingId(null);
    };

    const handleOpenAdd = () => { resetForm(); setIsAddModalOpen(true); };

    const handleOpenEdit = (reminder: any) => {
        setIsEditMode(true);
        setEditingId(reminder.id);
        setTitle(reminder.title);
        setMessage(reminder.message);
        setTargetType(reminder.targetType);

        // For branch reminders, targetValue should be the branchId to re-select in the dropdown
        // We store branchId, look it up from branches list. The label was resolved for display.
        setTargetValue(""); // will be set from raw data if available
        try {
            const d = new Date(reminder.scheduledTime);
            const localDt = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setScheduledDateTime(localDt);
        } catch(e) { setScheduledDateTime(""); }
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/reminders/${id}`);
            setReminders(reminders.filter(r => r.id !== id));
            toast.success("Reminder deleted");
        } catch {
            toast.error("Failed to delete reminder");
        } finally {
            setConfirmingDeleteId(null);
        }
    };

    const mapReminder = (r: any, myBranchId?: string): Reminder => {
        let parsedTitle = r.title || "Scheduled Task";
        let parsedMessage = r.description || "";

        if (r.message && r.message.includes('\n')) {
            const parts = r.message.split('\n');
            parsedTitle = parts[0];
            parsedMessage = parts.slice(1).join('\n');
        } else if (r.message) {
            parsedMessage = r.message;
        }

        const isIncoming = !!(myBranchId && r.targetBranchId === myBranchId && r.branchId !== myBranchId);
        const targetType: 'self' | 'branch' | 'email' =
            r.reminderFor === 'OTHER_BRANCH' ? 'branch' :
            r.reminderFor === 'SPECIFIC_PERSON' ? 'email' : 'self';

        let targetDisplayLabel = '';
        if (isIncoming) {
            // Show who sent it (the creator's branch)
            targetDisplayLabel = `From: ${r.branch?.name || 'Admin'}`;
        } else if (targetType === 'branch') {
            // Sender side: show the TARGET branch name
            targetDisplayLabel = `To: ${r.targetBranchName || r.targetBranchId || 'Branch'}`;
        } else if (targetType === 'email') {
            targetDisplayLabel = `To: ${r.contactEmail || ''}`;
        } else {
            targetDisplayLabel = 'Self-reminder';
        }

        return {
            id: r.id,
            title: parsedTitle,
            message: parsedMessage,
            targetType,
            targetDisplayLabel,
            scheduledTime: r.scheduledDate || r.dueDate || r.createdAt,
            status: (r.status || 'PENDING').toLowerCase() as Reminder['status'],
            isIncoming,
            reminderFor: r.reminderFor
        };
    };

    const fetchReminders = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/reminders');
            if (res.data.success) {
                const results = res.data.data.results || res.data.data;
                setReminders(results.map((r: any) => mapReminder(r, user?.branchId)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data.data.results || res.data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchReminders();
        fetchBranches();
    }, []);

    // Refresh list every 30s so cards stay up-to-date without page reload.
    // Alerts are handled exclusively by TopBar to avoid double popups.
    useEffect(() => {
        const interval = setInterval(fetchReminders, 30000);
        return () => clearInterval(interval);
    }, []);


    const handleDismiss = async (id: string) => {
        try {
            await api.put(`/reminders/${id}`, { status: 'COMPLETED' });
            toast.success("Reminder dismissed");
            fetchReminders();
        } catch (err) {
            toast.error("Failed to dismiss reminder");
        }
    };

    const handleSnooze = async (id: string) => {
        const snoozeUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        try {
            await api.post(`/reminders/${id}/snooze`, { snoozeUntil });
            toast.info("Reminder snoozed for 10 minutes");
            fetchReminders();
        } catch {
            toast.error("Failed to snooze reminder");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Delete Confirmation Dialog */}
            <Dialog open={!!confirmingDeleteId} onOpenChange={(open) => { if (!open) setConfirmingDeleteId(null); }}>
                <DialogContent className="sm:max-w-[380px] rounded-3xl border-error/20">
                    <DialogHeader className="items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mb-3">
                            <Trash2 className="w-7 h-7 text-error" />
                        </div>
                        <DialogTitle className="text-xl font-black">Delete Reminder?</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            This action cannot be undone. The reminder will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-3 mt-2">
                        <Button variant="outline" className="flex-1 rounded-xl font-bold" onClick={() => setConfirmingDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={() => confirmingDeleteId && handleDelete(confirmingDeleteId)}>Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-primary" />
                        Reminders & Scheduling
                    </h1>
                    <p className="text-muted-foreground mt-1">Set reminders for yourself, other branches, or send scheduled emails.</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={(open) => { if (!open && !isSubmitting) { setIsAddModalOpen(false); resetForm(); } }}>
                    <DialogTrigger asChild>
                        <Button className="font-bold shadow-sm gap-2 rounded-xl h-11" onClick={handleOpenAdd}>
                            <Plus className="w-5 h-5" /> Schedule Reminder
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">{isEditMode ? "Edit Reminder" : "New Reminder"}</DialogTitle>
                            <DialogDescription className="font-medium text-muted-foreground">
                                Reminders sent to a branch will appear as pop-up alerts in their admin panel.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddReminder} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-bold">Reminder Title</Label>
                                <Input id="title" placeholder="e.g. Schedule Maintenance" value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" disabled={isSubmitting} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold">Target</Label>
                                    <Select value={targetType} onValueChange={(val: any) => { setTargetType(val); setTargetValue(""); }} disabled={isSubmitting}>
                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="self">Myself</SelectItem>
                                            <SelectItem value="branch">Another Branch</SelectItem>
                                            <SelectItem value="email">Email Address</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {targetType === 'branch' && (
                                    <div className="space-y-2">
                                        <Label className="font-bold">Select Branch</Label>
                                        <Select value={targetValue} onValueChange={setTargetValue} disabled={isSubmitting}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Choose branch..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branches
                                                    .filter(b => b.id !== user?.branchId)
                                                    .map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {targetType === 'email' && (
                                    <div className="space-y-2">
                                        <Label className="font-bold">Email Address</Label>
                                        <Input type="email" placeholder="example@nsm.com" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} required className="rounded-xl" disabled={isSubmitting} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="datetime" className="font-bold">Schedule Date & Time</Label>
                                <Input id="datetime" type="datetime-local" value={scheduledDateTime} onChange={(e) => setScheduledDateTime(e.target.value)} required className="rounded-xl" disabled={isSubmitting} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="font-bold">Message Content</Label>
                                <Textarea id="message" placeholder="Type your reminder details here..." className="rounded-xl h-24 resize-none" value={message} onChange={(e) => setMessage(e.target.value)} required disabled={isSubmitting} />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => { setIsAddModalOpen(false); resetForm(); }} className="rounded-xl" disabled={isSubmitting}>Cancel</Button>
                                <Button type="submit" className="font-bold rounded-xl shadow-md bg-primary hover:bg-primary/90 min-w-[130px]" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
                                    ) : (isEditMode ? "Update Reminder" : "Save Reminder")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Reminders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                        <Card key={reminder.id} className={cn(
                            "border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden",
                            reminder.isIncoming && "border-secondary/40 bg-secondary/5",
                            reminder.status === 'completed' && "opacity-60"
                        )}>
                            <div className={cn(
                                "absolute top-0 left-0 w-1.5 h-full",
                                reminder.status === 'completed' ? "bg-success" :
                                reminder.status === 'snoozed' ? "bg-muted-foreground" :
                                reminder.targetType === 'self' ? "bg-primary" :
                                reminder.targetType === 'branch' ? "bg-secondary" : "bg-accent"
                            )} />
                            <CardHeader className="pb-2 pl-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {reminder.targetType === 'self' && <User className="w-4 h-4 text-primary shrink-0" />}
                                        {reminder.targetType === 'branch' && <Building2 className="w-4 h-4 text-secondaryDark shrink-0" />}
                                        {reminder.targetType === 'email' && <Mail className="w-4 h-4 text-accent shrink-0" />}
                                        <CardTitle className="text-base font-bold truncate">{reminder.title}</CardTitle>
                                    </div>
                                    {reminder.isIncoming && (
                                        <span className="text-[9px] font-black uppercase bg-secondary/20 text-secondary px-2 py-0.5 rounded-full shrink-0 ml-2">
                                            Incoming
                                        </span>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        {!reminder.isIncoming && reminder.status === 'pending' && (
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(reminder)} className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10">
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => setConfirmingDeleteId(reminder.id)} className="h-7 w-7 text-muted-foreground hover:text-error hover:bg-error/10">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <CardDescription className="flex items-center gap-1.5 font-bold text-xs mt-1 pl-6">
                                    <Clock className="w-3 h-3" />
                                    {new Date(reminder.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pl-5">
                                <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                                    {reminder.message || <span className="italic opacity-50">No message body</span>}
                                </p>
                                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                                    <span className="text-[10px] font-black tracking-wider text-muted-foreground flex items-center gap-1">
                                        {reminder.targetType === 'branch' && <ArrowRight className="w-3 h-3" />}
                                        {reminder.targetDisplayLabel}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {reminder.status === 'pending' && (
                                            <Button variant="ghost" size="sm" onClick={() => handleDismiss(reminder.id)} className="h-6 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-success hover:bg-success/10 px-2 rounded-full">
                                                Dismiss
                                            </Button>
                                        )}
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                            reminder.status === 'pending' ? "bg-warning/10 text-warning" :
                                            reminder.status === 'completed' ? "bg-success/10 text-success" :
                                            reminder.status === 'snoozed' ? "bg-muted text-muted-foreground" :
                                            "bg-muted text-muted-foreground"
                                        )}>
                                            {reminder.status}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : isLoading ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border/60 text-muted-foreground">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="font-bold text-foreground">Loading reminders...</p>
                    </div>
                ) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border/60 text-muted-foreground">
                        <Bell className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold text-lg text-foreground">No reminders set</p>
                        <p className="text-sm">Scheduled reminders will appear here as cards.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
