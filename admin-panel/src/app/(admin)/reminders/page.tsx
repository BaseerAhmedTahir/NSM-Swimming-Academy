"use client";

import { useState } from "react";
import { Bell, Plus, Search, Trash2, Mail, Building2, User, Clock, Calendar as CalendarIcon } from "lucide-react";
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
    targetValue: string;
    scheduledTime: string;
    status: 'pending' | 'sent';
}

const mockReminders: Reminder[] = [
    {
        id: "1",
        title: "Staff Meeting",
        message: "Discuss pool maintenance schedule for next month.",
        targetType: 'branch',
        targetValue: 'Dubai',
        scheduledTime: "2026-03-12T14:45",
        status: 'pending'
    },
    {
        id: "2",
        title: "Follow up with Ziad",
        message: "Remind about the upcoming competition registration.",
        targetType: 'email',
        targetValue: 'ziad.ahmed@example.com',
        scheduledTime: "2026-03-13T10:00",
        status: 'pending'
    }
];

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [targetType, setTargetType] = useState<'self' | 'branch' | 'email'>('self');
    const [targetValue, setTargetValue] = useState("");
    const [scheduledDateTime, setScheduledDateTime] = useState("");

    const handleAddReminder = (e: React.FormEvent) => {
        e.preventDefault();
        const newReminder: Reminder = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            message,
            targetType,
            targetValue: targetType === 'self' ? 'Me' : targetValue,
            scheduledTime: scheduledDateTime,
            status: 'pending'
        };
        setReminders([newReminder, ...reminders]);
        setIsAddModalOpen(false);
        resetForm();
        toast.success("Reminder scheduled successfully!");
    };

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setTargetType('self');
        setTargetValue("");
        setScheduledDateTime("");
    };

    const handleDelete = (id: string) => {
        setReminders(reminders.filter(r => r.id !== id));
        toast.success("Reminder deleted");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Bell className="w-8 h-8 text-primary" />
                        Reminders & Scheduling
                    </h1>
                    <p className="text-muted-foreground mt-1">Set reminders for yourself, other branches, or send scheduled emails.</p>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="font-bold shadow-sm gap-2 rounded-xl h-11">
                            <Plus className="w-5 h-5" /> Schedule Reminder
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">New Reminder</DialogTitle>
                            <DialogDescription className="font-medium text-muted-foreground">
                                Fill in details for the reminder. Reminders will behave as popups for branch targets.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddReminder} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-bold">Reminder Title</Label>
                                <Input id="title" placeholder="e.g. Schedule Maintenance" value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold">Target</Label>
                                    <Select value={targetType} onValueChange={(val: any) => setTargetType(val)}>
                                        <SelectTrigger className="rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="self">Myself</SelectItem>
                                            <SelectItem value="branch">Branch</SelectItem>
                                            <SelectItem value="email">Email Address</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {targetType === 'branch' && (
                                    <div className="space-y-2">
                                        <Label className="font-bold">Select Branch</Label>
                                        <Select value={targetValue} onValueChange={setTargetValue}>
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Dubai">Dubai</SelectItem>
                                                <SelectItem value="Sharjah">Sharjah</SelectItem>
                                                <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {targetType === 'email' && (
                                    <div className="space-y-2">
                                        <Label className="font-bold">Email Address</Label>
                                        <Input type="email" placeholder="example@nsm.com" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} required className="rounded-xl" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="datetime" className="font-bold">Schedule Date & Time</Label>
                                <Input id="datetime" type="datetime-local" value={scheduledDateTime} onChange={(e) => setScheduledDateTime(e.target.value)} required className="rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="font-bold">Message Content</Label>
                                <Textarea id="message" placeholder="Type your reminder details here..." className="rounded-xl h-24 resize-none" value={message} onChange={(e) => setMessage(e.target.value)} required />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl">Cancel</Button>
                                <Button type="submit" className="font-bold rounded-xl shadow-md bg-primary hover:bg-primary/90">Save Reminder</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Reminders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                        <Card key={reminder.id} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                            <div className={cn(
                                "absolute top-0 left-0 w-1.5 h-full",
                                reminder.targetType === 'self' ? "bg-primary" : 
                                reminder.targetType === 'branch' ? "bg-secondary" : "bg-accent"
                            )} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        {reminder.targetType === 'self' && <User className="w-4 h-4 text-primary" />}
                                        {reminder.targetType === 'branch' && <Building2 className="w-4 h-4 text-secondaryDark" />}
                                        {reminder.targetType === 'email' && <Mail className="w-4 h-4 text-accent" />}
                                        <CardTitle className="text-lg font-bold truncate pr-6">{reminder.title}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(reminder.id)} className="h-8 w-8 text-muted-foreground hover:text-error hover:bg-error/10 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <CardDescription className="flex items-center gap-1.5 font-bold text-xs mt-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(reminder.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground font-medium line-clamp-3">
                                    "{reminder.message}"
                                </p>
                                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                        To: {reminder.targetValue}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                        reminder.status === 'pending' ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                    )}>
                                        {reminder.status}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center bg-card rounded-2xl border border-dashed border-border/60 text-muted-foreground">
                        <Bell className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold text-lg text-foreground">No reminders set</p>
                        <p className="text-sm">Scheduled reminders will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
