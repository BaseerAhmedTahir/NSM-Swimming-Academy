"use client";

import { useState } from "react";
import {
    Users, Plus, Search, Filter, MoreHorizontal,
    Trash2, Edit, Eye, FileText, CheckCircle2, UserPlus, Printer, Activity, UserMinus,
    DollarSign, CreditCard, ChevronDown, ChevronUp, Gift
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import api from "@/lib/api";
import { useEffect } from "react";
import AddStudentModal from "@/components/students/AddStudentModal";
import StudentDetailModal from "@/components/students/StudentDetailModal";
import { useAuth } from "@/context/AuthContext";

export default function RegistrationPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all-branches");
    const [selectedStatus, setSelectedStatus] = useState("all-status");
    const [isLoading, setIsLoading] = useState(true);
    const [branches, setBranches] = useState<any[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const pageSize = 10;

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



    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            const data = res.data.data.results || res.data.data;
            setBranches(data);
        } catch (error) {
            console.error("Failed to load branches", error);
        }
    };

    useEffect(() => {
        fetchSettings();
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [currentPage]);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/students?page=${currentPage}&limit=${pageSize}`);
            if (res.data.success) {
                const results = res.data.data.results || res.data.data;
                setTotalEntries(res.data.data.total || results.length);
                
                // Map backend structure to the UI expected format
                const mapped = results.map((s: any) => {
                    const latestPayment = s.payments?.[0];
                    return {
                        id: s.id,
                        studentId: s.studentId,
                        name: s.name,
                        phone: s.phone,
                        email: s.email,
                        gender: s.gender,
                        age: s.age,
                        trn: s.trn,
                        category: s.category,
                        packageType: s.packageType,
                        level: s.level || "All Levels",
                        branch: s.branch?.name || "Unknown Branch",
                        branchId: s.branchId,
                        membership: s.packageType || "None",
                        status: s.status,
                        membershipStartDate: s.membershipStartDate,
                        membershipExpiryDate: s.membershipExpiryDate,
                        freeClasses: s.membershipHistory?.[0]?.freeClasses ?? 0,
                        oldClasses: s.membershipHistory?.[0]?.oldClasses ?? 0,
                        attendance: {
                            totalClasses: s.membershipHistory?.[0]?.totalClasses ?? 0,
                            freeClasses: s.membershipHistory?.[0]?.freeClasses ?? 0,
                            oldClasses: s.membershipHistory?.[0]?.oldClasses ?? 0,
                            attended: s.membershipHistory?.[0]?.classesUsed ?? 0,
                            startDate: s.membershipStartDate ? new Date(s.membershipStartDate).toISOString().split('T')[0] : "N/A",
                            expiryDate: s.membershipExpiryDate ? new Date(s.membershipExpiryDate).toISOString().split('T')[0] : "N/A",
                        },
                        fee: {
                            invoiceNumber: latestPayment?.invoiceNumber || "N/A",
                            status: latestPayment?.status || "Pending",
                            amount: latestPayment?.totalAmount || 0,
                            paidAmount: latestPayment?.paidAmount || 0,
                            pendingAmount: latestPayment?.pendingAmount || 0,
                            mode: latestPayment?.paymentMode || "Card",
                            discount: latestPayment?.discount || 0,
                            date: latestPayment?.paymentDate ? new Date(latestPayment.paymentDate).toLocaleDateString() : "N/A",
                            paymentId: latestPayment?.id
                        },
                        raw: s // Keep the raw backend object for edit/detail modals
                    };
                });
                setStudents(mapped);
            }
        } catch (error) {
            console.error("Failed to load students", error);
            toast.error("Failed to load students from server");
        } finally {
            setIsLoading(false);
        }
    };

    // Modals State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [isReceivePaymentOpen, setIsReceivePaymentOpen] = useState(false);
    
    const [renewData, setRenewData] = useState({
        packageType: "BASIC",
        paymentMode: "CARD",
        paymentStatus: "PAID",
        paidAmount: 0,
        freeClasses: 0,
        oldClasses: 0
    });

    // Receive Payment State
    const [receivePaymentData, setReceivePaymentData] = useState({ amount: 0, paymentMode: 'CASH', notes: '' });
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [expandedHistoryIdx, setExpandedHistoryIdx] = useState<number | null>(null);

    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [membershipHistory, setMembershipHistory] = useState<any[]>([]);

    // Form State for Add/Edit
    const [isEditMode, setIsEditMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
            packagesToUse = allSettings.filter((s: any) => /^PACKAGE_[A-Z_]+$/.test(s.key) && !branches.some((b:any) => s.key.endsWith('_' + b.id)));
        }

        const pkgs = packagesToUse.map((s:any) => {
            const parsed = JSON.parse(s.value);
            let baseKey = branchPrefix ? s.key.replace(branchPrefix, '') : s.key;
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

    // Handlers
    const handleOpenAdd = () => {
        setIsEditMode(false);
        setSelectedStudent(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (student: any) => {
        setIsEditMode(true);
        // Merge mapped fee data into raw so the modal can pre-fill partial payment fields
        const rawWithFee = {
            ...(student.raw || student),
            paymentStatus: student.fee?.status || student.raw?.paymentStatus,
            paidAmount:    student.fee?.paidAmount ?? 0,
            pendingAmount: student.fee?.pendingAmount ?? 0,
        };
        setSelectedStudent(rawWithFee);
        setIsAddModalOpen(true);
    };

    const handleOpenStudentDetails = async (student: any) => {
        setSelectedStudent(student);
        setIsDetailModalOpen(true);
    };

    const handleOpenDelete = (student: any) => {
        setSelectedStudent(student.raw || student);
        setIsDeleteModalOpen(true);
    };

    const handleReactivate = async (student: any) => {
        setIsProcessing(true);
        try {
            await api.post(`/students/${student.id}/activate`, {});
            toast.success("Membership reactivated successfully");
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reactivate membership");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenRenew = (student: any) => {
        setSelectedStudent(student.raw || student);
        setIsRenewModalOpen(true);
    };

    const handleRenewMembership = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        try {
            await api.post(`/students/${selectedStudent.id}/renew`, renewData);
            toast.success("Membership renewed successfully");
            setIsRenewModalOpen(false);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to renew membership");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenCancel = (student: any) => {
        setSelectedStudent(student);
        setIsCancelModalOpen(true);
    };

    const handleCancelMembership = async () => {
        if (!selectedStudent) return;
        setIsProcessing(true);
        try {
            await api.post(`/cancellations`, {
                studentId: selectedStudent.id,
                reason: "Cancelled by admin",
                cancellationDate: new Date().toISOString().split('T')[0],
                feesTaken: 0,
                refundAmount: 0
            });
            toast.success("Membership cancelled successfully");
            setIsCancelModalOpen(false);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to cancel membership");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedStudent) return;
        setIsProcessing(true);
        try {
            await api.delete(`/students/${selectedStudent.id}`);
            toast.success("Student deleted successfully");
            setIsDeleteModalOpen(false);
            fetchStudents();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete student");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenReceivePayment = async (student: any) => {
        setSelectedStudent(student);
        setReceivePaymentData({ amount: student.fee?.pendingAmount || 0, paymentMode: student.fee?.mode === 'CARD' ? 'CARD' : 'CASH', notes: '' });
        setPaymentHistory([]);
        setIsReceivePaymentOpen(true);

        // Fetch payment history
        try {
            const res = await api.get(`/payments/student/${student.id}/history`);
            if (res.data.success) {
                setPaymentHistory(res.data.data);
            }
        } catch (err) {
            console.error("Failed to load payment history", err);
        }
    };

    const handleReceivePayment = async () => {
        if (!selectedStudent || receivePaymentData.amount <= 0) return;
        const paymentId = selectedStudent.fee?.paymentId;
        if (!paymentId) {
            toast.error("No payment record found for this student");
            return;
        }
        setIsProcessing(true);
        try {
            await api.post(`/payments/${paymentId}/receive`, receivePaymentData);
            toast.success("Payment received successfully!");
            setIsReceivePaymentOpen(false);
            fetchStudents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to receive payment");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateInvoice = async (student: any = null) => {
        if (student) setSelectedStudent(student);
        const paymentId = student?.fee?.paymentId;
        
        if (paymentId) {
            try {
                toast.loading("Fetching invoice details...", { id: "fetching-invoice" });
                const res = await api.get(`/payments/${paymentId}`);
                if (res.data.success) {
                    setSelectedInvoice(res.data.data);
                    toast.success("Invoice loaded", { id: "fetching-invoice" });
                }
            } catch (err: any) {
                console.error("Failed to fetch full invoice details", err);
                const msg = err.response?.data?.message || err.message || "Network Error";
                toast.error(`Could not load full details: ${msg}. Showing basic info.`, { id: "fetching-invoice" });
                
                // Fallback: Use basic student fee data if full fetch fails
                if (student?.fee) {
                    setSelectedInvoice({
                        invoiceNumber: student.fee.invoiceNumber,
                        totalAmount: student.fee.amount,
                        paidAmount: student.fee.status === 'PAID' ? student.fee.amount : 0,
                        status: student.fee.status,
                        paymentMode: student.fee.mode,
                        paymentDate: student.fee.date,
                        student: { name: student.name, studentId: student.studentId }
                    });
                }
            }
        } else {
            setSelectedInvoice(null);
        }
        setIsInvoiceModalOpen(true);
    };

    // Filtering
    const filteredStudents = students.filter(student => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = student.name.toLowerCase().includes(query) || student.studentId?.toLowerCase().includes(query) || student.phone.includes(query);
        const matchesBranch = selectedBranch === "all-branches" || student.branchId === selectedBranch;
        const matchesStatus = selectedStatus === "all-status" || student.status.toLowerCase() === selectedStatus;
        
        return matchesSearch && matchesBranch && matchesStatus;
    });

    const handleExport = () => {
        try {
            if (students.length === 0) {
                toast.error("No students to export");
                return;
            }

            toast.loading("Exporting students...", { id: "export-students" });

            // Create CSV header
            const headers = ["Student ID", "Name", "Age", "Gender", "Email", "Phone", "Level", "Package", "Branch", "Status", "Start Date", "Expiry Date"];
            
            // Map students to CSV rows using raw data for reliability
            const rows = filteredStudents.map(s => {
                const r = s.raw || {};
                return [
                    r.studentId || s.studentId,
                    r.name || s.name,
                    r.age || "N/A",
                    r.gender || "N/A",
                    r.email || s.email,
                    r.phone || s.phone,
                    r.level || s.level,
                    r.packageType || s.membership,
                    r.branch?.name || s.branch,
                    r.status || s.status,
                    r.membershipStartDate ? new Date(r.membershipStartDate).toLocaleDateString() : "N/A",
                    r.membershipExpiryDate ? new Date(r.membershipExpiryDate).toLocaleDateString() : "N/A"
                ];
            });

            // Combine header and rows
            const csvContent = [
                headers.join(","),
                ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
            ].join("\n");

            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `Students_Export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Students exported successfully", { id: "export-students" });
        } catch (err) {
            console.error("Export error:", err);
            toast.error("Failed to export students", { id: "export-students" });
        }
    };
    const selectedRenewPackageObj = dynamicPackages.find(p => p.id === renewData.packageType);
    const renewBaseAmount = selectedRenewPackageObj ? Number(selectedRenewPackageObj.price) : 0;
    const renewVatAmount = parseFloat((renewBaseAmount * 0.05).toFixed(2));
    const renewTotalAmount = renewBaseAmount + renewVatAmount;
    const renewPendingAmount = Math.max(0, renewTotalAmount - (renewData.paidAmount || 0));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Registration Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage enrollments, packages, and student records across all branches.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="font-bold border-border/50" onClick={handleExport}>
                        <FileText className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button onClick={handleOpenAdd} className="font-bold shadow-sm gap-2">
                        <UserPlus className="w-4 h-4" /> Add Student
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by name, ID, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {user?.role === 'SUPER_ADMIN' && (
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white text-left">
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
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white text-left">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="frozen">Frozen</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0 border-border/50">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="font-bold text-foreground">Student ID</TableHead>
                            <TableHead className="font-bold text-foreground">Name</TableHead>
                            <TableHead className="font-bold text-foreground">Status</TableHead>
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Membership</TableHead>
                            <TableHead className="font-bold text-foreground">Fee Status</TableHead>
                            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground font-medium">Fetching students...</TableCell>
                            </TableRow>
                        ) : filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <TableRow key={student.id} className="hover:bg-muted/30 border-border/50 cursor-pointer transition-colors">
                                    <TableCell className="font-medium text-muted-foreground">{student.id}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-foreground">{student.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium">{student.phone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider shadow-sm",
                                            student.status === 'ACTIVE' ? "bg-success/10 text-success border border-success/20" :
                                            student.status === 'CANCELLED' ? "bg-error/10 text-error border border-error/20" :
                                            student.status === 'FROZEN' ? "bg-blue-100 text-blue-600 border border-blue-200" :
                                            "bg-muted text-muted-foreground border border-border"
                                        )}>
                                            {student.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{student.branch}</TableCell>
                                    <TableCell>
                                        <p className="font-bold text-sm text-foreground">{student.membership}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                                            {student.attendance.totalClasses} Classes
                                            {student.attendance.freeClasses > 0 && (
                                                <span className="text-emerald-600 ml-1">+ {student.attendance.freeClasses} Free</span>
                                            )}
                                            {student.attendance.oldClasses > 0 && (
                                                <span className="text-orange-500 ml-1">+ {student.attendance.oldClasses} Old</span>
                                            )}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className={cn(
                                                "px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider border w-fit",
                                                student.fee.status?.toUpperCase() === 'PAID'    ? "bg-success/10 text-success border-success/20" :
                                                student.fee.status?.toUpperCase() === 'PARTIAL' ? "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" :
                                                "bg-warning/10 text-warning border-warning/20"
                                            )}>
                                                {student.fee.status}
                                            </div>
                                            {student.fee.status?.toUpperCase() === 'PARTIAL' && student.fee.pendingAmount > 0 && (
                                                <span className="text-[10px] text-orange-500 font-bold">
                                                    Due: AED {student.fee.pendingAmount.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
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
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleOpenStudentDetails(student)}>
                                                    <FileText className="w-4 h-4 mr-2 text-primary" /> View Details
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleOpenEdit(student)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleGenerateInvoice(student)}>
                                                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                                                </DropdownMenuItem>
                                                {student.status === 'ACTIVE' ? (
                                                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-warning/10 text-warning rounded-lg p-2" onClick={() => handleOpenCancel(student)}>
                                                        <UserMinus className="mr-2 h-4 w-4" /> Cancel Membership
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-success/10 text-success rounded-lg p-2" onClick={() => handleOpenRenew(student)}>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Renew Membership
                                                    </DropdownMenuItem>
                                                )}
                                                {(student.fee?.status === 'PENDING' || student.fee?.status === 'PARTIAL') && (
                                                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-emerald-500/10 text-emerald-600 rounded-lg p-2" onClick={() => handleOpenReceivePayment(student)}>
                                                        <DollarSign className="mr-2 h-4 w-4" /> Receive Payment
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-error/10 hover:text-error text-error rounded-lg p-2 transition-colors" onClick={() => handleOpenDelete(student)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Student
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <Search className="w-10 h-10 mb-4 opacity-20" />
                                        <p className="font-bold text-lg text-foreground">No students found</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                        <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setSelectedBranch("all-branches"); setSelectedStatus("all-status"); }}>Clear Filters</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="border-t border-border/50 p-4 flex items-center justify-between text-sm text-muted-foreground font-medium bg-muted/5">
                    <div>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries</div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center px-4 font-black text-primary">
                            Page {currentPage} of {Math.ceil(totalEntries / pageSize) || 1}
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm"
                            disabled={currentPage >= Math.ceil(totalEntries / pageSize)}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- ADD / EDIT STUDENT MODAL --- */}
            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={fetchStudents}
                initialData={selectedStudent}
                isEditMode={isEditMode}
            />

            {/* --- INVOICE PREVIEW MODAL --- */}
            <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                <DialogContent className="max-w-2xl bg-white text-black p-0 rounded-xl border shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                    <DialogTitle className="sr-only">Invoice Preview</DialogTitle>
                    
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 print:p-0 print:shadow-none bg-white">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-black/10 pb-6 gap-4">
                            <div>
                                <h1 className="text-3xl font-black text-blue-500 tracking-tighter">NSM</h1>
                                <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest mt-1">Swimming Academy</h2>
                                <p className="text-xs text-slate-500 mt-2 font-medium">
                                    {selectedInvoice?.branch?.name || selectedStudent?.branch || "Unknown"} Branch<br />
                                    {selectedInvoice?.branch?.trn ? `Branch TRN: ${selectedInvoice.branch.trn}` : "Dubai Head Office"}<br />
                                    info@nsmswim.com
                                </p>
                            </div>
                            <div className="text-left md:text-right w-full md:w-auto">
                                <h2 className="text-4xl font-black text-slate-200 tracking-tighter uppercase">Invoice</h2>
                                <p className="font-bold text-slate-800 mt-2 hover:text-blue-500 cursor-pointer">
                                    {selectedInvoice?.invoiceNumber || selectedStudent?.fee?.invoiceNumber || "N/A"}
                                </p>
                                <p className="text-sm font-medium text-slate-500">
                                    {selectedInvoice?.paymentDate ? new Date(selectedInvoice.paymentDate).toLocaleDateString() : selectedStudent?.fee?.date}
                                </p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                                <h3 className="font-black text-lg text-slate-800">{selectedStudent?.name || selectedInvoice?.student?.name}</h3>
                                <p className="text-sm font-medium text-slate-600">ID: {selectedStudent?.studentId || selectedInvoice?.student?.studentId || "N/A"}</p>
                                <p className="text-sm font-medium text-slate-600">{selectedStudent?.phone || selectedInvoice?.student?.phone}</p>
                                {(selectedStudent?.trn || selectedStudent?.raw?.trn || selectedInvoice?.student?.trn) && (
                                    <p className="text-sm font-bold text-blue-600 mt-1">TRN: {selectedStudent?.trn || selectedStudent?.raw?.trn || selectedInvoice?.student?.trn}</p>
                                )}
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Info</p>
                                <p className="font-bold text-slate-800">
                                    Status: <span className={cn(
                                        (selectedInvoice?.status || selectedStudent?.fee?.status) === 'PAID' ? "text-green-600" :
                                        (selectedInvoice?.status || selectedStudent?.fee?.status) === 'PARTIAL' ? "text-orange-500" :
                                        "text-yellow-600"
                                    )}>
                                        {selectedInvoice?.status || selectedStudent?.fee?.status || "PENDING"}
                                    </span>
                                </p>
                                <p className="text-sm font-medium text-slate-600">Mode: {selectedInvoice?.paymentMode || selectedStudent?.fee?.mode}</p>
                                <p className="text-sm font-medium text-slate-600">Registration: {selectedInvoice?.registrationType || "NEW"}</p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[400px]">
                                <thead>
                                    <tr className="border-b-2 border-slate-800">
                                        <th className="py-3 font-black text-slate-800 uppercase tracking-wider text-xs">Description</th>
                                        <th className="py-3 font-black text-slate-800 text-right uppercase tracking-wider text-xs">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="py-4">
                                            <p className="font-bold text-slate-800">Swimming Package - {selectedInvoice?.packageType || selectedStudent?.membership}</p>
                                            <p className="text-sm text-slate-500 font-medium">Academy Registration and Coaching Fees</p>
                                        </td>
                                        <td className="py-4 font-bold text-slate-800 text-right">
                                            AED {(selectedInvoice?.totalAmount || selectedStudent?.fee?.amount || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end pt-4">
                            <div className="w-full md:w-64 space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>Subtotal</span>
                                    <span>AED {(selectedInvoice?.amount || selectedStudent?.fee?.amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>Discount</span>
                                    <span className="text-red-500">- AED {(selectedInvoice?.discount || selectedStudent?.fee?.discount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>VAT (5%)</span>
                                    {(() => {
                                        const baseAmt = selectedInvoice?.amount || selectedStudent?.fee?.amount || 0;
                                        const discAmt = selectedInvoice?.discount || selectedStudent?.fee?.discount || 0;
                                        const subTot = Math.max(0, baseAmt - discAmt);
                                        const totalAmt = selectedInvoice?.totalAmount || subTot;
                                        const vatAmt = Math.max(0, totalAmt - subTot);
                                        return <span>AED {vatAmt.toLocaleString()}</span>;
                                    })()}
                                </div>
                                {(selectedStudent?.trn || selectedStudent?.raw?.trn || selectedInvoice?.student?.trn) && (
                                    <div className="flex justify-between text-sm font-bold text-slate-600">
                                        <span>Student TRN</span>
                                        <span>{selectedStudent?.trn || selectedStudent?.raw?.trn || selectedInvoice?.student?.trn}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center border-t-2 border-slate-800 pt-3">
                                    <span className="font-black text-xl text-slate-800 uppercase">Total</span>
                                    <span className="font-black text-xl text-blue-500">
                                        AED {(selectedInvoice?.totalAmount || Math.max(0, (selectedStudent?.fee?.amount || 0) - (selectedStudent?.fee?.discount || 0))).toLocaleString()}
                                    </span>
                                </div>
                                {/* Partial payment breakdown */}
                                {(selectedInvoice?.status === 'PARTIAL' || selectedStudent?.fee?.status === 'PARTIAL') && (
                                    <>
                                        <div className="flex justify-between text-sm font-bold text-green-600 border-t border-slate-100 pt-2">
                                            <span>Amount Paid</span>
                                            <span>AED {(selectedInvoice?.paidAmount ?? selectedStudent?.fee?.paidAmount ?? 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-black text-orange-500">
                                            <span>Remaining Balance</span>
                                            <span>AED {(selectedInvoice?.pendingAmount ?? selectedStudent?.fee?.pendingAmount ?? 0).toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-10 text-center border-t border-slate-100 pb-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thank You For Your Business</p>
                            <p className="text-xs font-medium text-slate-400">Valid Computer Generated Receipt</p>
                        </div>

                    </div>

                    <div className="bg-slate-50 p-4 md:p-6 flex justify-end gap-3 border-t shrink-0">
                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsInvoiceModalOpen(false)}>Close</Button>
                        <Button onClick={async () => { 
                            try {
                                const id = selectedInvoice?.id || selectedStudent?.fee?.paymentId;
                                if (!id) {
                                    toast.error("Invoice ID not found");
                                    return;
                                }
                                
                                toast.loading("Preparing PDF...", { id: "downloading-pdf" });
                                
                                const response = await api.get(`/invoices/${id}/download`, {
                                    responseType: 'blob'
                                });
                                
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `Invoice_${selectedInvoice?.invoiceNumber || id}.pdf`);
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                                window.URL.revokeObjectURL(url);
                                
                                toast.success("Invoice downloaded successfully", { id: "downloading-pdf" });
                            } catch (err) {
                                console.error("Download error:", err);
                                toast.error("Failed to download invoice", { id: "downloading-pdf" });
                            }
                        }} className="font-bold gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl">
                            <Printer className="w-4 h-4" /> Print PDF
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Trash2 className="w-10 h-10 text-error" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-foreground mb-2">Delete Record?</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium text-balance">
                            Are you sure you want to permanently delete <strong className="text-foreground">{selectedStudent?.name}</strong>'s profile? This action cannot be undone.
                        </DialogDescription>
                    </div>
                    
                    <div className="px-8 pb-2">
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Student ID</span>
                                <span className="text-foreground font-black">{selectedStudent?.studentId || selectedStudent?.id}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Current Level</span>
                                <span className="text-primary font-black">{selectedStudent?.level}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50 hover:bg-muted/50 transition-all" 
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={isProcessing}
                            variant="destructive" 
                            className="h-12 rounded-2xl font-black shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-95 transition-all"
                            onClick={handleDeleteConfirm}
                        >
                            {isProcessing ? "Deleting..." : "Delete Now"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- CANCEL MEMBERSHIP MODAL --- */}
            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-warning/10 flex items-center justify-center mb-6 -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <UserMinus className="w-10 h-10 text-warning" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-foreground mb-2">Cancel Membership?</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium text-balance">
                            Are you sure you want to cancel the membership for <strong className="text-foreground">{selectedStudent?.name}</strong>? They will be marked as inactive.
                        </DialogDescription>
                    </div>
                    
                    <div className="px-8 pb-2">
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Status Change</span>
                                <span className="text-warning font-black uppercase">Active → Cancelled</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>ID Reference</span>
                                <span className="text-foreground font-black">{selectedStudent?.studentId}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50 hover:bg-muted/50 transition-all" 
                            onClick={() => setIsCancelModalOpen(false)}
                        >
                            Keep Active
                        </Button>
                        <Button 
                            disabled={isProcessing}
                            className="h-12 rounded-2xl font-black bg-warning hover:bg-warning/90 text-warning-foreground shadow-lg shadow-warning/20 hover:scale-[1.02] active:scale-95 transition-all border-none"
                            onClick={handleCancelMembership}
                        >
                            {isProcessing ? "Cancelling..." : "Confirm Cancel"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 4.6.5 Student Profil View placeholder (re-using profile from schedule or simpler dialog) */}
            {/* 4.6.5 Student Profile View Component */}
            <StudentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                student={selectedStudent}
                onEditSuccess={fetchStudents}
            />



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
                                <Label>Free/Bonus Classes</Label>
                                <Input 
                                    type="number" 
                                    min={0}
                                    placeholder="0"
                                    value={renewData.freeClasses === 0 ? '' : renewData.freeClasses}
                                    onChange={(e) => setRenewData({...renewData, freeClasses: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-orange-600 font-bold">Old/Carryover Classes</Label>
                                <Input 
                                    type="number" 
                                    min={0}
                                    placeholder="0"
                                    className="border-orange-200 bg-orange-50 focus-visible:ring-orange-400"
                                    value={renewData.oldClasses === 0 ? '' : renewData.oldClasses}
                                    onChange={(e) => setRenewData({...renewData, oldClasses: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                                />
                                <p className="text-[10px] font-medium text-orange-400">Remaining classes from previous expired package</p>
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
                                {isProcessing ? "Processing..." : "Confirm Renewal"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isReceivePaymentOpen} onOpenChange={setIsReceivePaymentOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[88vh] overflow-y-auto rounded-3xl p-0 border-border/50 select-none">
                    <DialogTitle className="sr-only">Receive Payment</DialogTitle>
                    <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#0B213F]">Receive Payment</h3>
                            <p className="text-sm font-medium text-emerald-700">{selectedStudent?.name} • {selectedStudent?.studentId}</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Balance Summary */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Total</p>
                                <p className="text-sm font-black text-[#0B213F]">AED {selectedStudent?.fee?.amount?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Paid</p>
                                <p className="text-sm font-black text-emerald-600">AED {selectedStudent?.fee?.paidAmount?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-3 text-center border border-orange-200">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Remaining</p>
                                <p className="text-sm font-black text-orange-600">AED {selectedStudent?.fee?.pendingAmount?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>

                        {/* Payment History */}
                        {paymentHistory.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment History</h4>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {paymentHistory.map((ph: any, i: number) => (
                                        <div key={i} className="bg-slate-50 rounded-lg p-2 flex items-center justify-between text-xs">
                                            <div>
                                                <p className="font-bold text-[#0B213F]">{ph.invoiceNumber}</p>
                                                <p className="text-[10px] text-slate-500">{new Date(ph.createdAt).toLocaleDateString()} • {ph.paymentMode}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-emerald-600">AED {ph.paidAmount?.toFixed(2)}</p>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase",
                                                    ph.status === 'PAID' ? 'text-success' : 'text-warning'
                                                )}>{ph.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Form */}
                        <div className="border-t border-slate-200 pt-4 space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Record New Payment</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold">Amount (AED)</Label>
                                    <Input 
                                        type="number" 
                                        step="any" 
                                        min={0.01}
                                        max={selectedStudent?.fee?.pendingAmount || 99999}
                                        placeholder="Enter amount"
                                        value={receivePaymentData.amount === 0 ? '' : receivePaymentData.amount}
                                        onChange={(e) => setReceivePaymentData({...receivePaymentData, amount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-bold">Payment Method</Label>
                                    <Select value={receivePaymentData.paymentMode} onValueChange={(v) => setReceivePaymentData({...receivePaymentData, paymentMode: v})}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH"><div className="flex items-center gap-2"><DollarSign className="w-3 h-3" /> Cash</div></SelectItem>
                                            <SelectItem value="CARD"><div className="flex items-center gap-2"><CreditCard className="w-3 h-3" /> Card / POS</div></SelectItem>
                                            <SelectItem value="ONLINE">Online Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-bold">Notes (Optional)</Label>
                                <Input 
                                    placeholder="e.g., Cash received at front desk"
                                    value={receivePaymentData.notes}
                                    onChange={(e) => setReceivePaymentData({...receivePaymentData, notes: e.target.value})}
                                />
                            </div>
                            {receivePaymentData.amount > 0 && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-bold text-slate-600">After this payment:</span>
                                        <span className="font-black text-emerald-600">
                                            {(selectedStudent?.fee?.pendingAmount || 0) - receivePaymentData.amount <= 0 ? 'FULLY PAID ✓' : `AED ${((selectedStudent?.fee?.pendingAmount || 0) - receivePaymentData.amount).toFixed(2)} remaining`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 border-t flex justify-end gap-3">
                        <Button variant="outline" className="rounded-xl" onClick={() => setIsReceivePaymentOpen(false)}>Cancel</Button>
                        <Button
                            disabled={isProcessing || receivePaymentData.amount <= 0}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold gap-2"
                            onClick={handleReceivePayment}
                        >
                            {isProcessing ? 'Processing...' : <><DollarSign className="w-4 h-4" /> Confirm Payment</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// Utility component used above
function Separator() {
    return <div className="h-px w-full bg-border/50 my-2" />;
}
