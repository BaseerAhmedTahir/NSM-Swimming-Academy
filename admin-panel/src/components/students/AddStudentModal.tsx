"use client";

import { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const VAT_RATE = 0.05;

const KNOWN_LEVELS = ["T1", "T2", "T3", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"];

export default function AddStudentModal({ isOpen, onClose, onSuccess, initialData, isEditMode = false }: AddStudentModalProps) {
    const { user } = useAuth();
    const [branches, setBranches] = useState<any[]>([]);
    const [allSettings, setAllSettings] = useState<any[]>([]);
    const [dynamicPackages, setDynamicPackages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customLevelText, setCustomLevelText] = useState("");

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
        paidAmount: 0,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        trn: ""
    });

    // Financial calculations
    const activeItem = dynamicPackages.find(p => p.id === formData.packageType);
    const currentPrice = activeItem ? activeItem.price : 0;
    const priceAfterDiscount = Math.max(0, currentPrice - formData.discount);
    const vatAmount = parseFloat((priceAfterDiscount * VAT_RATE).toFixed(2));
    const totalPrice = parseFloat((priceAfterDiscount + vatAmount).toFixed(2));
    const remainingAmount = formData.paymentStatus === 'PARTIAL'
        ? parseFloat(Math.max(0, totalPrice - formData.paidAmount).toFixed(2))
        : 0;

    // Derived: selected branch TRN
    const selectedBranchObj = branches.find(b => b.id === formData.branchId);
    const branchTrn = selectedBranchObj?.trn || "";

    // Is the level a custom one (not in KNOWN_LEVELS)?
    const isCustomLevel = formData.level === 'CUSTOM' || (!KNOWN_LEVELS.includes(formData.level) && formData.level !== '');

    useEffect(() => {
        if (isOpen) {
            api.get('/branches').then(res => {
                const data = res.data.data.results || res.data.data;
                setBranches(data);
                if (!formData.branchId) {
                    const defaultBranch = user?.role === 'STAFF' && user?.branchId
                        ? user.branchId
                        : data[0]?.id || '';
                    setFormData(prev => ({ ...prev, branchId: defaultBranch }));
                }
            }).catch(console.error);
            api.get('/settings').then(res => {
                if (res.data.success) setAllSettings(res.data.data);
            }).catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!allSettings.length || !formData.branchId || branches.length === 0) return;
        const branchId = formData.branchId;
        const branchPrefix = `_${branchId}`;

        let branchPackages = allSettings.filter((s: any) => s.key.startsWith('PACKAGE_') && s.key.endsWith(branchPrefix));
        let packagesToUse = branchPackages;

        if (branchPackages.length === 0) {
            packagesToUse = allSettings.filter((s: any) => /^PACKAGE_[A-Z_]+$/.test(s.key) && !branches.some((b: any) => s.key.endsWith('_' + b.id)));
        }

        const pkgs = packagesToUse.map((s: any) => {
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

        if (pkgs.length > 0) {
            setDynamicPackages(pkgs);
            setFormData(prev => {
                const isValid = pkgs.some((p: any) => p.id === prev.packageType);
                const selectedPkg = pkgs.find((p: any) => p.id === prev.packageType) || pkgs[0];
                const months = selectedPkg?.durationMonths || 1;
                const start = new Date(prev.startDate || new Date());
                const expiry = new Date(start);
                expiry.setMonth(expiry.getMonth() + months);
                return {
                    ...prev,
                    packageType: isValid ? prev.packageType : pkgs[0].id,
                    expiryDate: isEditMode ? prev.expiryDate : expiry.toISOString().split('T')[0]
                };
            });
        }
    }, [allSettings, formData.branchId, branches, isEditMode]);

    // Auto-recalculate expiry when package type or start date changes (add mode only)
    useEffect(() => {
        if (isEditMode || dynamicPackages.length === 0) return;
        const selectedPkg = dynamicPackages.find((p: any) => p.id === formData.packageType);
        if (!selectedPkg) return;
        const months = selectedPkg.durationMonths || 1;
        const start = new Date(formData.startDate || new Date());
        const expiry = new Date(start);
        expiry.setMonth(expiry.getMonth() + months);
        setFormData(prev => ({ ...prev, expiryDate: expiry.toISOString().split('T')[0] }));
    }, [formData.packageType, formData.startDate, dynamicPackages]);

    useEffect(() => {

        if (initialData && isEditMode) {
            const level = initialData.level || "K2";
            const isCustom = !KNOWN_LEVELS.includes(level);
            setFormData({
                name: initialData.name || "",
                age: initialData.age || 5,
                email: initialData.email || "",
                phone: initialData.phone || "+971 ",
                discount: initialData.discount || 0,
                gender: initialData.gender || "MALE",
                category: initialData.category || "KID",
                branchId: initialData.branchId || "",
                level: isCustom ? "CUSTOM" : level,
                packageType: initialData.packageType || "SILVER",
                paymentMode: initialData.paymentMode || "CARD",
                paymentStatus: initialData.paymentStatus || "PAID",
                paidAmount: initialData.paidAmount ?? 0,
                startDate: initialData.membershipStartDate ? new Date(initialData.membershipStartDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                expiryDate: initialData.membershipExpiryDate ? new Date(initialData.membershipExpiryDate).toISOString().split('T')[0] : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                trn: initialData.trn || ""
            });
            if (isCustom) setCustomLevelText(level);
        } else if (!isEditMode) {
            setCustomLevelText("");
            setFormData({
                name: "",
                age: 5,
                email: "",
                phone: "+971 ",
                discount: 0,
                gender: "MALE",
                category: "KID",
                branchId: user?.role === 'STAFF' && user?.branchId ? user.branchId : branches[0]?.id || '',
                level: "K2",
                packageType: "SILVER",
                paymentMode: "CARD",
                paymentStatus: "PAID",
                paidAmount: 0,
                startDate: new Date().toISOString().split('T')[0],
                expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                trn: ""
            });
        }
    }, [initialData, isEditMode, isOpen, branches]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.phone || formData.phone.trim() === "+971") {
            toast.error("Please enter a valid phone number");
            return;
        }
        const digitsOnly = formData.phone.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            toast.error("Phone number seems too short. Please provide a full number.");
            return;
        }
        if (!formData.paymentStatus) {
            toast.error("Please select a Fee Status");
            return;
        }
        if (formData.level === 'CUSTOM' && !customLevelText.trim()) {
            toast.error("Please enter a custom level name");
            return;
        }
        if (formData.paymentStatus === 'PARTIAL' && formData.paidAmount <= 0) {
            toast.error("Please enter the amount paid for partial payment");
            return;
        }

        const finalLevel = formData.level === 'CUSTOM' ? customLevelText.trim() : formData.level;

        setIsLoading(true);
        try {
            const baseData: any = {
                name: formData.name,
                age: formData.age,
                gender: formData.gender,
                email: formData.email,
                phone: formData.phone,
                level: finalLevel,
                category: formData.category,
                discount: formData.discount,
                branchId: formData.branchId,
                paymentStatus: formData.paymentStatus,
                trn: formData.trn,
                vatAmount,
            };

            if (formData.paymentStatus === 'PARTIAL') {
                baseData.paidAmount = formData.paidAmount;
            }

            if (isEditMode) {
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
                    ? "Welcome email sent!"
                    : `Student added, but email failed: ${res.data.data.emailResult?.error || 'Unknown error'}`;
                toast.success(`Student added! ${emailStatus}`);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            const errorData = err.response?.data;
            let errorMessage = "Failed to save student.";
            if (errorData?.error?.details && Array.isArray(errorData.error.details)) {
                errorMessage = errorData.error.details.map((d: any) => `${d.path[d.path.length - 1]}: ${d.message}`).join(" | ");
            } else {
                errorMessage = errorData?.message || err.message || errorMessage;
            }
            toast.error(errorMessage, { duration: 6000 });
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
                            {/* Left Column */}
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
                                                    type="number" placeholder="5"
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
                                                type="email" placeholder="parent@example.com"
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
                                                        const filtered = e.target.value.replace(/[^\d+ ]/g, '');
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
                                        Academy &amp; Enrollment
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Branch</Label>
                                            {user?.role === 'STAFF' ? (
                                                <div className="h-9 bg-blue-50 border border-[#B2C5E0] rounded-xl px-3 flex items-center">
                                                    <span className="text-sm font-semibold text-[#1C5CAA]">
                                                        {branches.find(b => b.id === formData.branchId)?.name || 'Loading...'}
                                                    </span>
                                                    <span className="ml-2 text-xs text-blue-400">(Your branch)</span>
                                                </div>
                                            ) : (
                                                <Select value={formData.branchId} onValueChange={(v) => setFormData({...formData, branchId: v})}>
                                                    <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                                    <SelectContent>
                                                        {branches.map(b => (
                                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                            {/* Branch TRN display */}
                                            {branchTrn && (
                                                <p className="text-[11px] text-[#1C5CAA] font-bold mt-1 flex items-center gap-1">
                                                    <span className="bg-blue-50 border border-blue-200 rounded px-2 py-0.5">
                                                        Branch TRN: <span className="font-black">{branchTrn}</span>
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-[#0B213F]">Swimming Level</Label>
                                            <Select value={formData.level === 'CUSTOM' ? 'CUSTOM' : (KNOWN_LEVELS.includes(formData.level) ? formData.level : 'CUSTOM')} onValueChange={(v) => {
                                                setFormData({...formData, level: v});
                                                if (v !== 'CUSTOM') setCustomLevelText("");
                                            }}>
                                                <SelectTrigger className="h-9 bg-white border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="T1">Toddler 1 (T1)</SelectItem>
                                                    <SelectItem value="T2">Toddler 2 (T2)</SelectItem>
                                                    <SelectItem value="T3">Toddler 3 (T3)</SelectItem>
                                                    <SelectItem value="K1">Kids 1 (K1)</SelectItem>
                                                    <SelectItem value="K2">Kids 2 (K2)</SelectItem>
                                                    <SelectItem value="K3">Kids 3 (K3)</SelectItem>
                                                    <SelectItem value="K4">Kids 4 (K4)</SelectItem>
                                                    <SelectItem value="K5">Kids 5 (K5)</SelectItem>
                                                    <SelectItem value="K6">Kids 6 (K6)</SelectItem>
                                                    <SelectItem value="K7">Kids 7 (K7)</SelectItem>
                                                    <SelectItem value="K8">Kids 8 (K8)</SelectItem>
                                                    <SelectItem value="A1">Adults 1 (A1)</SelectItem>
                                                    <SelectItem value="A2">Adults 2 (A2)</SelectItem>
                                                    <SelectItem value="A3">Adults 3 (A3)</SelectItem>
                                                    <SelectItem value="A4">Adults 4 (A4)</SelectItem>
                                                    <SelectItem value="A5">Adults 5 (A5)</SelectItem>
                                                    <SelectItem value="A6">Adults 6 (A6)</SelectItem>
                                                    <SelectItem value="A7">Adults 7 (A7)</SelectItem>
                                                    <SelectItem value="A8">Adults 8 (A8)</SelectItem>
                                                    <SelectItem value="CUSTOM">✏️ Custom Level...</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {(formData.level === 'CUSTOM' || isCustomLevel) && (
                                                <Input
                                                    className="h-9 mt-1 bg-white border-[#B2C5E0] rounded-xl text-sm font-medium"
                                                    placeholder="e.g. Advanced Adults, Private"
                                                    value={customLevelText}
                                                    onChange={(e) => setCustomLevelText(e.target.value)}
                                                />
                                            )}
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

                            {/* Right Column: Package & Financials */}
                            <div className="space-y-6">
                                <h3 className="text-[13px] font-black text-[#0B213F] flex items-center gap-2">
                                    <span className="w-[22px] h-[22px] rounded-full bg-blue-100 text-[#1C5CAA] flex items-center justify-center text-[11px]">3</span>
                                    Package &amp; Financials
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
                                            <Select value={formData.paymentStatus} onValueChange={(v) => setFormData({...formData, paymentStatus: v, paidAmount: 0})}>
                                                <SelectTrigger className="h-9 bg-[#f8fafc] border-[#B2C5E0] shadow-sm rounded-xl font-medium"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PAID">Paid</SelectItem>
                                                    <SelectItem value="PARTIAL">Partial Payment</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Partial Payment Amount */}
                                    {formData.paymentStatus === 'PARTIAL' && (
                                        <div className="space-y-1">
                                            <Label className="text-xs font-bold text-orange-600">Amount Paid Now (AED) <span className="text-red-500">*</span></Label>
                                            <Input
                                                className="h-9 bg-orange-50 border-orange-200 focus-visible:ring-orange-400 rounded-xl text-sm font-medium shadow-sm"
                                                type="number"
                                                step="any"
                                                placeholder="0.00"
                                                min={0}
                                                max={totalPrice}
                                                value={formData.paidAmount === 0 ? '' : formData.paidAmount}
                                                onChange={(e) => setFormData({...formData, paidAmount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-[#0B213F]">Discount (AED)</Label>
                                        <Input
                                            className="h-9 bg-white border-[#B2C5E0] text-sm font-medium shadow-sm rounded-xl text-muted-foreground"
                                            type="number" 
                                            step="any"
                                            placeholder="0"
                                            value={formData.discount === 0 ? '' : formData.discount}
                                            onChange={(e) => setFormData({...formData, discount: e.target.value === '' ? 0 : parseFloat(e.target.value)})}
                                        />
                                    </div>
                                </div>

                                {/* Financial Summary Box */}
                                <div className="bg-white p-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(30,58,138,0.15)] border border-slate-100 space-y-2 relative overflow-hidden">
                                    <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                        <span>Package Price:</span>
                                        <span className="text-[#0B213F]">AED {currentPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                        <span>Discount:</span>
                                        <span className="text-red-500">- AED {formData.discount}</span>
                                    </div>
                                    <div className="flex justify-between text-[13px] font-bold text-[#476082]">
                                        <span>VAT (5%):</span>
                                        <span className="text-emerald-600">+ AED {vatAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-slate-200 w-full my-3" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-[#0B213F]">Total Amount:</span>
                                        <span className="font-black text-[#1C5CAA] text-lg uppercase">AED {totalPrice.toFixed(2)}</span>
                                    </div>
                                    {formData.paymentStatus === 'PARTIAL' && (
                                        <>
                                            <div className="flex justify-between text-[13px] font-bold text-green-700">
                                                <span>Amount Paid:</span>
                                                <span>AED {formData.paidAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[13px] font-bold text-orange-600">
                                                <span>Remaining:</span>
                                                <span>AED {remainingAmount.toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
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
