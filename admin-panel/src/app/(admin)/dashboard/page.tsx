"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, AlertCircle, TrendingUp, UserPlus, FileEdit, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
    const searchParams = useSearchParams();
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        activeMemberships: 0,
        classesToday: 0,
        pendingPayments: 0,
        upcomingClasses: [] as any[],
        recentActivity: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

    // Show toast if redirected from unauthorized route
    useEffect(() => {
        if (searchParams.get('unauthorized') === '1') {
            toast.error("Access Denied", {
                description: "You don't have permission to access that page.",
                duration: 5000,
            });
        }
    }, [searchParams]);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const todayStr = new Date().toISOString().split('T')[0];
                const [studRes, payRes, schRes, freezingsRes, cancellationsRes] = await Promise.all([
                    api.get('/students', { params: { limit: 10 } }).catch(() => null),
                    api.get('/payments', { params: { limit: 10 } }).catch(() => null),
                    api.get('/schedules/grid', { params: { date: todayStr } }).catch(() => null),
                    api.get('/freezings', { params: { limit: 10 } }).catch(() => null),
                    api.get('/cancellations', { params: { limit: 10 } }).catch(() => null)
                ]);

                let totalStudents = 0, activeMemberships = 0, pendingPayments = 0, classesToday = 0;
                let dynamicUpcoming: any[] = [];
                let combinedActivity: any[] = [];

                // 1. Process Students
                if (studRes?.data?.success) {
                    const allStudents = studRes.data.data.results || studRes.data.data;
                    totalStudents = studRes.data.meta?.total || allStudents.length;
                    activeMemberships = allStudents.filter((s:any) => s.status === 'ACTIVE').length;

                    // Add recent registrations to activity
                    allStudents.slice(0, 5).forEach((s: any) => {
                        combinedActivity.push({
                            action: "New student registered",
                            detail: `${s.name} (${s.level || 'K2'}) joined academy`,
                            time: new Date(s.createdAt),
                            displayTime: new Date(s.createdAt).toLocaleDateString(),
                            icon: UserPlus,
                            color: "text-primary",
                            type: 'REG'
                        });
                    });
                }

                // 2. Process Payments
                if (payRes?.data?.success) {
                    const results = payRes.data.data.results || payRes.data.data;
                    pendingPayments = results.filter((p: any) => p.status !== 'PAID').length;

                    // Add recent payments to activity
                    results.slice(0, 5).forEach((p: any) => {
                        combinedActivity.push({
                            action: "Payment recorded",
                            detail: `AED ${p.totalAmount} ${p.status} from ${p.student?.name || 'Student'}`,
                            time: new Date(p.createdAt),
                            displayTime: new Date(p.createdAt).toLocaleDateString(),
                            icon: CheckCircle2,
                            color: p.status === 'PAID' ? "text-success" : "text-warning",
                            type: 'PAY'
                        });
                    });
                }

                // 2.5 Process Freezings & Cancellations
                if (freezingsRes?.data?.success) {
                    const results = freezingsRes.data.data.results || freezingsRes.data.data;
                    results.slice(0, 5).forEach((f: any) => {
                        combinedActivity.push({
                            action: "Membership Frozen",
                            detail: `${f.student?.name || 'Student'} froze membership`,
                            time: new Date(f.createdAt),
                            displayTime: new Date(f.createdAt).toLocaleDateString(),
                            icon: FileEdit,
                            color: "text-blue-500",
                            type: 'FRZ'
                        });
                    });
                }

                if (cancellationsRes?.data?.success) {
                    const results = cancellationsRes.data.data.results || cancellationsRes.data.data;
                    results.slice(0, 5).forEach((c: any) => {
                        combinedActivity.push({
                            action: "Membership Cancelled",
                            detail: `${c.student?.name || 'Student'} (${c.reason || 'No reason'})`,
                            time: new Date(c.createdAt),
                            displayTime: new Date(c.createdAt).toLocaleDateString(),
                            icon: AlertCircle,
                            color: "text-error",
                            type: 'CNL'
                        });
                    });
                }

                // Sort activity by time descending
                combinedActivity.sort((a, b) => b.time.getTime() - a.time.getTime());

                // 3. Process Schedule
                if (schRes?.data?.success) {
                    const { coaches, schedules } = schRes.data.data;
                    
                    // Only count slots that actually have students
                    classesToday = schedules.reduce((acc: number, sch: any) => {
                        return acc + (sch.slots?.filter((slot: any) => slot.student).length || 0);
                    }, 0);
                    
                    // Map some upcoming classes
                    schedules.forEach((sch: any) => {
                        const coachName = coaches.find((c: any) => c.id === sch.coachId)?.name;
                        sch.slots.forEach((slot: any) => {
                            if (slot.student) {
                                dynamicUpcoming.push({
                                    time: slot.timeSlot,
                                    level: slot.student.level || "T1",
                                    coach: coachName || "Coach",
                                    branch: "Academy",
                                    students: 1,
                                    rawTime: slot.timeSlot // used for sorting
                                });
                            }
                        });
                    });

                    // Simple sorting for upcoming classes (by time string)
                    dynamicUpcoming.sort((a, b) => a.time.localeCompare(b.time));
                }

                setDashboardData({
                    totalStudents,
                    activeMemberships,
                    pendingPayments,
                    classesToday,
                    upcomingClasses: dynamicUpcoming.slice(0, 6),
                    recentActivity: combinedActivity.slice(0, 6).map(a => ({
                        ...a,
                        time: a.displayTime // swap back to string for UI
                    }))
                });
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const dynamicStats = [
        {
            title: "Total Students",
            value: dashboardData.totalStudents.toString(),
            description: "Registered across branch",
            icon: Users,
            trend: "neutral",
            color: "bg-primary/10 text-primary",
        },
        {
            title: "Active Memberships",
            value: dashboardData.activeMemberships.toString(),
            description: "Currently swimming",
            icon: TrendingUp,
            trend: "up",
            color: "bg-success/10 text-success",
        },
        {
            title: "Classes Today",
            value: dashboardData.classesToday.toString(),
            description: "Scheduled",
            icon: Calendar,
            trend: "neutral",
            color: "bg-accent/10 text-accent",
        },
        {
            title: "Pending Payments",
            value: dashboardData.pendingPayments.toString(),
            description: "Requires attention",
            icon: AlertCircle,
            trend: "down",
            color: "bg-warning/10 text-warning",
        },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Here's what's happening at the academy today.</p>
                </div>
                {isLoading && <p className="text-xs font-bold text-primary animate-pulse uppercase tracking-widest">Refreshing Data...</p>}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicStats.map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        {isLoading && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex items-center justify-center" />}
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                                        {isLoading ? "..." : stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mt-4">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Quick Schedule */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold">Today's Next Classes</CardTitle>
                        <CardDescription>Quick overview of upcoming sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground font-medium">Loading schedule...</div>
                            ) : dashboardData.upcomingClasses.length > 0 ? (
                                dashboardData.upcomingClasses.map((cls, j) => (
                                    <div key={j} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg text-sm">
                                                {cls.time}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{cls.level}</p>
                                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                                                    <span>{cls.coach}</span>
                                                    <span className="w-1 h-1 bg-border rounded-full mx-1" />
                                                    <span>{cls.branch}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-foreground">{cls.students} <span className="text-muted-foreground font-medium">Students</span></p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground font-medium">No classes scheduled for today yet.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Log */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="text-center text-muted-foreground font-medium">Loading activity...</div>
                            ) : dashboardData.recentActivity.length > 0 ? (
                                dashboardData.recentActivity.map((activity, k) => (
                                    <div key={k} className="flex gap-4">
                                        <div className="relative">
                                            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 z-10 relative shadow-sm">
                                                <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                            </div>
                                            {/* Timeline Line */}
                                            {k !== dashboardData.recentActivity.length - 1 && (
                                                <div className="absolute top-8 bottom-[-24px] left-1/2 -ml-px w-px bg-border/50" />
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 pb-1">
                                            <p className="text-sm font-bold text-foreground">{activity.action}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{activity.detail}</p>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground/70 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-muted-foreground font-medium py-4">No recent activity recorded.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
