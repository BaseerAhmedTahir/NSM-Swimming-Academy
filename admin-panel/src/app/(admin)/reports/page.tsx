"use client";

import {
    BarChart3, Download, FileText, TrendingUp,
    Users, DollarSign, Activity, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function ReportsPage() {
    const { user } = useAuth();
    const [selectedBranch, setSelectedBranch] = useState("all-branches");
    const [duration, setDuration] = useState("this-month");
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [reportData, setReportData] = useState({
        students: { total: 0, breakdown: [] as any[], levels: [] as any[] },
        revenue: { stats: { totalAmount: 0, totalPaid: 0, totalPending: 0, count: 0 }, data: [] as any[] },
        attendance: { summary: [] as any[] },
        coaches: [] as any[]
    });

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data.data.results || res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const params: any = { duration };
            if (selectedBranch !== "all-branches") params.branchId = selectedBranch;
            if (duration === "custom" && customStart && customEnd) {
                params.startDate = customStart;
                params.endDate = customEnd;
            }
            
            const [studRes, revRes, attRes, coachRes] = await Promise.all([
                api.get('/reports/students', { params }),
                api.get('/reports/revenue', { params }),
                api.get('/reports/attendance', { params }),
                api.get('/coaches', { params: { limit: 100 } })
            ]);

            setReportData({
                students: studRes.data.data,
                revenue: revRes.data.data,
                attendance: attRes.data.data,
                coaches: coachRes.data.data.results || coachRes.data.data
            });
        } catch (err) {
            console.error("Failed to load reports", err);
            toast.error("Failed to load analytics from server");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchReports();
    }, [selectedBranch, duration, customStart, customEnd]);

    const stats = {
        students: reportData.students.total,
        revenue: reportData.revenue.stats?.totalPaid || 0,
        attendance: reportData.attendance.summary?.find((s: any) => s.status === 'ATTENDED')?._count || 0,
        classes: reportData.attendance.summary?.reduce((acc: number, s: any) => acc + s._count, 0) || 0
    };

    // Aggregate revenue by branch for the chart
    const revenueByBranch = branches.map(b => {
        const total = reportData.revenue.data
            .filter((p: any) => p.branch?.name === b.name)
            .reduce((sum: number, p: any) => sum + p.paidAmount, 0);
        return { name: b.name, total };
    });

    const maxRevenue = Math.max(...revenueByBranch.map(r => r.total), 1);

    // Group students by major categories
    const levelStats = {
        toddlers: reportData.students.levels?.filter((l: any) => l.level?.startsWith('T'))?.reduce((acc: number, l: any) => acc + l._count, 0) || 0,
        kids: reportData.students.levels?.filter((l: any) => l.level?.startsWith('K'))?.reduce((acc: number, l: any) => acc + l._count, 0) || 0,
        adults: reportData.students.levels?.filter((l: any) => l.level?.startsWith('A'))?.reduce((acc: number, l: any) => acc + l._count, 0) || 0,
    };
    const totalByLevel = levelStats.toddlers + levelStats.kids + levelStats.adults || 1;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-primary" />
                        Analytics & Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">Academy performance insights, revenue overview, and attendance stats.</p>
                </div>

                <div className="flex gap-3">
                    {user?.role === 'SUPER_ADMIN' && (
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-[180px] font-bold border-border/50 bg-white/50 dark:bg-slate-800/50">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-branches">All Branches</SelectItem>
                                {branches.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="w-[150px] font-bold border-border/50">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                            {/* <SelectItem value="custom">Custom Range</SelectItem> */}
                        </SelectContent>
                    </Select>
                    
                    {/* duration === "custom" && (
                        <div className="flex bg-muted/30 border border-border/50 rounded-xl px-1">
                            <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="h-10 border-0 bg-transparent text-xs font-bold w-[120px] focus-visible:ring-0 shadow-none px-2" />
                            <div className="flex items-center text-muted-foreground">-</div>
                            <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="h-10 border-0 bg-transparent text-xs font-bold w-[120px] focus-visible:ring-0 shadow-none px-2" />
                        </div>
                    ) */}

                    <Button variant="outline" className="font-bold border-border/50 shadow-sm" onClick={async () => {
                        try {
                            const branchParam = selectedBranch === 'all-branches' ? '' : selectedBranch;
                            toast.loading("Preparing PDF report...", { id: "downloading-report" });
                            let query = `/reports/revenue?format=PDF&branchId=${branchParam}&duration=${duration}`;
                            if (duration === 'custom') query += `&startDate=${customStart}&endDate=${customEnd}`;
                            const response = await api.get(query, {
                                responseType: 'blob'
                            });
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Revenue_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                            toast.success("PDF exported successfully", { id: "downloading-report" });
                        } catch (err) {
                            console.error("Export error:", err);
                            toast.error("Failed to export PDF", { id: "downloading-report" });
                        }
                    }}>
                        <FileText className="w-4 h-4 mr-2" /> PDF Export
                    </Button>
                    <Button className="font-bold shadow-sm gap-2" onClick={async () => {
                        try {
                            const branchParam = selectedBranch === 'all-branches' ? '' : selectedBranch;
                            toast.loading("Preparing Excel report...", { id: "downloading-report" });
                            const response = await api.get(`/reports/revenue?format=EXCEL&branchId=${branchParam}&duration=${duration}`, {
                                responseType: 'blob'
                            });
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Revenue_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                            toast.success("Excel exported successfully", { id: "downloading-report" });
                        } catch (err) {
                            console.error("Export error:", err);
                            toast.error("Failed to export Excel", { id: "downloading-report" });
                        }
                    }}>
                        <Download className="w-4 h-4" /> Excel Export
                    </Button>
                </div>
            </div>

            {/* Primary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <Users className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-foreground">{isLoading ? "..." : stats.students}</span>
                            <span className="text-sm font-bold text-success flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-1" /> 12%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign className="w-24 h-24 text-success" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-foreground">AED {isLoading ? "..." : stats.revenue.toLocaleString()}</span>
                            <span className="text-sm font-bold text-success flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-1" /> 8%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <Activity className="w-24 h-24 text-secondaryDark" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Attendance (Present)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-foreground">{isLoading ? "..." : stats.attendance}</span>
                            <span className="text-sm font-bold text-success flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-1" /> 2%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm relative overflow-hidden group bg-primary/5 border-primary/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <CalendarDays className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-primary uppercase tracking-widest">Classes Conducted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-foreground">{isLoading ? "..." : stats.classes}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue by Branch Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-bold flex justify-between items-center">
                            <span>Revenue by Branch</span>
                            <Select defaultValue="bar">
                                <SelectTrigger className="w-[100px] h-8 text-xs font-bold bg-muted border-none"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="bar">Bar Chart</SelectItem></SelectContent>
                            </Select>
                        </CardTitle>
                        <CardDescription>Monthly revenue breakdown across all active branches.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between gap-4 pt-10 px-6">
                        {revenueByBranch.map((rev, idx) => (
                            <div key={idx} className="w-full flex flex-col items-center gap-2 h-full justify-end">
                                <div 
                                    className="w-full bg-primary/20 rounded-t-xl relative group cursor-pointer hover:bg-primary/30 transition-all duration-500"
                                    style={{ height: `${(rev.total / maxRevenue) * 100}%`, minHeight: '4px' }}
                                >
                                    <div className="absolute -top-8 w-full text-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {rev.total.toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase text-center line-clamp-1">{rev.name}</span>
                            </div>
                        ))}
                        {revenueByBranch.length === 0 && <p className="w-full text-center text-muted-foreground">No data available</p>}
                    </CardContent>
                </Card>

                {/* Coach Allocation Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-bold">Coach Workload Distribution</CardTitle>
                        <CardDescription>Number of active students assigned per coach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 max-h-[300px] overflow-y-auto">
                        {reportData.coaches.map((coach, idx) => {
                            const count = coach._count?.studentAssignments || 0;
                            const max = 50; // Reference for 100%
                            const percent = Math.min((count / max) * 100, 100);
                            
                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-foreground">{coach.name} ({coach.branch?.name || 'Academy'})</span>
                                        <span className="text-sm font-black text-primary">{count} Students</span>
                                    </div>
                                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                        {reportData.coaches.length === 0 && <p className="text-center text-muted-foreground">No coach data available</p>}
                    </CardContent>
                </Card>

                {/* Student Level Distribution */}
                <Card className="border-border/50 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-bold">Student Enrollments by Level</CardTitle>
                        <CardDescription>Breakdown of academy students across all swimming tiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center">
                            <h4 className="font-black text-primary mb-2 uppercase tracking-widest text-[10px]">Toddlers (T1-T3)</h4>
                            <p className="text-4xl font-black text-foreground">{levelStats.toddlers}</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">{Math.round((levelStats.toddlers / totalByLevel) * 100)}% of total</p>
                        </div>

                        <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 text-center">
                            <h4 className="font-black text-secondaryDark mb-2 uppercase tracking-widest text-[10px]">Kids (K1-K8)</h4>
                            <p className="text-4xl font-black text-foreground">{levelStats.kids}</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">{Math.round((levelStats.kids / totalByLevel) * 100)}% of total</p>
                        </div>

                        <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 text-center">
                            <h4 className="font-black text-accent mb-2 uppercase tracking-widest text-[10px]">Adults (A1-A8)</h4>
                            <p className="text-4xl font-black text-foreground">{levelStats.adults}</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">{Math.round((levelStats.adults / totalByLevel) * 100)}% of total</p>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
