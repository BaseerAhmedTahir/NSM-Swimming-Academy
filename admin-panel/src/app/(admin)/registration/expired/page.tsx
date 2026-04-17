"use client";

import { useState } from "react";
import { History, Search, Filter, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import api from "@/lib/api";

export default function ExpiredPackagesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("all-time");
    const [expiredList, setExpiredList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [renewData, setRenewData] = useState({
        packageType: "BASIC",
        paymentMode: "CARD",
        paymentStatus: "PAID"
    });

    const fetchExpired = async () => {
        setIsLoading(true);
        // Query the persistent history table — includes students renewed after expiry
        api.get('/students/expired-history')
            .then(res => {
                const results = res.data.data.results || res.data.data;
                setExpiredList(results.map((h: any) => ({
                    id: h.student?.id || h.studentId,
                    studentId: h.student?.studentId || h.studentId,
                    studentName: h.student?.name || "Unknown",
                    phone: h.student?.phone || "N/A",
                    branch: h.student?.branch?.name || "Unknown",
                    branchId: h.student?.branchId,
                    packageName: h.packageType ? (h.packageType.charAt(0) + h.packageType.slice(1).toLowerCase() + ' Package') : 'Standard Package',
                    classesUsed: h.classesUsed || 0,
                    totalClasses: h.totalClasses || 0,
                    expiryDate: h.expiryDate ? new Date(h.expiryDate).toISOString().split('T')[0] : 'N/A',
                    historyStatus: h.status, // COMPLETED or EXPIRED
                    studentStatus: h.student?.status, // EXPIRED = not yet renewed, ACTIVE = already renewed
                })));
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    };

    const [allSettings, setAllSettings] = useState<any[]>([]);
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);

    const fetchSettings = async () => {
        try {
            const [setRes, brRes] = await Promise.all([
                api.get('/settings'),
                api.get('/branches')
            ]);
            if (setRes.data.success) {
                setAllSettings(setRes.data.data);
            }
            if (brRes.data.success) {
                setBranches(brRes.data.data.results || brRes.data.data);
            }
        } catch(e) { console.error(e); }
    };

    useEffect(() => {
        if (!allSettings || allSettings.length === 0 || !selectedStudent || !selectedStudent.branchId) return;
        const branchId = selectedStudent.branchId;
        const branchPrefix = `_${branchId}`;

        let branchPackages = allSettings.filter((s: any) => s.key.startsWith('PACKAGE_') && s.key.endsWith(branchPrefix));
        let packagesToUse = branchPackages;

        if (branchPackages.length === 0) {
            packagesToUse = allSettings.filter((s: any) => /^PACKAGE_[A-Z_]+$/.test(s.key) && !branches.some((b:any) => s.key.endsWith('_' + b.id)));
        }

        const pkgs = packagesToUse.map((s:any) => {
            const parsed = JSON.parse(s.value);
            let baseKey = s.key.replace(branchPrefix, '');
            return {
                id: baseKey.replace('PACKAGE_', ''),
                name: baseKey.replace('PACKAGE_', '').charAt(0) + baseKey.replace('PACKAGE_', '').slice(1).toLowerCase() + " Package",
                classes: parsed.classes,
                price: parsed.price,
                durationMonths: parsed.durationMonths || 1
            };
        });

        setDynamicPackages(pkgs);
        if (pkgs.length > 0) {
            setRenewData(prev => {
                const isValid = pkgs.some((p: any) => p.id === prev.packageType);
                return isValid ? prev : { ...prev, packageType: pkgs[0].id };
            });
        }
    }, [selectedStudent, allSettings, branches]);

    useEffect(() => {
        fetchSettings();
        fetchExpired();
    }, []);

    const handleOpenRenew = (student: any) => {
        setSelectedStudent(student);
        setIsRenewModalOpen(true);
    };

    const handleRenewMembership = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post(`/students/${selectedStudent.id}/renew`, renewData);
            toast.success("Membership renewed successfully");
            setIsRenewModalOpen(false);
            fetchExpired();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to renew membership");
        } finally {
            setIsProcessing(false);
        }
    };


    const now = new Date();
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const filtered = expiredList.filter(s => {
        const matchesSearch = (s.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase());
        let matchesPeriod = true;
        if (selectedPeriod === "this-month") {
            matchesPeriod = s.expiryDate?.startsWith(thisMonthStr);
        } else if (selectedPeriod === "last-month") {
            matchesPeriod = s.expiryDate?.startsWith(lastMonthStr);
        }
        return matchesSearch && matchesPeriod;
    });

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
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="w-full md:w-[200px] border-border/50">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-time">All Time</SelectItem>
                            <SelectItem value="this-month">This Month</SelectItem>
                            <SelectItem value="last-month">Last Month</SelectItem>
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
                            <TableHead className="font-bold text-foreground">Status</TableHead>
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
                                <TableCell>
                                    {pkg.historyStatus === 'COMPLETED' ? (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-success/10 text-success">Renewed</span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-warning/10 text-warning">Expired Now</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {pkg.historyStatus !== 'COMPLETED' ? (
                                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 font-bold" onClick={() => handleOpenRenew(pkg)}>Renew</Button>
                                    ) : (
                                        <span className="text-xs text-success font-bold">✓ Renewed</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">Loading expired students...</TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">No expired packages found.</TableCell>
                            </TableRow>
                        ) : null}
                    </TableBody>
                </Table>
            </div>

            {/* --- RENEW MEMBERSHIP MODAL --- */}
            <Dialog open={isRenewModalOpen} onOpenChange={setIsRenewModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-border/50">
                    <form onSubmit={handleRenewMembership}>
                        <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-success text-white flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black">Renew Membership</DialogTitle>
                                <DialogDescription className="font-medium text-success">
                                    {selectedStudent?.studentName}
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-6 grid gap-4">
                            <div className="space-y-2">
                                <Label>Package</Label>
                                <Select value={renewData.packageType} onValueChange={(v) => setRenewData({...renewData, packageType: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {dynamicPackages.length > 0 ? dynamicPackages.map(pkg => (
                                            <SelectItem key={pkg.id} value={pkg.id}>
                                                {pkg.name} ({pkg.classes} Classes - AED {pkg.price})
                                            </SelectItem>
                                        )) : (
                                            <>
                                                <SelectItem value="BASIC">Basic (8 Classes)</SelectItem>
                                                <SelectItem value="SILVER">Silver (12 Classes)</SelectItem>
                                                <SelectItem value="GOLD">Gold (24 Classes)</SelectItem>
                                                <SelectItem value="PLATINUM">Platinum</SelectItem>
                                                <SelectItem value="INDIVIDUAL">Individual (1 Class)</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Mode</Label>
                                <Select value={renewData.paymentMode} onValueChange={(v) => setRenewData({...renewData, paymentMode: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="CARD">Credit Card / POS</SelectItem>
                                        <SelectItem value="ONLINE">Online Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Status</Label>
                                <Select value={renewData.paymentStatus} onValueChange={(v) => setRenewData({...renewData, paymentStatus: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PAID">Paid</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="PARTIAL">Partial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="bg-muted/10 p-6 border-t border-border/50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsRenewModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isProcessing} className="bg-success hover:bg-success/90 text-white rounded-xl shadow-sm text-sm font-bold">
                                {isProcessing ? "Processing..." : "Confirm Renewal"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
