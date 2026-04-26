"use client";

import { useState } from "react";
import {
    UserSquare2, Search, Filter, Plus, MoreHorizontal,
    Edit, Trash2, Mail, Phone, Users, UserPlus
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import api from "@/lib/api";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CoachesPage() {
    const { user } = useAuth();
    const [coaches, setCoaches] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all-branches");
    const [isLoading, setIsLoading] = useState(true);

    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "MALE",
        branchId: ""
    });

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            if (res.data.success) {
                setBranches(res.data.data);
            }
        } catch (error) {
            console.error("Failed to load branches", error);
        }
    };

    const fetchCoaches = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/coaches');
            if (res.data.success) {
                const results = res.data.data.results || res.data.data;
                const mapped = results.map((c: any) => ({
                    id: c.id,
                    coachId: c.coachId,
                    name: c.name,
                    phone: c.phone || "N/A",
                    email: c.email || "N/A",
                    branch: c.branch?.name || "Unknown Branch",
                    branchId: c.branchId,
                    gender: c.gender || "MALE",
                    assignedStudents: c.studentAssignments || Array.from({ length: c._count?.studentAssignments || 0 }),
                }));
                setCoaches(mapped);
            }
        } catch (error) {
            console.error("Failed to load coaches", error);
            toast.error("Failed to fetch coaches from server");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/students?limit=1000');
            setAllStudents(res.data.data.results || res.data.data || []);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchCoaches();
        fetchBranches();
        fetchStudents();
    }, []);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);

    const [selectedCoach, setSelectedCoach] = useState<any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handlers
    const handleOpenAdd = () => {
        setIsEditMode(false);
        setSelectedCoach(null);
        // For STAFF, always default to their own branch
        const defaultBranchId = user?.role === 'STAFF' && user?.branchId
            ? user.branchId
            : branches[0]?.id || '';
        setFormData({ name: "", phone: "", email: "", gender: "MALE", branchId: defaultBranchId });
        setIsAddModalOpen(true);
    };

    const handleOpenEdit = (coach: any) => {
        setIsEditMode(true);
        setSelectedCoach(coach);
        setFormData({
            name: coach.name,
            phone: coach.phone === "N/A" ? "" : coach.phone,
            email: coach.email,
            gender: coach.gender,
            branchId: coach.branchId
        });
        setIsAddModalOpen(true);
    };

    const handleViewRoster = (coach: any) => {
        setSelectedCoach(coach);
        setIsRosterModalOpen(true);
    };

    const handleOpenDelete = (coach: any) => {
        setSelectedCoach(coach);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/coaches/${selectedCoach.id}`);
            toast.success("Coach removed successfully");
            fetchCoaches();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Failed to delete coach", error);
            toast.error("Failed to delete coach");
        }
    };

    const handleOpenAssign = (coach: any) => {
        setSelectedCoach(coach);
        setSelectedStudentId("");
        setIsAssignModalOpen(true);
    };

    const handleAssignStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/coaches/${selectedCoach.id}/assign-students`, { studentIds: [selectedStudentId] });
            toast.success("Student assigned to coach successfully!");
            setIsAssignModalOpen(false);
            fetchCoaches();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to assign student");
        }
    };

    const handleSaveCoach = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await api.put(`/coaches/${selectedCoach.id}`, formData);
                toast.success("Coach details updated");
            } else {
                await api.post('/coaches', formData);
                toast.success("New coach added to roster");
            }
            fetchCoaches();
            setIsAddModalOpen(false);
        } catch (error: any) {
            console.error("Failed to save coach", error);
            toast.error(error.response?.data?.message || (isEditMode ? "Failed to update coach" : "Failed to add coach"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter
    const filteredCoaches = coaches.filter(coach => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = coach.name.toLowerCase().includes(query) || coach.branch.toLowerCase().includes(query);
        const matchesBranch = selectedBranch === "all-branches" || coach.branchId === selectedBranch;
        
        return matchesSearch && matchesBranch;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <UserSquare2 className="w-8 h-8 text-primary" />
                        Coaches & Staff
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage instructor profiles, branches, and assigned students.</p>
                </div>

                <Button onClick={handleOpenAdd} className="font-bold shadow-sm gap-2">
                    <UserPlus className="w-4 h-4" /> Add Coach
                </Button>
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search instructors by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {user?.role === 'SUPER_ADMIN' && (
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-full md:w-[200px] border-border/50 bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium hover:bg-white text-left">
                                <SelectValue placeholder="Branch Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all-branches">All Branches</SelectItem>
                                {branches.map(branch => (
                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Coach Data Grid */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="font-bold text-foreground">Instructor Profile</TableHead>
                            <TableHead className="font-bold text-foreground">Employee ID</TableHead>
                            <TableHead className="font-bold text-foreground">Assigned Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Contact Info</TableHead>
                            <TableHead className="font-bold text-foreground text-center">Active Students</TableHead>
                            <TableHead className="text-right font-bold text-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground font-medium">Fetching coaches...</TableCell>
                            </TableRow>
                        ) : filteredCoaches.length > 0 ? (
                            filteredCoaches.map((coach) => (
                                <TableRow key={coach.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {coach.name.replace("Coach ", "").substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-foreground flex items-center gap-2">
                                                    {coach.name}
                                                    <span className={cn(
                                                        "text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase",
                                                        coach.gender === 'FEMALE' ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                        {coach.gender}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground font-medium">Senior Instructor</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-muted-foreground">{coach.id}</TableCell>
                                    <TableCell>
                                        <span className="bg-secondary/10 text-slate-900 dark:text-slate-100 px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 border border-secondary/20">
                                            {coach.branch}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                                                <Phone className="w-3 h-3 text-muted-foreground" /> {coach.phone}
                                            </p>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-muted-foreground" /> {coach.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="inline-flex bg-muted rounded-xl p-1.5 items-center gap-2 px-3 border border-border">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="font-black text-foreground">{coach.assignedStudents.length}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[180px] rounded-xl shadow-xl border-border/50 p-1">
                                                <DropdownMenuLabel className="text-xs uppercase text-muted-foreground tracking-wider font-bold px-2 py-1.5">Manage</DropdownMenuLabel>
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2 flex items-center justify-between" onClick={() => handleViewRoster(coach)}>
                                                    <div className="flex items-center"><Users className="mr-2 h-4 w-4" /> View Roster</div>
                                                    <span className="bg-primary/10 text-primary text-[10px] px-1.5 rounded font-black">{coach.assignedStudents.length}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleOpenAssign(coach)}>
                                                    <UserPlus className="mr-2 h-4 w-4" /> Assign Student
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-muted/50 rounded-lg p-2" onClick={() => handleOpenEdit(coach)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-border/50" />
                                                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-error/10 hover:text-error text-error rounded-lg p-2" onClick={() => handleOpenDelete(coach)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Coach
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                                    <Search className="w-10 h-10 mb-4 opacity-20 mx-auto" />
                                    <p className="font-bold text-lg text-foreground">No coaches found</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add / Edit Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-border/50">
                    <form onSubmit={handleSaveCoach}>
                        <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black">{isEditMode ? "Edit Coach Profile" : "Add New Coach"}</DialogTitle>
                                <DialogDescription className="font-medium text-primary">
                                    Manage instructor details and branch assignment.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-6 grid gap-4">
                            <div className="space-y-2">
                                <Label>Full Name <span className="text-error">*</span></Label>
                                <Input 
                                    placeholder="Coach Name" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input 
                                        type="tel"
                                        placeholder="+971..." 
                                        value={formData.phone} 
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^\d+]/g, '');
                                            val = val.replace(/(?!^)\+/g, '');
                                            setFormData({...formData, phone: val});
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email <span className="text-error">*</span></Label>
                                    <Input 
                                        type="email" 
                                        placeholder="coach@nsm.com" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Select 
                                        value={formData.gender} 
                                        onValueChange={(val) => setFormData({...formData, gender: val})}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Assigned Branch</Label>
                                    {user?.role === 'STAFF' ? (
                                        <div className="h-9 bg-blue-50 border border-border rounded-lg px-3 flex items-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {branches.find(b => b.id === formData.branchId)?.name || 'Your Branch'}
                                            </span>
                                            <span className="ml-2 text-xs text-blue-400">(Your branch)</span>
                                        </div>
                                    ) : (
                                        <Select
                                            value={formData.branchId}
                                            onValueChange={(val) => setFormData({...formData, branchId: val})}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                            <SelectContent>
                                                {branches.map(branch => (
                                                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/10 p-6 border-t border-border/50 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="font-bold shadow-sm" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Create Profile")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader className="items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-8 h-8 text-error" />
                        </div>
                        <DialogTitle className="text-xl font-black">Remove Coach?</DialogTitle>
                        <DialogDescription className="font-medium text-center">
                            Are you sure you want to remove <strong className="text-foreground">{selectedCoach?.name}</strong>? All assigned students will need to be reallocated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex w-full gap-3 mt-2 pt-4">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="flex-1 font-bold rounded-xl" onClick={handleDeleteConfirm}>Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-border/50">
                    <form onSubmit={handleAssignStudent}>
                        <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black">Assign Student</DialogTitle>
                                <DialogDescription className="font-medium text-primary">
                                    Assign a student to {selectedCoach?.name}.
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="p-6">
                            <Label>Select Student <span className="text-error">*</span></Label>
                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId} required>
                                <SelectTrigger className="mt-2 text-left"><SelectValue placeholder="Search student name or ID..." /></SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {allStudents.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name} ({s.studentId})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="px-6 py-4 bg-muted/10 border-t border-border/50 flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAssignModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" className="rounded-xl font-bold shadow-sm">Assign Student</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Roster Modal */}
            <Dialog open={isRosterModalOpen} onOpenChange={setIsRosterModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-border/50">
                    <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black">{selectedCoach?.name}'s Roster</DialogTitle>
                            <DialogDescription className="font-medium text-primary">
                                Currently assigned students.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="p-6 max-h-[60vh] overflow-y-auto">
                        {selectedCoach?.assignedStudents?.length > 0 ? (
                            <div className="space-y-4">
                                {selectedCoach.assignedStudents.map((assignment: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50">
                                        <div>
                                            <p className="font-bold text-foreground">{assignment.student?.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium flex gap-2">
                                                <span>{assignment.student?.studentId}</span>
                                            </p>
                                        </div>
                                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                            {assignment.student?.level || 'N/A'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground font-medium">
                                No students assigned to this coach yet.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
