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

import api from "@/lib/api";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

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
    const { user } = useAuth();
    const [activeTemplate, setActiveTemplate] = useState<keyof typeof PREDEFINED_TEMPLATES>("custom");
    const [messageTitle, setMessageTitle] = useState("");
    const [messageBody, setMessageBody] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [branches, setBranches] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [targetType, setTargetType] = useState("all");
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState("all");
    const [selectedStudentId, setSelectedStudentId] = useState("all");

    const fetchData = async () => {
        try {
            const [branchRes, studRes] = await Promise.all([
                api.get('/branches'),
                api.get('/students?limit=1000')
            ]);
            setBranches(branchRes.data.data.results || branchRes.data.data || []);
            setAllStudents(studRes.data.data.results || studRes.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/notifications');
            if (res.data.success) {
                const results = res.data.data.results || res.data.data;
                const mapped = results.map((n: any) => ({
                    id: n.id,
                    title: n.title || "Notification",
                    type: n.type || "System",
                    audience: n.sentTo === 'ALL' ? 'All Students' : (n.sentTo === 'BRANCH' ? 'Branch Group' : 'Individual'), 
                    date: new Date(n.createdAt).toLocaleString(),
                    status: "Sent",
                    reach: 1
                }));
                setHistory(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch notification history", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchData();
    }, []);

    // Handlers
    const handleTemplateChange = (val: string) => {
        const key = val as keyof typeof PREDEFINED_TEMPLATES;
        setActiveTemplate(key);
        setMessageTitle(PREDEFINED_TEMPLATES[key].title);
        setMessageBody(PREDEFINED_TEMPLATES[key].message);
    };

    const handleSendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageTitle || !messageBody) {
            toast.error("Please provide both title and message");
            return;
        }

        setIsSending(true);
        try {
            const payload: any = {
                title: messageTitle,
                message: messageBody,
                type: 'GENERAL',
                sentTo: 'ALL',
            };

            if (user?.role === 'STAFF') {
                payload.branchId = user.branchId;
                if (selectedStudentId !== 'all') {
                    payload.sentTo = 'INDIVIDUAL';
                    payload.targetId = selectedStudentId;
                } else if (targetType === 'pending') {
                    payload.sentTo = 'PENDING_FEES';
                } else {
                    payload.sentTo = 'BRANCH';
                }
            } else {
                // SUPER_ADMIN logic
                if (selectedStudentId !== 'all') {
                    payload.sentTo = 'INDIVIDUAL';
                    payload.targetId = selectedStudentId;
                } else if (targetType === 'pending') {
                    payload.sentTo = 'PENDING_FEES';
                    if (selectedBranch !== 'all') {
                        payload.branchId = selectedBranch;
                    }
                } else if (selectedBranch !== 'all') {
                    payload.sentTo = 'BRANCH';
                    payload.branchId = selectedBranch;
                }
            }

            await api.post('/notifications', payload);
            toast.success("Broadcast sent successfully to selected audience");
            setMessageTitle("");
            setMessageBody("");
            setActiveTemplate("custom");
            setSelectedStudentId("all");
            fetchHistory();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send broadcast");
        } finally {
            setIsSending(false);
        }
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

                                        <RadioGroup value={targetType} onValueChange={setTargetType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <RadioGroupItem value="all" id="aud-all" className="peer sr-only" />
                                                <Label htmlFor="aud-all" className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer">
                                                    <Users className="mb-2 h-6 w-6" />
                                                    <span className="font-bold">All Students</span>
                                                    <span className="text-xs text-muted-foreground font-medium mt-1">{allStudents.length} Students across {branches.length} branch{branches.length !== 1 ? 'es' : ''}</span>
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
                                            {user?.role === 'SUPER_ADMIN' && (
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-bold text-muted-foreground uppercase">📍 Target Branch (Recipients)</Label>
                                                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                                                        <SelectTrigger><SelectValue placeholder="All Branches" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Branches (Entire Academy)</SelectItem>
                                                            {branches.map(b => (
                                                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {selectedBranch !== 'all' && (
                                                        <p className="text-[11px] text-blue-600 font-semibold mt-1">✓ Sending to: <strong>{branches.find(b => b.id === selectedBranch)?.name}</strong> students only</p>
                                                    )}
                                                </div>
                                            )}
                                            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                                                <SelectTrigger><SelectValue placeholder="Filter by Level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Levels</SelectItem>
                                                    <SelectItem value="t1">Toddler (T1-T3)</SelectItem>
                                                    <SelectItem value="k1">Kids (K1-K8)</SelectItem>
                                                    <SelectItem value="a1">Adults (A1-A8)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                                <SelectTrigger><SelectValue placeholder="Specific Student..." /></SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    <SelectItem value="all">No Specific Student</SelectItem>
                                                    {allStudents.filter(s => {
                                                        const branchMatch = selectedBranch === 'all' || s.branchId === selectedBranch;
                                                        const pendingMatch = targetType === 'pending' ? (s.payments?.[0] && ['PENDING', 'OVERDUE'].includes(s.payments[0].status)) : true;
                                                        return branchMatch && pendingMatch;
                                                    }).map(student => (
                                                        <SelectItem key={student.id} value={student.id}>
                                                            {student.name} ({student.studentId})
                                                        </SelectItem>
                                                    ))}
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 font-medium text-muted-foreground">Loading history logs...</TableCell>
                                    </TableRow>
                                ) : history.map((log) => (
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
