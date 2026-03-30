"use client";

import { useState, useEffect } from "react";
import { Waves, Search, Filter, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
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
import api from "@/lib/api";

export default function FrozenStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("all-time");
    const [frozenList, setFrozenList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchFrozen = () => {
        setIsLoading(true);
        api.get('/freezings')
            .then(res => {
                const results = res.data.data.results || res.data.data;
                setFrozenList(results.map((f: any) => ({
                    freezingId: f.id,
                    id: f.student?.studentId || "N/A",
                    name: f.student?.name || "Unknown",
                    phone: f.student?.phone || "N/A",
                    branch: f.branch?.name || "Unknown",
                    freezeDate: f.freezeStartDate ? new Date(f.freezeStartDate).toLocaleDateString() : "N/A",
                    expectedResumeDate: f.freezeEndDate ? new Date(f.freezeEndDate).toLocaleDateString() : "N/A",
                    comment: f.comment || "No comment",
                    status: f.status
                })));
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchFrozen();
    }, []);

    const handleUnfreeze = async (freezingId: string) => {
        try {
            await api.post(`/freezings/${freezingId}/unfreeze`, { comment: "Unfrozen from admin panel" });
            toast.success("Student unfrozen successfully");
            fetchFrozen();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to unfreeze");
        }
    };

    const filtered = frozenList.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch && s.status === 'FROZEN';
    });

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
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50">
                            <TableHead className="font-bold text-foreground">Student ID</TableHead>
                            <TableHead className="font-bold text-foreground">Name</TableHead>
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Freeze Date</TableHead>
                            <TableHead className="font-bold text-foreground">Expected Resume</TableHead>
                            <TableHead className="font-bold text-foreground">Comment</TableHead>
                            <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoading && filtered.map((student, idx) => (
                            <TableRow key={idx} className="hover:bg-muted/30 border-border/50">
                                <TableCell className="font-medium text-muted-foreground">{student.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-foreground">{student.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{student.phone}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{student.branch}</TableCell>
                                <TableCell className="font-medium text-blue-600">{student.freezeDate}</TableCell>
                                <TableCell className="medium text-success">{student.expectedResumeDate}</TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground italic">"{student.comment}"</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="text-success hover:bg-success/10 font-bold" onClick={() => handleUnfreeze(student.freezingId)}>Unfreeze</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">Loading frozen students...</TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">No frozen students found.</TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
