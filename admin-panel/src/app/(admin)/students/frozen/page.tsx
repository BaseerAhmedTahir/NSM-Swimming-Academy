"use client";

import { useState } from "react";
import { Waves, Search, Filter, Calendar, FileText } from "lucide-react";
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
import { frozenStudents as initialFrozen } from "@/lib/mockData";

export default function FrozenStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [frozenList, setFrozenList] = useState(initialFrozen);

    const filtered = frozenList.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Waves className="w-8 h-8 text-primary" />
                        Frozen Memberships
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage and track students who have temporarily frozen their accounts.</p>
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
                    <Select defaultValue="march-2026">
                        <SelectTrigger className="w-full md:w-[200px] border-border/50">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="jan-2026">January 2026</SelectItem>
                            <SelectItem value="feb-2026">February 2026</SelectItem>
                            <SelectItem value="march-2026">March 2026</SelectItem>
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
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Freeze Date</TableHead>
                            <TableHead className="font-bold text-foreground">Expected Resume</TableHead>
                            <TableHead className="font-bold text-foreground">Comment</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((student) => (
                            <TableRow key={student.id} className="hover:bg-muted/30 border-border/50">
                                <TableCell className="font-medium text-muted-foreground">{student.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-foreground">{student.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{student.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{student.branch}</TableCell>
                                <TableCell className="font-medium text-blue-600">{student.freezeDate}</TableCell>
                                <TableCell className="font-medium text-success">{student.expectedResumeDate}</TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground italic">"{student.comment}"</TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-medium">No frozen students found for this period.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
