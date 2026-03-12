"use client";

import { useState } from "react";
import {
    Users, Plus, Search, Filter, MoreHorizontal,
    Trash2, Edit, Eye, FileText, CheckCircle2, UserPlus, Printer,
    Snowflake, Ban
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

// Mock Data Source
import { students as initialStudents } from "@/lib/mockData";

export default function StudentsPage() {
    const [students, setStudents] = useState(initialStudents);
    const [searchTerm, setSearchTerm] = useState("");

    // Modals State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Form State for Add/Edit
    const [isEditMode, setIsEditMode] = useState(false);
    const [applyVat, setApplyVat] = useState(true);
    const [isInstallment, setIsInstallment] = useState(false);

    // Handlers
    const handleOpenAdd = () => {
        setIsEditMode(false);
        setSelectedStudent(null);
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (student: any) => {
        setIsEditMode(true);
        setSelectedStudent(student);
        setIsAddModalOpen(true);
    };

    const handleOpenDelete = (student: any) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setStudents(students.filter(s => s.id !== selectedStudent.id));
        toast.success("Student deleted successfully");
        setIsDeleteModalOpen(false);
    };

    const handleSaveStudent = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(isEditMode ? "Student updated successfully" : "Student added successfully. Welcome email with our privacy policy has been sent.");
        setIsAddModalOpen(false);
    };

    const handleGenerateInvoice = (student: any = null) => {
        if (student) setSelectedStudent(student);
        setIsAddModalOpen(false);
        setIsInvoiceModalOpen(true);
    };

    // Filtering
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <Button variant="outline" className="font-bold border-border/50">
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
                    <Select defaultValue="all-branches">
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white text-left">
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
                        <SelectTrigger className="w-full md:w-[150px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white text-left">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="frozen">Frozen</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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
                            <TableHead className="font-bold text-foreground">Level</TableHead>
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Membership</TableHead>
                            <TableHead className="font-bold text-foreground">Status</TableHead>
                            <TableHead className="font-bold text-foreground">Fee Status</TableHead>
                            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.length > 0 ? (
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
                                        <span className="bg-secondary/10 text-secondaryDark px-2 py-1 rounded font-bold text-xs">
                                            {student.level}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{student.branch}</TableCell>
                                    <TableCell>
                                        <p className="font-bold text-sm text-foreground">{student.membership}</p>
                                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{student.attendance.totalClasses} Classes</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "font-black rounded-lg text-[10px] uppercase tracking-wider px-2 py-0.5",
                                            student.status === 'Active' ? "bg-success/10 text-success border-success/20" : 
                                            student.status === 'Expired' ? "bg-error/10 text-error border-error/20" :
                                            student.status === 'Frozen' ? "bg-blue-100 text-blue-600 border-blue-200" :
                                            "bg-slate-100 text-slate-500 border-slate-200"
                                        )}>
                                            {student.status || 'Active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", student.fee.status === 'Paid' ? "bg-success" : "bg-warning")} />
                                            <span className={cn("font-bold text-sm", student.fee.status === 'Paid' ? "text-success" : "text-warning")}>
                                                {student.fee.status}
                                            </span>
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
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => { setSelectedStudent(student); setIsDetailModalOpen(true) }}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleOpenEdit(student)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleGenerateInvoice(student)}>
                                                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                                                </DropdownMenuItem>
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
                                        <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>Clear Filters</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Mock */}
                <div className="border-t border-border/50 p-4 flex items-center justify-between text-sm text-muted-foreground font-medium bg-muted/5">
                    <div>Showing 1 to {filteredStudents.length} of {students.length} entries</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">1</Button>
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </div>

            {/* --- ADD / EDIT STUDENT MODAL (4.6.2 & 4.6.3) --- */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[1000px] p-0 border-none shadow-2xl overflow-visible bg-[#f8fafc] rounded-3xl">
                    <form onSubmit={handleSaveStudent}>
                        {/* Header */}
                        <div className="bg-white px-6 py-4 rounded-t-3xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1C5CAA] text-white flex items-center justify-center shrink-0">
                                {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-[22px] font-black text-slate-900 leading-tight">{isEditMode ? "Edit Student Record" : "Register New Student"}</DialogTitle>
                                <DialogDescription className="text-[13px] font-bold text-[#1C5CAA]">
                                    Fill out the form below to {isEditMode ? "update" : "enroll"} a student in the academy.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column: Personal and Academy Details */}
                                <div className="space-y-6">
                                    {/* Section 1: Personal Details */}
                                    <div className="space-y-3">
                                        <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                            <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">1</span>
                                            Personal Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1 md:col-span-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Full Name <span className="text-red-500">*</span></Label>
                                                <Input className="h-9 bg-white border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm placeholder:text-slate-400 font-medium shadow-sm transition-all" placeholder="e.g. Ziad Ahmed" defaultValue={selectedStudent?.name} required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 md:col-span-1">
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-bold text-[#0B213F]">Age</Label>
                                                    <Input className="h-9 bg-white border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm placeholder:text-slate-400 font-medium shadow-sm transition-all text-center pr-2" type="number" placeholder="5" defaultValue={selectedStudent?.age} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-bold text-[#0B213F]">Gender</Label>
                                                    <Select defaultValue={selectedStudent?.gender || "Male"}>
                                                        <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Email <span className="text-red-500">*</span></Label>
                                                <Input className="h-9 bg-[#f8fafc] border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm placeholder:text-slate-400 font-medium shadow-sm transition-all" type="email" placeholder="parent@example.com" required />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Phone (WhatsApp) <span className="text-red-500">*</span></Label>
                                                <Input className="h-9 bg-[#f8fafc] border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm placeholder:text-slate-400 font-medium shadow-sm transition-all text-muted-foreground bg-transparent" placeholder="+971 50 123 4567" defaultValue={selectedStudent?.phone || "+971 50 123 4567"} required />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Academy Details */}
                                    <div className="space-y-3">
                                        <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                            <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">2</span>
                                            Academy & Enrollment
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Branch</Label>
                                                <Select defaultValue={selectedStudent?.branch?.toLowerCase().replace(' ', '-') || "dubai"}>
                                                    <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="dubai">Dubai</SelectItem>
                                                        <SelectItem value="sharjah">Sharjah</SelectItem>
                                                        <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Swimming Level</Label>
                                                <Select defaultValue={selectedStudent?.level || "K2"}>
                                                    <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="T1">Toddler 1 (T1)</SelectItem>
                                                        <SelectItem value="K1">Kids 1 (K1)</SelectItem>
                                                        <SelectItem value="K2">Kids 2 (K2)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1 flex items-center justify-center border border-[#B2C5E0] rounded-full h-9 bg-transparent px-2 gap-2 col-span-1 shadow-sm">
                                                <Switch id="renewal" className="data-[state=checked]:bg-[#1C5CAA] scale-75" />
                                                <Label htmlFor="renewal" className="cursor-pointer text-[11px] font-black text-[#0B213F] leading-tight text-center">Renewal<br />Registration</Label>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-1">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Starting Date</Label>
                                                <div className="relative">
                                                    <Input className="h-9 bg-[#f8fafc] border-[#B2C5E0] px-3 text-sm font-medium shadow-sm rounded-xl" type="date" defaultValue={selectedStudent?.attendance?.startDate || new Date().toISOString().split('T')[0]} required />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Expiry Date</Label>
                                                <div className="relative">
                                                    <Input className="h-9 bg-[#f8fafc] border-[#B2C5E0] px-3 text-sm font-medium shadow-sm rounded-xl bg-slate-100" type="date" defaultValue={selectedStudent?.attendance?.expiryDate || "2026-05-24"} required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Package and Financials */}
                                <div className="space-y-6">
                                    <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                        <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">3</span>
                                        Package & Financials
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1 col-span-2">
                                            <Label className="text-xs font-bold text-[#0B213F]">Membership Package</Label>
                                            <Select defaultValue={selectedStudent?.membership || "Silver"}>
                                                <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Basic">Basic (8 Classes)</SelectItem>
                                                    <SelectItem value="Silver">Silver (12 Classes)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Payment Method</Label>
                                            <Select defaultValue={selectedStudent?.fee?.mode || "Card"}>
                                                <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Cash">Cash</SelectItem>
                                                    <SelectItem value="Card">Credit Card / POS</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Discount (AED)</Label>
                                            <Input className="h-9 bg-white border-[#B2C5E0] text-sm font-medium shadow-sm rounded-xl text-muted-foreground" type="number" placeholder="0" defaultValue={selectedStudent?.fee?.discount || "0"} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-black text-[#0B213F]">Tax Number</Label>
                                            <Input className="h-9 bg-[#f8fafc] border-[#B2C5E0] text-sm shadow-sm rounded-xl font-medium text-slate-600" placeholder="100234567891234" defaultValue="100234567891234" />
                                        </div>
                                        <div className="flex items-center justify-between pb-1 border border-[#B2C5E0] rounded-xl px-3 h-9 bg-white shadow-sm">
                                            <Label className="text-[13px] font-black text-[#0B213F]">Pay via Installments</Label>
                                            <Switch className="data-[state=checked]:bg-[#1C5CAA] scale-75" checked={isInstallment} onCheckedChange={setIsInstallment} />
                                        </div>

                                        {/* Financial Summary Box */}
                                        <div className="bg-white p-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(30,58,138,0.15)] border border-slate-100 space-y-2 relative overflow-hidden">
                                            <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                                <span>Package Subtotal:</span>
                                                <span className="text-[#0B213F]">AED 1,500</span>
                                            </div>
                                            <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                                <span>Discount:</span>
                                                <span className="text-[#0B213F]">- AED 0</span>
                                            </div>
                                            <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                                <span>Tax Number (TRN):</span>
                                                <span className="text-[#0B213F]">100234567891234</span>
                                            </div>
                                            <div className="h-px bg-slate-200 w-full my-3" />
                                            <div className="flex justify-between items-center">
                                                <span className="font-black text-[#0B213F] text-[15px]">Total Due:</span>
                                                <span className="font-black text-[#1C5CAA] text-[22px]">AED 1,500</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="bg-[#f8fafc] px-6 py-3 flex gap-3 relative rounded-b-3xl mt-1 items-center pl-6 pr-6 border-none">
                            <Button type="button" variant="outline" className="rounded-[10px] shadow-sm border-[#B2C5E0] text-[#0B213F] font-bold h-10 px-5 bg-white hover:bg-slate-50 border-[1.5px]" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button type="button" variant="secondary" onClick={() => handleGenerateInvoice(selectedStudent)} className="font-black text-[#0B213F] flex items-center gap-2 h-10 px-5 bg-[#6FC9F1] hover:bg-sky-400 rounded-[10px] ml-16 shadow-md border hover:border-transparent border-[#52A0C2] text-[13px]">
                                <FileText className="w-4 h-4" /> Save & Generate Invoice
                            </Button>
                            <Button type="submit" className="font-black text-white bg-[#1C5CAA] hover:bg-blue-800 h-10 px-5 rounded-[10px] ml-auto shadow-md text-[13px]">
                                Generate Receipt & Record
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- INVOICE PREVIEW MODAL (4.6.6) --- */}
            <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
                <DialogContent className="max-w-2xl bg-white text-black p-0 rounded-none border shadow-2xl">
                    <DialogTitle className="sr-only">Invoice Preview</DialogTitle>
                    <div className="p-10 space-y-8 print:p-0 print:shadow-none bg-white min-h-[500px]">

                        {/* Header */}
                        <div className="flex justify-between items-start border-b-2 border-black/10 pb-6">
                            <div>
                                <h1 className="text-3xl font-black text-blue-500 tracking-tighter">NSM</h1>
                                <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest mt-1">Swimming Academy</h2>
                                <p className="text-xs text-slate-500 mt-2 font-medium">Dubai Branch<br />+971 50 123 4567<br />info@nsmswim.com</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-black text-slate-200 tracking-tighter uppercase">Invoice</h2>
                                <p className="font-bold text-slate-800 mt-2 hover:text-blue-500 cursor-pointer">INV-2026-0892</p>
                                <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                                <h3 className="font-black text-lg text-slate-800">{selectedStudent?.name || "Ziad Ahmed"}</h3>
                                <p className="text-sm font-medium text-slate-600">ID: {selectedStudent?.id || "NSM-DXB-001"}</p>
                                <p className="text-sm font-medium text-slate-600">{selectedStudent?.phone || "+971 50 123 4567"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Info</p>
                                <p className="font-bold text-slate-800">Status: <span className="text-green-600">PAID</span></p>
                                <p className="text-sm font-medium text-slate-600">Mode: {selectedStudent?.fee?.mode || "Credit Card"}</p>
                                <p className="text-sm font-medium text-slate-600">Date: {selectedStudent?.fee?.date || "24-02-2026"}</p>
                            </div>
                        </div>

                        {/* Items Table */}
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
                                        <p className="font-bold text-slate-800">Swimming Package - {selectedStudent?.membership || "Silver"}</p>
                                        <p className="text-sm text-slate-500 font-medium">Includes 12 Classes. Level: {selectedStudent?.level || "K2"}</p>
                                    </td>
                                    <td className="py-4 font-bold text-slate-800 text-right">AED 1,500.00</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end pt-4">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>Subtotal</span>
                                    <span>AED 1,500.00</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>Discount</span>
                                    <span>AED {selectedStudent?.fee?.discount || "0"}.00</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-600">
                                    <span>Tax Number (TRN)</span>
                                    <span>100234567891234</span>
                                </div>
                                <div className="flex justify-between items-center border-t-2 border-slate-800 pt-3">
                                    <span className="font-black text-xl text-slate-800 uppercase">Total</span>
                                    <span className="font-black text-xl text-blue-500">AED 1,500.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-10 text-center border-t border-slate-100 pb-10">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thank You For Your Business</p>
                            <p className="text-xs font-medium text-slate-400">TRN: 100234567891234 • Valid Computer Generated Receipt</p>
                        </div>

                    </div>

                    <div className="bg-slate-100 p-4 flex justify-end gap-3 border-t">
                        <Button variant="outline" onClick={() => setIsInvoiceModalOpen(false)}>Close</Button>
                        <Button onClick={() => { toast.success("Printing invoice..."); setIsInvoiceModalOpen(false); }} className="font-bold gap-2">
                            <Printer className="w-4 h-4" /> Print PDF
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* --- DELETE CONFIRMATION MODAL (4.6.4) --- */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader className="items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-8 h-8 text-error" />
                        </div>
                        <DialogTitle className="text-xl font-black">Delete Student?</DialogTitle>
                        <DialogDescription className="font-medium text-center">
                            Are you sure you want to permanently delete <strong className="text-foreground">{selectedStudent?.name}</strong>'s record? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                        <Button variant="outline" className="w-full" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="w-full font-bold" onClick={handleDeleteConfirm}>Yes, Delete Record</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 4.6.5 Student Profil View placeholder (re-using profile from schedule or simpler dialog) */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 rounded-3xl">
                    <DialogTitle className="sr-only">Student Details</DialogTitle>
                    {selectedStudent && (
                        <>
                            <div className="bg-primary/10 p-6 flex flex-col items-center text-center border-b border-border/50 relative">
                                <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg mb-3">
                                    <span className="text-2xl font-black text-primaryDark">{selectedStudent.name?.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <DialogTitle className="text-2xl font-black text-[#0B213F]">{selectedStudent.name}</DialogTitle>
                                <DialogDescription className="font-bold text-[#1C5CAA] mt-1">{selectedStudent.id} • {selectedStudent.level} • {selectedStudent.branch}</DialogDescription>
                                <Button variant="outline" size="sm" className="absolute top-4 right-12 rounded-xl font-bold bg-white" onClick={() => { setIsDetailModalOpen(false); handleOpenEdit(selectedStudent); }}>Edit</Button>
                            </div>
                            <div className="p-6 grid gap-4 bg-[#f8fafc]">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Membership Info */}
                                    <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership</p>
                                        <p className="font-bold text-[#0B213F]">{selectedStudent.membership}</p>
                                        <p className="text-[10px] font-bold text-[#1C5CAA] mt-1">
                                            {selectedStudent.attendance?.startDate} to {selectedStudent.attendance?.expiryDate}
                                        </p>
                                    </div>

                                    {/* Fee Status */}
                                    <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</p>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider", selectedStudent.fee?.status === 'Paid' ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                                                {selectedStudent.fee?.status}
                                            </span>
                                            <span className="font-black text-[#0B213F] text-sm">AED {selectedStudent.fee?.amount}</span>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="space-y-2 bg-white p-4 rounded-2xl border border-border/40 shadow-sm col-span-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</p>
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-[#0B213F]">{selectedStudent.phone}</p>
                                            <p className="text-xs font-medium text-slate-500 truncate">{selectedStudent.email || "student@example.com"}</p>
                                        </div>
                                    </div>

                                    {/* Attendance Progress */}
                                    <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm col-span-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                                        <p className="text-sm font-black text-[#0B213F] mt-1">
                                            <span className="text-success">{selectedStudent.attendance?.attended} Done</span>
                                            <span className="text-slate-400 mx-1">/</span>
                                            <span>{selectedStudent.attendance?.totalClasses} Total</span>
                                        </p>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-success transition-all duration-500"
                                                style={{ width: `${(selectedStudent.attendance?.attended / selectedStudent.attendance?.totalClasses) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    );
}

// Utility component used above
function Separator() {
    return <div className="h-px w-full bg-border/50 my-2" />;
}
