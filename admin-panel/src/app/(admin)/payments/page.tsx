"use client";

import { useState } from "react";
import {
    CreditCard, Search, Filter, Plus, FileText,
    ArrowUpRight, ArrowDownRight, DollarSign, Download, Printer
} from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import api from "@/lib/api";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function PaymentsPage() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all-branches");
    const [selectedStatus, setSelectedStatus] = useState("all-status");
    const [selectedMode, setSelectedMode] = useState("all-modes");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    // Form State
    const [applyVat, setApplyVat] = useState(true);
    const [isInstallment, setIsInstallment] = useState(false);
    const [formData, setFormData] = useState({
        studentId: "",
        amount: 0,
        paidAmount: 0,
        discount: 0,
        packageType: "SILVER",
        paymentMode: "CARD",
        registrationType: "NEW",
        existingPaymentId: null as string | null,
        priorPaidAmount: 0
    });

    // Handlers
    const handleOpenAdd = () => {
        setFormData({
            studentId: "",
            amount: 1500,
            paidAmount: 1500,
            discount: 0,
            packageType: "SILVER",
            paymentMode: "CARD",
            registrationType: "NEW",
            existingPaymentId: null,
            priorPaidAmount: 0
        });
        setIsAddModalOpen(true);
    };

    const handleOpenInvoice = (payment: any) => {
        setSelectedPayment(payment);
        setIsInvoiceModalOpen(true);
    };

    const handleSavePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const finalAmount = formData.amount - formData.discount;
            const totalPaid = (formData.priorPaidAmount || 0) + formData.paidAmount;
            const status = totalPaid >= finalAmount ? 'PAID' : (totalPaid > 0 ? 'PARTIAL' : 'PENDING');
            
            if (formData.existingPaymentId) {
                await api.put(`/payments/${formData.existingPaymentId}`, { 
                    ...formData, 
                    paidAmount: totalPaid,
                    status 
                });
            } else {
                await api.post('/payments', { ...formData, paidAmount: totalPaid, status });
            }
            toast.success("Payment recorded successfully");
            setIsAddModalOpen(false);
            fetchPayments();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to record payment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data.data.results || res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students?limit=1000');
            setAllStudents(res.data.data.results || res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const [allSettings, setAllSettings] = useState<any[]>([]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.success) {
                setAllSettings(res.data.data);
            }
        } catch(e) {}
    };

    useEffect(() => {
        if (!allSettings || allSettings.length === 0 || !formData.studentId) return;
        const student = allStudents.find((s: any) => s.id === formData.studentId);
        if (!student || (!student.branchId && !student.branch?.id)) return;
        const branchId = student.branchId || student.branch?.id;
        
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
    }, [formData.studentId, allSettings, allStudents, branches]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/payments');
            if (res.data.success) {
                const results = res.data.data.results || res.data.data;
                const mapped = results.map((pay: any) => ({
                    id: pay.invoiceNumber || pay.id,
                    serialNumber: pay.serialNumber || null,
                    registrationType: pay.registrationType || 'NEW',
                    studentName: pay.student?.name || "Unknown",
                    studentId: pay.student?.studentId || "N/A",
                    phone: pay.student?.phone || "N/A",
                    trn: pay.student?.trn || "",
                    branch: pay.branch?.name || "",
                    branchId: pay.branchId || "",
                    package: pay.packageType || "Standard",
                    date: new Date(pay.paymentDate || pay.createdAt).toLocaleDateString(),
                    mode: pay.paymentMode || "Card",
                    status: pay.status === 'PAID' ? 'Paid' : (pay.status === 'PARTIAL' ? 'Partial' : 'Pending'),
                    amount: pay.status === 'PAID' ? pay.totalAmount : pay.pendingAmount,
                    paidAmount: pay.paidAmount || 0,
                    realId: pay.id
                }));
                setPayments(mapped);
            }
        } catch (error) {
            console.error("Failed to load payments", error);
            toast.error("Failed to load payments from server");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
        fetchPayments();
        fetchStudents();
        fetchBranches();
    }, []);

    const handleExport = () => {
        if (!payments || payments.length === 0) {
            toast.error("No payments to export");
            return;
        }
        
        const headers = ["Invoice ID", "Student Name", "Package", "Date", "Mode", "Status", "Amount (AED)"];
        const csvContent = [
            headers.join(","),
            ...activePayments.map((p) => [
                p.id,
                `"${p.studentName}"`,
                p.package,
                `"${p.date}"`,
                p.mode,
                p.status,
                p.amount
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter active payments by branchId (matches dropdown value which uses b.id)
    const activePayments = payments.filter(payment => selectedBranch === "all-branches" ? true : payment.branchId === selectedBranch);

    // Stats
    const totalRevenue = activePayments
        .reduce((sum: number, p: any) => sum + (p.paidAmount || (p.status === 'Paid' ? (typeof p.amount === 'string' ? parseInt(p.amount.replace(/,/g, '')) : p.amount) : 0)), 0);

    const pendingPaymentsList = activePayments.filter((p: any) => p.status === 'Pending' || p.status === 'Partial');
    const pendingAmount = pendingPaymentsList.reduce((sum: number, p: any) => sum + (typeof p.amount === 'string' ? parseInt(p.amount.replace(/,/g, '')) : p.amount), 0);

    // Dynamic Payment Mode Distribution
    const totalCount = activePayments.length || 1;
    const modeStats = {
        card: Math.round((activePayments.filter(p => p.mode.toUpperCase() === 'CARD').length / totalCount) * 100),
        online: Math.round((activePayments.filter(p => p.mode.toUpperCase() === 'ONLINE').length / totalCount) * 100),
        cash: Math.round((activePayments.filter(p => p.mode.toUpperCase() === 'CASH').length / totalCount) * 100),
    };

    // Search Filter
    const filteredPayments = activePayments.filter(payment => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = payment.studentName.toLowerCase().includes(query) || payment.id.toLowerCase().includes(query);
        const matchesStatus = selectedStatus === "all-status" || payment.status.toLowerCase() === selectedStatus;
        const matchesMode = selectedMode === "all-modes" || payment.mode.toLowerCase().includes(selectedMode.toLowerCase());
        
        return matchesSearch && matchesStatus && matchesMode;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-primary" />
                        Payments & Fees
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage academy revenue, track pending fees, and generate invoices.</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-border/50" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" /> Export Log
                    </Button>
                    <Button onClick={handleOpenAdd} className="font-bold shadow-sm gap-2">
                        <Plus className="w-4 h-4" /> Record Payment
                    </Button>
                </div>
            </div>

            {/* Stats Cards (4.8.1) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Total Revenue ({new Date().toLocaleString('default', { month: 'short', year: 'numeric' })})</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">AED {totalRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-primary/20 text-primary rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-primary/80 mt-4 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" /> {activePayments.filter((p:any) => p.status === 'Paid').length} paid records
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm bg-warning/5 border-warning/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-warning uppercase tracking-wider mb-1">Pending Fees</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">AED {pendingAmount.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-warning/20 text-warning rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-warning/80 mt-4 flex items-center gap-1">
                            <ArrowDownRight className="w-4 h-4" /> {pendingPaymentsList.length} records require follow-up
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment Modes</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex flex-col"><span className="text-sm font-black">{modeStats.card}%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Card</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-black">{modeStats.online}%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Online</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-black">{modeStats.cash}%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Cash</span></div>
                                </div>
                            </div>
                        </div>
                        {/* Dynamic Mini Bar Chart */}
                        <div className="w-full h-2 rounded-full overflow-hidden flex mt-6 bg-muted">
                            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${modeStats.card}%` }} />
                            <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${modeStats.online}%` }} />
                            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${modeStats.cash}%` }} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by invoice ID or student name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {user?.role === 'SUPER_ADMIN' && (
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white">
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
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedMode} onValueChange={setSelectedMode}>
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white">
                            <SelectValue placeholder="Pay Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-modes">All Modes</SelectItem>
                            <SelectItem value="card">Credit Card</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table (4.8.4) */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="font-bold text-foreground">Invoice ID</TableHead>
                            <TableHead className="font-bold text-foreground">Student Name</TableHead>
                            <TableHead className="font-bold text-foreground">Package</TableHead>
                            <TableHead className="font-bold text-foreground">Date</TableHead>
                            <TableHead className="font-bold text-foreground">Pay Mode</TableHead>
                            <TableHead className="font-bold text-foreground">Status</TableHead>
                            <TableHead className="font-bold text-foreground text-right">Amount (AED)</TableHead>
                            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground font-medium">Fetching secure records...</TableCell>
                            </TableRow>
                        ) : filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-muted/30 border-border/50 transition-colors cursor-pointer" onClick={() => handleOpenInvoice(payment)}>
                                    <TableCell className="font-bold text-primary">{payment.id}</TableCell>
                                    <TableCell>
                                        <p className="font-bold text-foreground">{payment.studentName}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium text-muted-foreground">{payment.package || "Silver"}</span>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-muted-foreground">{payment.date}</TableCell>
                                    <TableCell>
                                        <span className="bg-muted px-2 py-1 rounded text-xs font-bold border border-border">
                                            {payment.mode}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full border", payment.status === 'Paid' ? "bg-success border-success/50" : (payment.status === 'Partial' ? "bg-blue-500 border-blue-500/50" : "bg-warning border-warning/50"))} />
                                            <span className={cn("font-bold text-sm", payment.status === 'Paid' ? "text-success" : (payment.status === 'Partial' ? "text-blue-500" : "text-warning"))}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-foreground">
                                        {payment.status === 'Partial' || payment.status === 'Pending' ? (
                                            <span className="text-warning">AED {payment.amount} <span className="text-[10px] uppercase text-muted-foreground block leading-none">Left</span></span>
                                        ) : (
                                            `AED ${payment.amount}`
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 text-muted-foreground" onClick={(e) => { e.stopPropagation(); handleOpenInvoice(payment); }}>
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                                    <Search className="w-10 h-10 mb-4 opacity-20 mx-auto" />
                                    <p className="font-bold text-lg text-foreground">No records found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- RECORD PAYMENT FORM (4.8.2) --- */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-3xl max-h-[95vh] rounded-3xl p-0 border-border/50 flex flex-col">
                    <form onSubmit={handleSavePayment}>
                        <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black">Record Payment</DialogTitle>
                                <DialogDescription className="font-medium text-primary">
                                    Process a standalone payment or renewal fee for a student.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-5 grid gap-5 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Select Student <span className="text-error">*</span></Label>
                                    <Select value={formData.studentId} onValueChange={(v) => {
                                        const std = allStudents.find((s: any) => s.id === v);
                                        const latestPayment = std?.payments?.[0];
                                        const activePackage = std?.packageType || std?.activePackage?.packageType || "SILVER";
                                        
                                        if (std) {
                                            if (latestPayment && latestPayment.status !== 'PAID') {
                                                setFormData(prev => ({
                                                    ...prev, 
                                                    studentId: v, 
                                                    existingPaymentId: latestPayment.id,
                                                    priorPaidAmount: latestPayment.paidAmount || 0,
                                                    amount: latestPayment.totalAmount + (latestPayment.discount || 0),
                                                    paidAmount: 0,
                                                    discount: latestPayment.discount || 0,
                                                    packageType: latestPayment.packageType || activePackage
                                                }));
                                            } else {
                                                // Find package details from state to autofill price
                                                const pkgDetails = dynamicPackages.find(p => p.id === activePackage);
                                                setFormData(prev => ({
                                                    ...prev, 
                                                    studentId: v, 
                                                    existingPaymentId: null,
                                                    priorPaidAmount: 0,
                                                    packageType: activePackage,
                                                    amount: pkgDetails ? pkgDetails.price : 1500,
                                                    paidAmount: 0,
                                                    discount: 0
                                                }));
                                            }
                                        }
                                    }} required>
                                        <SelectTrigger className="w-full h-10 overflow-hidden"><SelectValue placeholder="Search student name or ID..." /></SelectTrigger>
                                        <SelectContent className="max-h-[300px]">
                                            {allStudents.filter((s: any) => selectedBranch === "all-branches" || s.branchId === selectedBranch || s.branch?.id === selectedBranch).map((s: any) => {
                                                const hasPending = s.payments?.[0] && s.payments[0].status !== 'PAID';
                                                return (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.name} ({s.studentId}) 
                                                        {hasPending ? ` - Unpaid: AED ${s.payments[0].totalAmount}` : ''}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transaction Date <span className="text-error">*</span></Label>
                                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Package / Item</Label>
                                    <Select value={formData.packageType} onValueChange={(v) => setFormData({...formData, packageType: v})}>
                                        <SelectTrigger className="w-full h-10"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {dynamicPackages.length > 0 ? dynamicPackages.map(pkg => (
                                                <SelectItem key={pkg.id} value={pkg.id}>
                                                    {pkg.name} ({pkg.classes} Classes - AED {pkg.price})
                                                </SelectItem>
                                            )) : (
                                                <>
                                                    <SelectItem value="INDIVIDUAL">Individual (1 Class)</SelectItem>
                                                    <SelectItem value="BASIC">Basic (8 Classes)</SelectItem>
                                                    <SelectItem value="SILVER">Silver (12 Classes)</SelectItem>
                                                    <SelectItem value="GOLD">Gold (24 Classes)</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex items-end">
                                    <div className="flex items-center space-x-2 border rounded-xl p-2 w-full h-10 bg-muted/10">
                                        <Switch 
                                            id="pay-renewal" 
                                            checked={formData.registrationType === 'RENEW'} 
                                            onCheckedChange={(c) => setFormData({...formData, registrationType: c ? 'RENEW' : 'NEW'})}
                                        />
                                        <Label htmlFor="pay-renewal" className="cursor-pointer font-bold text-sm leading-tight">Registration Fee Applicable</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-2xl border border-border/50 mt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <Select value={formData.paymentMode} onValueChange={(v) => setFormData({...formData, paymentMode: v})}>
                                            <SelectTrigger className="bg-card w-full h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CASH">Cash</SelectItem>
                                                <SelectItem value="CARD">Credit Card / POS</SelectItem>
                                                <SelectItem value="ONLINE">Online Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Total Amount (AED)</Label>
                                        <Input 
                                            type="number" 
                                            value={formData.amount} 
                                            readOnly
                                            className="bg-muted/50 cursor-not-allowed font-medium" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Paid Amount Today (AED)</Label>
                                        <Input 
                                            type="number" 
                                            step="any"
                                            value={formData.paidAmount === 0 ? '' : formData.paidAmount} 
                                            onChange={(e) => setFormData({...formData, paidAmount: e.target.value === '' ? 0 : parseFloat(e.target.value)})} 
                                            className="bg-card font-bold text-primary" 
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Discount Applied (AED)</Label>
                                        <Input 
                                            type="number" 
                                            step="any"
                                            value={formData.discount === 0 ? '' : formData.discount} 
                                            onChange={(e) => setFormData({...formData, discount: e.target.value === '' ? 0 : parseFloat(e.target.value)})} 
                                            className="bg-card" 
                                        />
                                    </div>
                                </div>

                                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-2 flex flex-col justify-end">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span>AED {formData.amount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span className="text-error">- AED {formData.discount}</span>
                                    </div>
                                    {formData.existingPaymentId && formData.priorPaidAmount > 0 && (
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-muted-foreground">Previously Paid:</span>
                                            <span className="text-success">- AED {formData.priorPaidAmount}</span>
                                        </div>
                                    )}
                                    <div className="h-px w-full bg-border/50 my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-black text-foreground text-lg cursor-pointer">
                                            {formData.existingPaymentId ? "Remaining Balance:" : "Total Due:"}
                                        </span>
                                        <span className="font-black text-primary text-xl tracking-tight">
                                            AED {formData.amount - formData.discount - (formData.priorPaidAmount || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold text-muted-foreground text-sm">After Today's Payment:</span>
                                        <span className="font-bold text-error text-sm tracking-tight">
                                            AED {Math.max(0, (formData.amount - formData.discount - (formData.priorPaidAmount || 0)) - formData.paidAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/10 p-4 border-t border-border/50 flex justify-end gap-3 rounded-b-3xl shrink-0">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="font-bold shadow-sm" disabled={!formData.studentId || isSubmitting}>
                                {!formData.studentId ? "Select a student first" : "Submit Payment Info"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- INVOICE VIEW MODAL (4.8.3) --- */}
            <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                <DialogContent className="max-w-2xl bg-white text-black p-0 rounded-none border shadow-2xl">
                    <DialogTitle className="sr-only">Invoice Details</DialogTitle>
                    <div className="p-10 space-y-8 print:p-0 print:shadow-none bg-white min-h-[500px]">

                        <div className="flex justify-between items-start border-b-2 border-black/10 pb-6">
                            <div>
                                <h1 className="text-3xl font-black text-blue-500 tracking-tighter">NSM</h1>
                                <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest mt-1">Swimming Academy</h2>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Dubai Head Office<br />+971 50 123 4567<br />info@nsmswim.com</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-black text-slate-200 tracking-tighter uppercase">Receipt</h2>
                                <p className="font-bold text-slate-800 mt-2 hover:text-blue-500 cursor-pointer">{selectedPayment?.id || "INV-2026-0892"}</p>
                                {selectedPayment?.serialNumber && (
                                    <p className="text-sm font-black text-blue-600 mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">
                                        Serial: {selectedPayment.serialNumber}
                                    </p>
                                )}
                                <p className="text-sm font-medium text-slate-500 mt-1">{selectedPayment?.date || new Date().toLocaleDateString()}</p>
                                {selectedPayment?.registrationType && (
                                    <span className={cn(
                                        "inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                        selectedPayment.registrationType === 'RENEW'
                                            ? "bg-violet-100 text-violet-700"
                                            : "bg-emerald-100 text-emerald-700"
                                    )}>
                                        {selectedPayment.registrationType === 'RENEW' ? 'RENEWAL' : 'NEW REGISTRATION'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                                <h3 className="font-black text-lg text-slate-800">{selectedPayment?.studentName || "Ziad Ahmed"}</h3>
                                <p className="text-sm font-medium text-slate-600">ID: {selectedPayment?.studentId || "NSM-DXB-001"}</p>
                                <p className="text-sm font-medium text-slate-600">{selectedPayment?.phone || "+971 50 123 4567"}</p>
                                {selectedPayment?.trn && (
                                    <p className="text-sm font-bold text-blue-600 mt-1">TRN: {selectedPayment.trn}</p>
                                )}
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Info</p>
                                <p className="font-bold text-slate-800">Status: <span className={selectedPayment?.status === 'Pending' ? "text-yellow-600" : "text-green-600"}>{selectedPayment?.status || "PAID"}</span></p>
                                <p className="text-sm font-medium text-slate-600">Mode: {selectedPayment?.mode || "Credit Card"}</p>
                            </div>
                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-800">
                                    <th className="py-3 font-black text-slate-800 uppercase tracking-wider text-xs">Description</th>
                                    <th className="py-3 font-black text-slate-800 text-right uppercase tracking-wider text-xs">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="py-4">
                                        <p className="font-bold text-slate-800">Swimming Package - {selectedPayment?.package || "Silver"}</p>
                                        <p className="text-sm text-slate-500 font-medium">Academy Registration and Coaching Fees</p>
                                    </td>
                                    <td className="py-4 font-bold text-slate-800 text-right">AED {selectedPayment?.amount || "1,500.00"}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end pt-4">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between items-center border-t-2 border-slate-800 pt-3">
                                    <span className="font-black text-xl text-slate-800 uppercase">Total</span>
                                    <span className="font-black text-xl text-blue-500">AED {selectedPayment?.amount || "1,500.00"}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-slate-100 p-4 flex justify-end gap-3 border-t">
                        <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>Close</Button>
                        <Button onClick={async () => { 
                            try {
                                if (!selectedPayment?.id) {
                                    toast.error("Invoice ID not found");
                                    return;
                                }
                                
                                toast.loading("Preparing PDF...", { id: "downloading-receipt" });
                                setIsInvoiceModalOpen(false); 
                                
                                const response = await api.get(`/invoices/${selectedPayment.realId || selectedPayment.id}/download`, {
                                    responseType: 'blob'
                                });
                                
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `Invoice_${selectedPayment.invoiceNumber || selectedPayment.id}.pdf`);
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                                window.URL.revokeObjectURL(url);
                                
                                toast.success("Receipt downloaded successfully", { id: "downloading-receipt" });
                            } catch (err) {
                                console.error("Download error:", err);
                                toast.error("Failed to download receipt", { id: "downloading-receipt" });
                            }
                        }} className="font-bold gap-2">
                            <Printer className="w-4 h-4" /> Print Receipt
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
