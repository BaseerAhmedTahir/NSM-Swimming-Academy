"use client";

import { useState } from "react";
import {
    BellRing, Send, Search, Users, AlertCircle,
    CheckCircle2, Clock, History, FileText, Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock History Data
const notificationHistory = [
    { id: "NT-101", title: "Eid Holiday Announcement", type: "Holiday", audience: "All Students", date: "2026-02-23 10:00 AM", status: "Sent", reach: 245 },
    { id: "NT-102", title: "Pending Fees Reminder", type: "Reminder", audience: "Pending Fees (24)", date: "2026-02-20 09:15 AM", status: "Sent", reach: 24 },
    { id: "NT-103", title: "Coach Substitution - K2 Level", type: "Class Update", audience: "Dubai - K2", date: "2026-02-18 03:45 PM", status: "Sent", reach: 12 },
    { id: "NT-104", title: "Summer Camp Early Bird Offer", type: "Offer", audience: "All Students", date: "2026-02-15 11:30 AM", status: "Sent", reach: 245 },
    { id: "NT-105", title: "Assessment Results Available", type: "System", audience: "Individual", date: "2026-02-10 05:00 PM", status: "Sent", reach: 1 },
];

const PREDEFINED_TEMPLATES = {
    holiday: {
        title: "Upcoming Holiday Notice",
        message: "Dear Parents, please be informed that the academy will be closed on [Date] due to [Holiday/Reason]. Classes will resume as normal on [Resume Date]. Thank you!"
    },
    missed: {
        title: "Missed Class Notification",
        message: "Hi [Student Name], we noticed you missed your swimming class today. Please contact us to schedule a makeup session. Looking forward to seeing you back in the pool!"
    },
    fee: {
        title: "Fee Payment Reminder",
        message: "Gentle reminder: Your upcoming membership renewal fee of AED [Amount] is due on [Date]. Please process the payment to maintain your active spot. You can pay via the app or at the front desk."
    },
    custom: {
        title: "",
        message: ""
    }
};

export default function NotificationsPage() {
    const [activeTemplate, setActiveTemplate] = useState<keyof typeof PREDEFINED_TEMPLATES>("custom");
    const [messageTitle, setMessageTitle] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    // Handlers
    const handleTemplateChange = (val: string) => {
        const key = val as keyof typeof PREDEFINED_TEMPLATES;
        setActiveTemplate(key);
        setMessageTitle(PREDEFINED_TEMPLATES[key].title);
        setMessageBody(PREDEFINED_TEMPLATES[key].message);
    };

    const handleSendNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageTitle || !messageBody) {
            toast.error("Please provide both title and message");
            return;
        }

        setIsSending(true);
        // Mock sending process
        setTimeout(() => {
            toast.success("Broadcast sent successfully to selected audience");
            setIsSending(false);
            setMessageTitle("");
            setMessageBody("");
            setActiveTemplate("custom");
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <BellRing className="w-8 h-8 text-primary" />
                        Notification Center
                    </h1>
                    <p className="text-muted-foreground mt-1">Broadcast announcements to parents, students, or branch groups.</p>
                </div>
            </div>

            <Tabs defaultValue="compose" className="w-full">
                <TabsList className="bg-muted p-1 rounded-xl mb-6">
                    <TabsTrigger value="compose" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6">
                        <Send className="w-4 h-4 mr-2" /> Compose Message
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6">
                        <History className="w-4 h-4 mr-2" /> History Logs
                    </TabsTrigger>
                </TabsList>

                {/* --- COMPOSE TAB (4.9.1 & 4.9.2) --- */}
                <TabsContent value="compose" className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* Left Col: Composer Form */}
                        <Card className="xl:col-span-2 border-border/50 shadow-sm overflow-hidden">
                            <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex items-center gap-3">
                                <Megaphone className="w-5 h-5 text-primary" />
                                <h3 className="font-black text-lg text-primaryDark">Broadcast Details</h3>
                            </div>
                            <CardContent className="p-6">
                                <form onSubmit={handleSendNotification} className="space-y-8">

                                    {/* 1. Audience Selector */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-foreground border-b border-border/50 pb-2">1. Select Target Audience</h4>

                                        <RadioGroup defaultValue="all" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <RadioGroupItem value="all" id="aud-all" className="peer sr-only" />
                                                <Label htmlFor="aud-all" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer">
                                                    <Users className="mb-2 h-6 w-6" />
                                                    <span className="font-bold">All Students</span>
                                                    <span className="text-xs text-muted-foreground font-medium mt-1">~245 Users across branches</span>
                                                </Label>
                                            </div>
                                            <div>
                                                <RadioGroupItem value="pending" id="aud-pending" className="peer sr-only" />
                                                <Label htmlFor="aud-pending" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-foreground peer-data-[state=checked]:border-warning peer-data-[state=checked]:bg-warning/5 cursor-pointer">
                                                    <AlertCircle className="mb-2 h-6 w-6" />
                                                    <span className="font-bold">Pending Fees Only</span>
                                                    <span className="text-xs text-muted-foreground font-medium mt-1">Auto-filters students in arrears</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="Filter by Branch" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dubai">Dubai</SelectItem>
                                                    <SelectItem value="sharjah">Sharjah</SelectItem>
                                                    <SelectItem value="ad">Abu Dhabi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="Filter by Level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="t1">Toddler (T1-T3)</SelectItem>
                                                    <SelectItem value="k1">Kids (K1-K8)</SelectItem>
                                                    <SelectItem value="a1">Adults (A1-A8)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="Specific Student..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="demo">Ahmed Ziad (NSM-001)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* 2. Message Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                                            <h4 className="text-sm font-bold text-foreground">2. Message Content</h4>
                                            <Select value={activeTemplate} onValueChange={handleTemplateChange}>
                                                <SelectTrigger className="w-[200px] h-8 text-xs font-bold bg-muted border-none">
                                                    <SelectValue placeholder="Load Template" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="custom">Custom Message</SelectItem>
                                                    <SelectItem value="holiday">Holiday Notice</SelectItem>
                                                    <SelectItem value="missed">Missed Class</SelectItem>
                                                    <SelectItem value="fee">Fee Reminder</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Notification Title <span className="text-error">*</span></Label>
                                                <Input
                                                    placeholder="e.g. Academy Closure Notice"
                                                    value={messageTitle}
                                                    onChange={(e) => setMessageTitle(e.target.value)}
                                                    className="font-bold"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Message Body <span className="text-error">*</span></Label>
                                                <Textarea
                                                    placeholder="Type your message here. Use variables like [Student Name] if sending to individuals..."
                                                    className="min-h-[150px] resize-y"
                                                    value={messageBody}
                                                    onChange={(e) => setMessageBody(e.target.value)}
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground text-right">{messageBody.length} / 500 characters</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4 flex justify-end">
                                        <Button type="submit" disabled={isSending} className="font-bold w-full md:w-auto px-8 shadow-md gap-2">
                                            {isSending ? "Sending..." : "Send Broadcast"}
                                        </Button>
                                    </div>

                                </form>
                            </CardContent>
                        </Card>

                        {/* Right Col: Mobile Preview */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4" /> App Preview
                            </h3>

                            {/* Fake iPhone frame */}
                            <div className="border-8 border-slate-800 rounded-[3rem] w-[300px] h-[600px] mx-auto overflow-hidden bg-slate-100 shadow-2xl relative">
                                {/* Notch */}
                                <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl w-40 mx-auto z-10" />

                                <div className="bg-blue-500 h-24 pt-10 px-4 rounded-b-3xl">
                                    <div className="flex justify-between items-center text-white">
                                        <span className="font-black">NSM App</span>
                                        <BellRing className="w-5 h-5 fill-white" />
                                    </div>
                                </div>

                                <div className="p-4 space-y-4 mt-2">
                                    <p className="font-bold text-xs text-slate-500 uppercase">Just Now</p>

                                    {messageTitle || messageBody ? (
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex gap-3 animate-in slide-in-from-bottom-4">
                                            <div className="bg-blue-100 p-2 rounded-full h-fit flex-shrink-0">
                                                <BellRing className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">{messageTitle || "Notification Title"}</h4>
                                                <p className="text-xs text-slate-600 mt-1 line-clamp-4 leading-relaxed">
                                                    {messageBody || "Your message preview will appear here as you type..."}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-8 text-slate-400">
                                            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">Type a message to see preview</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- HISTORY TAB (4.9.3) --- */}
                <TabsContent value="history">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="font-bold text-foreground">Log ID</TableHead>
                                    <TableHead className="font-bold text-foreground">Date Sent</TableHead>
                                    <TableHead className="font-bold text-foreground">Title</TableHead>
                                    <TableHead className="font-bold text-foreground">Type</TableHead>
                                    <TableHead className="font-bold text-foreground">Target Audience</TableHead>
                                    <TableHead className="font-bold text-foreground text-center">Reach</TableHead>
                                    <TableHead className="font-bold text-foreground">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notificationHistory.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/30 border-border/50">
                                        <TableCell className="font-medium text-muted-foreground">{log.id}</TableCell>
                                        <TableCell className="text-sm">{log.date}</TableCell>
                                        <TableCell>
                                            <p className="font-bold text-foreground">{log.title}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-muted px-2 py-1 rounded text-xs font-bold border border-border">
                                                {log.type}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{log.audience}</TableCell>
                                        <TableCell className="text-center font-bold">{log.reach}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-success" />
                                                <span className="font-bold text-sm text-success">{log.status}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
