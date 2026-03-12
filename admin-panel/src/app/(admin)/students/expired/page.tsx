"use client";

import { useState } from "react";
import { History, Search, Filter, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expiredPackages, students } from "@/lib/mockData";

export default function ExpiredPackagesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // Combine expired packages with student names for the list
    const enrichedExpired = expiredPackages.map(pkg => {
        const student = students.find(s => s.id === pkg.studentId);
        return {
            ...pkg,
            studentName: student ? student.name : "Unknown Student",
            phone: student ? student.phone : "N/A",
            branch: student ? student.branch : "N/A"
        };
    });

    const filtered = enrichedExpired.filter(s => 
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" />
                        Expired Packages
                    </h1>
                    <p className="text-muted-foreground mt-1">Review students whose memberships have expired and track their final usage stats.</p>
                </div>
            </div>

            <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-border/50 rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Select defaultValue="all-time">
                        <SelectTrigger className="w-full md:w-[200px] border-border/50">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
                            <SelectItem value="all-time">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0 border-border/50">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="font-bold text-foreground">Student ID</TableHead>
                            <TableHead className="font-bold text-foreground">Name</TableHead>
                            <TableHead className="font-bold text-foreground">Package</TableHead>
                            <TableHead className="font-bold text-foreground">Classes Used</TableHead>
                            <TableHead className="font-bold text-foreground">Expiry Date</TableHead>
                            <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((pkg, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/30 border-border/50">
                                <TableCell className="font-medium text-muted-foreground">{pkg.studentId}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-foreground">{pkg.studentName}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{pkg.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{pkg.packageName}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-black text-primary">{pkg.classesUsed} / {pkg.totalClasses}</p>
                                        <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${(pkg.classesUsed / pkg.totalClasses) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-error">{pkg.expiryDate}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 font-bold">Renew</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-medium">No expired packages found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
