"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialData?: any;
    isEditMode?: boolean;
}



export default function AddStudentModal({ isOpen, onClose, onSuccess, initialData, isEditMode = false }: AddStudentModalProps) {
    const { user } = useAuth();
    const [branches, setBranches] = useState<any[]>([]);
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "",
        age: 5,
        email: "",
        phone: "+971 ",
        discount: 0,
        gender: "MALE",
        category: "KID",
        branchId: "",
        level: "K2",
        packageType: "SILVER",
        paymentMode: "CARD",
        paymentStatus: "PAID",
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        trn: ""
    });

    const activeItem = dynamicPackages.find(p => p.id === formData.packageType);
    const currentPrice = activeItem ? activeItem.price : 0;
    const totalPrice = Math.max(0, currentPrice - formData.discount);

    useEffect(() => {
        if (isOpen) {
            api.get('/branches').then(res => {
                const data = res.data.data.results || res.data.data;
                setBranches(data);
                // For STAFF: always force their own branchId. For SUPER_ADMIN: default to first branch.
                if (!formData.branchId) {
                    const defaultBranch = user?.role === 'STAFF' && user?.branchId
                        ? user.branchId
                        : data[0]?.id || '';
                    setFormData(prev => ({ ...prev, branchId: defaultBranch }));
                }
            }).catch(console.error);
            api.get('/settings').then(res => {
                if (res.data.success) {
                    const pkgs = res.data.data.filter((s:any) => s.key.startsWith('PACKAGE_')).map((s:any) => {
                        const parsed = JSON.parse(s.value);
                        return {
                            id: s.key.replace('PACKAGE_', ''),
                            name: s.key.replace('PACKAGE_', '').charAt(0) + s.key.replace('PACKAGE_', '').slice(1).toLowerCase() + " Package",
                            classes: parsed.classes,
                            price: parsed.price,
                            durationMonths: parsed.durationMonths || 1
                        };
                    });
                    if(pkgs.length > 0) {
                        setDynamicPackages(pkgs);
                        // Auto-correct packageType: if the current default ('SILVER') 
                        // is not in the loaded packages, switch to the first available package
                        setFormData(prev => {
                            const isValid = pkgs.some((p: any) => p.id === prev.packageType);
                            return isValid ? prev : { ...prev, packageType: pkgs[0].id };
                        });
                    }
                }
            }).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialData && isEditMode) {
            setFormData({
                name: initialData.name || "",
                age: initialData.age || 5,
                email: initialData.email || "",
                phone: initialData.phone || "+971 ",
                discount: initialData.discount || 0,
                gender: initialData.gender || "MALE",
                category: initialData.category || "KID",
                branchId: initialData.branchId || "",
                level: initialData.level || "K2",
                packageType: initialData.packageType || "SILVER",
                paymentMode: initialData.paymentMode || "CARD",
                paymentStatus: initialData.paymentStatus || "PAID",
                startDate: initialData.membershipStartDate ? new Date(initialData.membershipStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                expiryDate: initialData.membershipExpiryDate ? new Date(initialData.membershipExpiryDate).toISOString().split('T')[0] : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                trn: initialData.trn || ""
            });
        } else if (!isEditMode) {
             setFormData({
                name: "",
                age: 5,
                email: "",
                phone: "+971 ",
                discount: 0,
                gender: "MALE",
                category: "KID",
                // STAFF always use their own branch. SUPER_ADMIN uses first in list.
                branchId: user?.role === 'STAFF' && user?.branchId ? user.branchId : branches[0]?.id || '',
                level: "K2",
                packageType: "SILVER",
                paymentMode: "CARD",
                paymentStatus: "PAID",
                startDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                trn: ""
            });
        }
    }, [initialData, isEditMode, isOpen, branches]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Manual validation for Phone (ensure it's more than just the prefix)
        if (!formData.phone || formData.phone.trim() === "+971") {
            toast.error("Please enter a valid phone number");
            return;
        }

        // Check if phone has enough digits (e.g., at least 7 digits after prefix)
        const digitsOnly = formData.phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) { // +971 (3) + 7 digits = 10
            toast.error("Phone number seems too short. Please provide a full number.");
            return;
        }

        if (!formData.paymentStatus) {
            toast.error("Please select a Fee Status");
            return;
        }

        setIsLoading(true);
        try {
            // Fields allowed for update/creation
            const baseData: any = {
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                email: formData.email,
                phone: formData.phone,
                level: formData.level,
                category: formData.category,
                discount: formData.discount,
                branchId: formData.branchId,
                paymentStatus: formData.paymentStatus,
                trn: formData.trn,
            };

            if (isEditMode) {
                // For editing, include package and dates
                const updateData = {
                    ...baseData,
                    packageType: formData.packageType,
                    paymentMode: formData.paymentMode,
                    membershipStartDate: new Date(formData.startDate).toISOString(),
                    membershipExpiryDate: new Date(formData.expiryDate).toISOString(),
                };
                await api.put(`/students/${initialData.id}`, updateData);
                toast.success("Student updated successfully");
            } else {
                const createData = {
                    ...baseData,
                    packageType: formData.packageType,
                    paymentMode: formData.paymentMode,
                    paymentStatus: formData.paymentStatus,
                    password: 'nsm' + (formData.phone.replace(/\s/g, '').slice(-4) || '1234')
                };
                const res = await api.post('/students', createData);
                const emailStatus = res.data.data.emailResult?.success 
                    ? "Welcome email sent successfully!" 
                    : `Student added, but email failed: ${res.data.data.emailResult?.error || 'Unknown error'}`;
                
                toast.success(`Student added! ${emailStatus}`);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Student save error object:", err);
            
            const errorData = err.response?.data;
            let errorMessage = "Failed to save student.";

            if (errorData && typeof errorData === 'object' && Object.keys(errorData).length > 0) {
                if (errorData.error?.details && Array.isArray(errorData.error.details)) {
                    // Handle Zod validation details
                    errorMessage = errorData.error.details.map((d: any) => {
                        const field = d.path[d.path.length - 1];
                        return `${field}: ${d.message}`;
                    }).join(" | ");
                } else {
                    errorMessage = errorData.message || errorData.error?.code || err.message || errorMessage;
                }
            } else if (err.response?.status === 404) {
                errorMessage = "API endpoint not found (404). Please check backend connection.";
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage, {
                duration: 6000
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px] p-0 border-none shadow-2xl overflow-visible bg-[#f8fafc] rounded-3xl">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="bg-white px-6 py-4 rounded-t-3xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1C5CAA] text-white flex items-center justify-center shrink-0">
                            {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <div>
                            <DialogTitle className="text-[22px] font-black text-slate-900 leading-tight">
                                {isEditMode ? "Edit Student Record" : "Register New Student"}
                            </DialogTitle>
                            <DialogDescription className="text-[13px] font-bold text-[#1C5CAA]">
                                Fill out the form below to {isEditMode ? "update" : "enroll"} a student in the academy.
                            </DialogDescription>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column: Personal and Academy Details */}
                            <div className="space-y-6">
                                {/* Section 1: Personal Information */}
                                <div className="space-y-3">
                                    <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                        <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">1</span>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1 md:col-span-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Full Name <span className="text-red-500">*</span></Label>
                                            <Input 
                                                className="h-9 bg-white border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm font-medium shadow-sm transition-all" 
                                                placeholder="e.g. Ziad Ahmed" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 md:col-span-1">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Age</Label>
                                                <Input 
                                                    className="h-9 bg-white border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm font-medium shadow-sm transition-all text-center pr-2" 
                                                    type="number" 
                                                    placeholder="5" 
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Gender</Label>
                                                <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                                                    <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="MALE">Male</SelectItem>
                                                        <SelectItem value="FEMALE">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Email <span className="text-red-500">*</span></Label>
                                            <Input 
                                                className="h-9 bg-[#f8fafc] border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm font-medium shadow-sm transition-all" 
                                                type="email" 
                                                placeholder="parent@example.com" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">Phone (WhatsApp) <span className="text-red-500">*</span></Label>
                                                <Input 
                                                    className="h-9 bg-[#f8fafc] border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm font-medium shadow-sm transition-all" 
                                                    placeholder="+971 50 123 4567" 
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const filtered = val.replace(/[^\d+ ]/g, '');
                                                        setFormData({...formData, phone: filtered});
                                                    }}
                                                    required 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs font-bold text-[#0B213F]">TRN (Tax Number)</Label>
                                                <Input 
                                                    className="h-9 bg-[#f8fafc] border-[#B2C5E0] focus-visible:ring-[#1C5CAA] focus-visible:border-[#1C5CAA] rounded-xl text-sm font-medium shadow-sm transition-all" 
                                                    placeholder="100xxxxxxxxxxxx" 
                                                    value={formData.trn}
                                                    onChange={(e) => setFormData({...formData, trn: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Academy & Enrollment */}
                                <div className="space-y-3">
                                    <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                        <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">2</span>
                                        Academy & Enrollment
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Branch</Label>
                                            {user?.role === 'STAFF' ? (
                                                // STAFF: read-only badge showing their branch
                                                <div className="h-9 bg-blue-50 border border-[#B2C5E0] rounded-xl px-3 flex items-center">
                                                    <span className="text-sm font-semibold text-[#1C5CAA]">
                                                        {branches.find(b => b.id === formData.branchId)?.name || 'Loading...'}
                                                    </span>
                                                    <span className="ml-2 text-xs text-blue-400">(Your branch)</span>
                                                </div>
                                            ) : (
                                                // SUPER_ADMIN: full dropdown
                                                <Select value={formData.branchId} onValueChange={(v) => setFormData({...formData, branchId: v})}>
                                                    <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                                    <SelectContent>
                                                        {branches.map(b => (
                                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Swimming Level</Label>
                                            <Select value={formData.level} onValueChange={(v) => setFormData({...formData, level: v})}>
                                                <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="T1">Toddler 1 (T1)</SelectItem>
                                                    <SelectItem value="K1">Kids 1 (K1)</SelectItem>
                                                    <SelectItem value="K2">Kids 2 (K2)</SelectItem>
                                                    <SelectItem value="A1">Adults 1 (A1)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-1">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Starting Date</Label>
                                            <Input 
                                                className="h-9 bg-[#f8fafc] border-[#B2C5E0] px-3 text-sm font-medium shadow-sm rounded-xl" 
                                                type="date" 
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Expiry Date</Label>
                                            <Input 
                                                className="h-9 bg-[#f8fafc] border-[#B2C5E0] px-3 text-sm font-medium shadow-sm rounded-xl" 
                                                type="date" 
                                                value={formData.expiryDate}
                                                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                                required 
                                            />
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

                                <div className="grid grid-cols-1 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-[#0B213F]">Membership Package</Label>
                                        <Select value={formData.packageType} onValueChange={(v) => setFormData({...formData, packageType: v})}>
                                            <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
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
                                                        <SelectItem value="PLATINUM">Platinum (36 Classes)</SelectItem>
                                                        <SelectItem value="INDIVIDUAL">Individual (10 Classes)</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Payment Method</Label>
                                            <Select value={formData.paymentMode} onValueChange={(v) => setFormData({...formData, paymentMode: v})}>
                                                <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="CASH">Cash</SelectItem>
                                                    <SelectItem value="CARD">Credit Card / POS</SelectItem>
                                                    <SelectItem value="ONLINE">Online Transfer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Fee Status <span className="text-red-500">*</span></Label>
                                            <Select value={formData.paymentStatus} onValueChange={(v) => setFormData({...formData, paymentStatus: v})}>
                                                <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PAID">Paid</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-[#0B213F]">Discount (AED)</Label>
                                        <Input 
                                            className="h-9 bg-white border-[#B2C5E0] text-sm font-medium shadow-sm rounded-xl text-muted-foreground" 
                                            type="number" 
                                            placeholder="0" 
                                            value={formData.discount}
                                            onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Financial Summary Box */}
                                    <div className="bg-white p-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(30,58,138,0.15)] border border-slate-100 space-y-2 relative overflow-hidden">
                                        <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                            <span>Package Price:</span>
                                            <span className="text-[#0B213F]">AED {currentPrice}</span>
                                        </div>
                                        <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                            <span>Discount:</span>
                                            <span className="text-red-500">- AED {formData.discount}</span>
                                        </div>
                                        <div className="h-px bg-slate-200 w-full my-3" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-[#0B213F]">Total Amount:</span>
                                            <span className="font-black text-[#1C5CAA] text-lg uppercase">AED {totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#f8fafc] px-6 py-4 flex gap-3 relative rounded-b-3xl items-center border-t border-slate-100">
                        <Button type="button" variant="outline" className="rounded-[10px] shadow-sm border-[#B2C5E0] text-[#0B213F] font-bold h-10 px-5 bg-white hover:bg-slate-50" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="font-black text-white bg-[#1C5CAA] hover:bg-blue-800 h-10 px-8 rounded-[10px] ml-auto shadow-md text-[13px]">
                            {isLoading ? "Saving..." : isEditMode ? "Update Student" : "Register Student"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
