"use client";

import {
    BarChart3, Download, FileText, TrendingUp,
    Users, DollarSign, Activity, CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useState } from "react";

export default function ReportsPage() {
    const [selectedBranch, setSelectedBranch] = useState("all-branches");

    const branchStats: Record<string, any> = {
        "all-branches": { students: 342, revenue: "94k", attendance: "92%", classes: 184 },
        "dubai": { students: 156, revenue: "45k", attendance: "94%", classes: 84 },
        "sharjah": { students: 102, revenue: "28k", attendance: "89%", classes: 56 },
        "abu-dhabi": { students: 84, revenue: "21k", attendance: "91%", classes: 44 },
    };

    const currentStats = branchStats[selectedBranch];

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
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-[150px] font-bold border-border/50 bg-white/50 dark:bg-slate-800/50">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-branches">All Branches</SelectItem>
                            <SelectItem value="dubai">Dubai</SelectItem>
                            <SelectItem value="sharjah">Sharjah</SelectItem>
                            <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="this-month">
                        <SelectTrigger className="w-[150px] font-bold border-border/50">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="this-week">This Week</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="this-year">This Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="font-bold border-border/50 shadow-sm">
                        <FileText className="w-4 h-4 mr-2" /> PDF Export
                    </Button>
                    <Button className="font-bold shadow-sm gap-2">
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
                            <span className="text-4xl font-black text-foreground">{currentStats.students}</span>
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
                            <span className="text-4xl font-black text-foreground">AED {currentStats.revenue}</span>
                            <span className="text-sm font-bold text-success flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-1" /> 8%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                        <Activity className="w-24 h-24 text-secondaryDark" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Avg. Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-foreground">{currentStats.attendance}</span>
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
                            <span className="text-4xl font-black text-foreground">{currentStats.classes}</span>
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
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className="w-full bg-primary/20 rounded-t-xl h-[200px] relative group cursor-pointer hover:bg-primary/30 transition-colors">
                                <div className="absolute -top-8 w-full text-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">45k</div>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Dubai</span>
                        </div>
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className="w-full bg-secondary/80 rounded-t-xl h-[120px] relative group cursor-pointer hover:bg-secondary transition-colors">
                                <div className="absolute -top-8 w-full text-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">28k</div>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Sharjah</span>
                        </div>
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className="w-full bg-accent rounded-t-xl h-[80px] relative group cursor-pointer hover:bg-accent/80 transition-colors">
                                <div className="absolute -top-8 w-full text-center font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">21k</div>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Abu Dhabi</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Coach Allocation Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-bold">Coach Workload Distribution</CardTitle>
                        <CardDescription>Number of active students assigned per coach.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">Coach Ziad (Dubai)</span>
                                <span className="text-sm font-black text-primary">42 Students</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[85%]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">Coach Sara (Sharjah)</span>
                                <span className="text-sm font-black text-secondaryDark">35 Students</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-secondary w-[65%]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">Coach Ahmed (Abu Dhabi)</span>
                                <span className="text-sm font-black text-accent">28 Students</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[45%]" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">Coach Mona (Dubai)</span>
                                <span className="text-sm font-black text-primary/60">22 Students</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary/60 w-[35%]" />
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Student Level Distribution */}
                <Card className="border-border/50 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-bold">Student Enrollments by Level</CardTitle>
                        <CardDescription>Breakdown of academy students across all swimming tiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-6 pt-6">

                        <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center">
                            <h4 className="font-black text-primary mb-2 uppercase tracking-widest text-xs">Toddlers (T1-T3)</h4>
                            <p className="text-4xl font-black text-foreground">112</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">32% of total</p>
                        </div>

                        <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 text-center">
                            <h4 className="font-black text-secondaryDark mb-2 uppercase tracking-widest text-xs">Kids (K1-K8)</h4>
                            <p className="text-4xl font-black text-foreground">185</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">54% of total</p>
                        </div>

                        <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 text-center">
                            <h4 className="font-black text-accent mb-2 uppercase tracking-widest text-xs">Adults (A1-A8)</h4>
                            <p className="text-4xl font-black text-foreground">45</p>
                            <p className="text-xs font-bold text-muted-foreground mt-2">14% of total</p>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
