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

// Mock Data
import { payments as initialPayments } from "@/lib/mockData";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>(initialPayments);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all-branches");

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    // Form State
    const [applyVat, setApplyVat] = useState(true);
    const [isInstallment, setIsInstallment] = useState(false);

    // Handlers
    const handleOpenAdd = () => setIsAddModalOpen(true);

    const handleOpenInvoice = (payment: any) => {
        setSelectedPayment(payment);
        setIsInvoiceModalOpen(true);
    };

    const handleSavePayment = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Payment recorded successfully");
        setIsAddModalOpen(false);
    };

    // Filter active payments by branch
    const activePayments = payments.filter(payment => selectedBranch === "all-branches" ? true : (payment.branch || "Dubai").toLowerCase() === selectedBranch.toLowerCase());

    // Stats
    const totalRevenue = activePayments
        .filter((p: any) => p.status === 'Paid')
        .reduce((sum: number, p: any) => sum + (typeof p.amount === 'string' ? parseInt(p.amount.replace(/,/g, '')) : p.amount), 0);

    const pendingAmount = activePayments
        .filter((p: any) => p.status === 'Pending')
        .reduce((sum: number, p: any) => sum + (typeof p.amount === 'string' ? parseInt(p.amount.replace(/,/g, '')) : p.amount), 0);

    // Search Filter
    const filteredPayments = activePayments.filter(payment =>
        payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Button variant="outline" className="font-bold border-border/50">
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
                                <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Total Revenue (Feb)</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">AED {totalRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-primary/20 text-primary rounded-xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-primary/80 mt-4 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" /> +15% from last month
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
                            <ArrowDownRight className="w-4 h-4" /> 8 students require follow-up
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment Modes</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex flex-col"><span className="text-sm font-black">60%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Credit Card</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-black">30%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Online Links</span></div>
                                    <div className="flex flex-col"><span className="text-sm font-black">10%</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Cash</span></div>
                                </div>
                            </div>
                        </div>
                        {/* Mock Mini Bar Chart */}
                        <div className="w-full h-2 rounded-full overflow-hidden flex mt-6">
                            <div className="h-full bg-primary w-[60%]" />
                            <div className="h-full bg-secondary w-[30%]" />
                            <div className="h-full bg-accent w-[10%]" />
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
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-branches">All Branches</SelectItem>
                            <SelectItem value="dubai">Dubai</SelectItem>
                            <SelectItem value="sharjah">Sharjah</SelectItem>
                            <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-status">
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-modes">
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
                        {filteredPayments.length > 0 ? (
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
                                            <div className={cn("w-2 h-2 rounded-full border", payment.status === 'Paid' ? "bg-success border-success/50" : "bg-warning border-warning/50")} />
                                            <span className={cn("font-bold text-sm", payment.status === 'Paid' ? "text-success" : "text-warning")}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-foreground">
                                        {payment.amount}
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
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-border/50">
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

                        <div className="p-6 grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Select Student <span className="text-error">*</span></Label>
                                    <Select required>
                                        <SelectTrigger><SelectValue placeholder="Search student name or ID..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NSM-DXB-021">Ahmed Ziad (***4567)</SelectItem>
                                            <SelectItem value="NSM-SHJ-044">Sara Ali (***3575)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Transaction Date <span className="text-error">*</span></Label>
                                    <Input type="date" defaultValue="2026-02-24" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Package / Item</Label>
                                    <Select defaultValue="Silver">
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Individual">Individual (1 Class)</SelectItem>
                                            <SelectItem value="Silver">Silver (12 Classes)</SelectItem>
                                            <SelectItem value="Gold">Gold (24 Classes)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex items-end">
                                    <div className="flex items-center space-x-2 border rounded-xl p-2 w-full h-10 bg-muted/10">
                                        <Switch id="pay-renewal" />
                                        <Label htmlFor="pay-renewal" className="cursor-pointer font-bold">Registration Fee Applicable</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-2xl border border-border/50 mt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Payment Method</Label>
                                        <Select defaultValue="Card">
                                            <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Cash">Cash</SelectItem>
                                                <SelectItem value="Card">Credit Card / POS</SelectItem>
                                                <SelectItem value="Online">Online Link</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Discount Applied (AED)</Label>
                                        <Input type="number" placeholder="0" defaultValue="0" className="bg-card" />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <Label className="font-bold">Apply VAT (5%)</Label>
                                        <Switch checked={applyVat} onCheckedChange={setApplyVat} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="font-bold">Status: Pending Installment</Label>
                                        <Switch checked={isInstallment} onCheckedChange={setIsInstallment} />
                                    </div>
                                </div>

                                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm space-y-2 flex flex-col justify-end">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span>AED 1,500</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Discount:</span>
                                        <span className="text-error">- AED 0</span>
                                    </div>
                                    {applyVat && (
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-muted-foreground">VAT (5%):</span>
                                            <span>AED 75</span>
                                        </div>
                                    )}
                                    <div className="h-px w-full bg-border/50 my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-black text-foreground text-lg cursor-pointer">Total Received:</span>
                                        <span className="font-black text-primary text-xl tracking-tight">AED {applyVat ? '1,575' : '1,500'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/10 p-6 border-t border-border/50 flex justify-end gap-3 rounded-b-3xl">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="font-bold shadow-sm">
                                Submit Payment Info
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
                                <p className="text-sm font-medium text-slate-500">{selectedPayment?.date || new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Received From</p>
                                <h3 className="font-black text-lg text-slate-800">{selectedPayment?.studentName || "Ziad Ahmed"}</h3>
                                <p className="text-sm font-medium text-slate-600">ID: NSM-DXB-001</p>
                                <p className="text-sm font-medium text-slate-600">+971 50 123 4567</p>
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
                        <Button onClick={() => { toast.success("Printing invoice..."); setIsInvoiceModalOpen(false); }} className="font-bold gap-2">
                            <Printer className="w-4 h-4" /> Print Receipt
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
