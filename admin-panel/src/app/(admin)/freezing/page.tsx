"use client";

import { useState } from "react";
import { 
    Search, 
    Download, 
    Filter, 
    Calendar,
    Snowflake,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    MoreVertical,
    FileText,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Data for Freezing History
const freezeHistory = [
    {
        id: "FRZ-001",
        studentId: "NSM-DXB-042",
        name: "Omar Hassan",
        branch: "Dubai",
        freezeDate: "2026-03-01",
        resumeDate: "2026-04-01",
        reason: "Family Vacation",
        status: "Active",
        processedBy: "Admin Sarah"
    },
    {
        id: "FRZ-002",
        studentId: "NSM-DXB-089",
        name: "Lina Ahmed",
        branch: "Sharjah",
        freezeDate: "2026-02-15",
        resumeDate: "2026-03-15",
        reason: "Medical Reasons",
        status: "Expired",
        processedBy: "Admin John"
    },
    {
        id: "FRZ-003",
        studentId: "NSM-DXB-102",
        name: "Zaid Ali",
        branch: "Dubai",
        freezeDate: "2026-03-05",
        resumeDate: "2026-03-20",
        reason: "School Exams",
        status: "Active",
        processedBy: "Admin Sarah"
    },
    {
        id: "FRZ-004",
        studentId: "NSM-DXB-015",
        name: "Hana Ibrahim",
        branch: "Abu Dhabi",
        freezeDate: "2026-01-10",
        resumeDate: "2026-02-10",
        reason: "Travel",
        status: "Expired",
        processedBy: "Admin Mike"
    }
];

export default function FreezingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");
    const [monthFilter, setMonthFilter] = useState("March");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#0B213F]">Membership Freezing</h1>
                    <p className="text-muted-foreground font-medium">Manage and track student membership freeze requests</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl font-bold border-border/50 bg-white shadow-sm">
                        <Download className="w-4 h-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Freezes", value: "12", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Pending Requests", value: "3", color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Total This Month", value: "24", color: "text-primaryDark", bg: "bg-primary/5" },
                    { label: "Revenue Impact", value: "AED 4,500", color: "text-slate-600", bg: "bg-slate-50" }
                ].map((stat, i) => (
                    <div key={i} className={stat.bg + " p-4 rounded-2xl border border-border/40"}>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-70">{stat.label}</p>
                        <p className={"text-2xl font-black mt-1 " + stat.color}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-4 rounded-3xl border border-border/50 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search by student name or ID..." 
                            className="pl-10 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Select value={monthFilter} onValueChange={setMonthFilter}>
                            <SelectTrigger className="w-full md:w-[140px] h-11 border-border/50 bg-white rounded-xl font-bold">
                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="January">January</SelectItem>
                                <SelectItem value="February">February</SelectItem>
                                <SelectItem value="March">March</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={branchFilter} onValueChange={setBranchFilter}>
                            <SelectTrigger className="w-full md:w-[140px] h-11 border-border/50 bg-white rounded-xl font-bold">
                                <Filter className="w-4 h-4 mr-2 text-primary" />
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Branches</SelectItem>
                                <SelectItem value="Dubai">Dubai</SelectItem>
                                <SelectItem value="Sharjah">Sharjah</SelectItem>
                                <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/40 shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Student Info</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Freeze Period</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Reason</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4">Status</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-muted-foreground py-4 text-right px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {freezeHistory.filter(f => 
                                (branchFilter === "all" || f.branch === branchFilter) &&
                                (f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
                            ).map((request) => (
                                <TableRow key={request.id} className="hover:bg-muted/10 transition-colors border-border/40">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#0B213F]">{request.name}</span>
                                            <span className="text-xs font-semibold text-primary">{request.studentId} • {request.branch}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{request.freezeDate}</span>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                <span>TO</span>
                                                <span className="text-slate-600 font-bold">{request.resumeDate}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-slate-600 line-clamp-1 max-w-[150px]">{request.reason}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={request.status === "Active" ? "bg-blue-50 text-blue-600 border-blue-200 font-black rounded-lg" : "bg-slate-50 text-slate-500 border-slate-200 font-black rounded-lg"}>
                                            {request.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">Showing 1 to 4 of 24 entries</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 rounded-lg">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 rounded-lg bg-primary/10 text-primary border-primary/20 font-black">1</Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 rounded-lg font-bold">2</Button>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-border/50 rounded-lg">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
