"use client";

import { useState, useEffect } from "react";
import { UserMinus, Search, Filter, CheckCircle2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export default function CancelledStudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [cancelledList, setCancelledList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modal & Renew State
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [renewData, setRenewData] = useState({
        packageType: "BASIC",
        paymentMode: "CARD",
        paymentStatus: "PAID",
        paidAmount: 0
    });
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [allSettings, setAllSettings] = useState<any[]>([]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.success) {
                setAllSettings(res.data.data);
            }
        } catch(e) {
            console.error("Failed to load settings", e);
        }
    };

    const fetchCancellations = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/cancellations');
            const results = res.data.data.results || res.data.data;
            setCancelledList(results.map((c: any) => ({
                id: c.student?.studentId || "N/A",
                dbId: c.studentId, // Actual Student DB ID
                name: c.student?.name || "Unknown",
                phone: c.student?.phone || "N/A",
                branch: c.branch?.name || "Unknown",
                branchId: c.branchId || c.student?.branchId,
                cancelDate: c.cancellationDate ? new Date(c.cancellationDate).toLocaleDateString() : "N/A",
                reason: c.reason || "No reason provided"
            })));
        } catch (error) {
            console.error("Failed to fetch cancellations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
        fetchCancellations();
    }, []);

    useEffect(() => {
        if (!allSettings || allSettings.length === 0 || !selectedStudent) return;
        
        let branchPackages: any[] = [];
        let packagesToUse: any[] = [];
        let branchPrefix = '';
        
        const branchId = selectedStudent.branchId || selectedStudent.raw?.branchId;
        
        if (branchId) {
            branchPrefix = `_${branchId}`;
            branchPackages = allSettings.filter((s: any) => s.key.startsWith('PACKAGE_') && s.key.endsWith(branchPrefix));
            packagesToUse = branchPackages;
        }

        if (branchPackages.length === 0) {
            packagesToUse = allSettings.filter((s: any) => /^PACKAGE_[A-Z_]+$/.test(s.key) && !s.key.includes('_' + branchId)); // Rough fallback
        }

        const pkgs = packagesToUse.map((s:any) => {
            const parsed = JSON.parse(s.value);
            let baseKey = branchPrefix ? s.key.replace(branchPrefix, '') : s.key;
            return {
                id: baseKey.replace('PACKAGE_', ''),
                name: baseKey.replace('PACKAGE_', '').charAt(0) + baseKey.replace('PACKAGE_', '').slice(1).toLowerCase() + " Package",
                classes: parsed.classes,
                price: parsed.price
            };
        });

        setDynamicPackages(pkgs);
        if (pkgs.length > 0) {
            setRenewData(prev => ({ ...prev, packageType: pkgs[0].id }));
        }
    }, [selectedStudent, allSettings]);

    const handleOpenRenew = (student: any) => {
        setSelectedStudent(student);
        setIsRenewModalOpen(true);
    };

    const handleRenewMembership = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post(`/students/${selectedStudent.dbId}/renew`, renewData);
            toast.success("Membership renewed successfully");
            setIsRenewModalOpen(false);
            fetchCancellations();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to renew membership");
        } finally {
            setIsProcessing(false);
        }
    };

    const filtered = cancelledList.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const selectedRenewPackageObj = dynamicPackages.find(p => p.id === renewData.packageType);
    const renewBaseAmount = selectedRenewPackageObj ? Number(selectedRenewPackageObj.price) : 0;
    const renewVatAmount = parseFloat((renewBaseAmount * 0.05).toFixed(2));
    const renewTotalAmount = renewBaseAmount + renewVatAmount;
    const renewPendingAmount = Math.max(0, renewTotalAmount - (renewData.paidAmount || 0));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <UserMinus className="w-8 h-8 text-error" />
                        Cancelled Memberships
                    </h1>
                    <p className="text-muted-foreground mt-1">Review students who have cancelled their memberships and their reasons.</p>
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
                            <TableHead className="font-bold text-foreground">Cancel Date</TableHead>
                            <TableHead className="font-bold text-foreground">Reason</TableHead>
                            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
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
                                <TableCell className="font-medium text-error">{student.cancelDate}</TableCell>
                                <TableCell className="max-w-xs truncate text-muted-foreground font-medium">{student.reason}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-xl border-border/50 p-1">
                                            <DropdownMenuLabel className="text-xs uppercase text-muted-foreground tracking-wider font-bold px-2 py-1.5">Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-border/50" />
                                            <DropdownMenuItem className="cursor-pointer font-medium hover:bg-success/10 text-success rounded-lg p-2" onClick={() => handleOpenRenew(student)}>
                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Reactivate / Renew
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium">Loading cancelled students...</TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium">No cancelled students found.</TableCell>
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
                                <DialogTitle className="text-xl font-black">Reactivate Membership</DialogTitle>
                                <DialogDescription className="font-medium text-success">
                                    {selectedStudent?.name}
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
                            {renewData.paymentStatus === 'PARTIAL' && (
                                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Total Package Amount</Label>
                                        <p className="text-lg font-black text-foreground">AED {renewTotalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Paid Amount (AED)</Label>
                                        <Input 
                                            type="number" 
                                            step="any"
                                            min="0"
                                            max={renewTotalAmount}
                                            placeholder="Enter amount paid"
                                            value={renewData.paidAmount === 0 ? '' : renewData.paidAmount}
                                            onChange={(e) => setRenewData({...renewData, paidAmount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2 pt-2 border-t border-border/50">
                                        <Label className="text-muted-foreground">Pending Balance</Label>
                                        <p className="text-lg font-bold text-warning">AED {renewPendingAmount.toFixed(2)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-muted/10 p-6 border-t border-border/50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsRenewModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isProcessing} className="bg-success hover:bg-success/90 text-white rounded-xl shadow-sm text-sm font-bold">
                                {isProcessing ? "Processing..." : "Confirm Reactivation"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
