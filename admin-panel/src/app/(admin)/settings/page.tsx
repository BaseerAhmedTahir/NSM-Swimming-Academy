"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    Settings2, Building2, Clock, UserSquare2,
    CreditCard, Save, Plus, Trash2, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [branchesList, setBranchesList] = useState<any[]>([]);
    const [timeSlotsList, setTimeSlotsList] = useState<any[]>([]);
    const [packagesList, setPackagesList] = useState<any[]>([]);

    const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
    const [newBranchData, setNewBranchData] = useState({ name: "", email: "", phone: "", address: "", trn: "" });
    const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
    const [editingPkgId, setEditingPkgId] = useState<number | null>(null);
    const [newSlotStartTime, setNewSlotStartTime] = useState("");
    const [newSlotEndTime, setNewSlotEndTime] = useState("");

    const [isManageLoginModalOpen, setIsManageLoginModalOpen] = useState(false);
    const [selectedBranchForLogin, setSelectedBranchForLogin] = useState<any>(null);
    const [loginFormData, setLoginFormData] = useState({ name: "", username: "", email: "", password: "" });
    const [newSlotType, setNewSlotType] = useState("");
    const [newSlotTypeCustom, setNewSlotTypeCustom] = useState("");
    const [newPkgName, setNewPkgName] = useState("");
    const [newPkgClasses, setNewPkgClasses] = useState("");
    const [newPkgPrice, setNewPkgPrice] = useState("");
    const [newPkgDuration, setNewPkgDuration] = useState("1");

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            if (res.data.success) {
                setBranchesList(res.data.data.results || res.data.data);
            }
        } catch (err) { console.error(err); }
    };

    const handleUpdateBranch = async (branchId: string, updatedData: any) => {
        setIsSaving(true);
        try {
            await api.put(`/branches/${branchId}`, updatedData);
            toast.success("Branch details updated successfully");
            fetchBranches();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update branch");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteBranch = async (branchId: string, branchName: string) => {
        if (!window.confirm(`Are you sure you want to delete the "${branchName}" branch? This action cannot be undone and will affect all related data.`)) return;
        try {
            await api.delete(`/branches/${branchId}`);
            toast.success(`Branch "${branchName}" deleted successfully`);
            fetchBranches();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete branch. It may have associated data.");
        }
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [branchRes, settingsRes] = await Promise.all([
                    api.get('/branches'),
                    api.get('/settings')
                ]);

                if (branchRes.data.success) {
                    setBranchesList(branchRes.data.data.results || branchRes.data.data);
                }

                if (settingsRes.data.success) {
                    const allSettings = settingsRes.data.data;
                    
                    // Map Time Slots
                    const slotsSetting = allSettings.find((s: any) => s.key === 'TIME_SLOTS');
                    if (slotsSetting) {
                        try {
                            setTimeSlotsList(JSON.parse(slotsSetting.value));
                        } catch (e) { console.error("Failed to parse time slots", e); }
                    }

                    // Map Packages
                    const dynamicPackages = allSettings
                        .filter((s: any) => s.key.startsWith('PACKAGE_'))
                        .map((s: any) => {
                            try {
                                const val = JSON.parse(s.value);
                                return {
                                    id: s.id,
                                    name: s.key.replace('PACKAGE_', '').charAt(0) + s.key.replace('PACKAGE_', '').slice(1).toLowerCase() + " Package",
                                    classes: val.classes,
                                    price: val.price,
                                    popular: s.key === 'PACKAGE_SILVER'
                                };
                            } catch (e) { return null; }
                        })
                        .filter(Boolean);
                    
                    if (dynamicPackages.length > 0) setPackagesList(dynamicPackages);
                }
            } catch (err) { console.error(err); }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const settingsPayload = [
                { key: 'TIME_SLOTS', value: JSON.stringify(timeSlotsList) },
                ...packagesList.map(pkg => {
                    const match = pkg.name.match(/^(.+?)\s+Package/i);
                    const prefix = match ? match[1].toUpperCase() : pkg.name.toUpperCase().replace(/\s+/g, '_');
                    return {
                        key: `PACKAGE_${prefix}`,
                        value: JSON.stringify({
                            classes: parseInt(pkg.classes) || 0,
                            price: parseFloat(pkg.price) || 0,
                            durationMonths: parseInt(pkg.durationMonths) || 1
                        })
                    };
                })
            ];
            await Promise.all([
                api.post('/settings/bulk', { settings: settingsPayload }),
                ...branchesList.map(branch => {
                    const phone = (document.getElementById(`phone-${branch.id}`) as HTMLInputElement)?.value || branch.phone;
                    const email = (document.getElementById(`email-${branch.id}`) as HTMLInputElement)?.value || branch.email;
                    const address = (document.getElementById(`address-${branch.id}`) as HTMLInputElement)?.value || branch.address;
                    const trn = (document.getElementById(`trn-${branch.id}`) as HTMLInputElement)?.value || branch.trn;
                    return api.put(`/branches/${branch.id}`, { phone, email, address, trn, permissions: branch.permissions });
                })
            ]);
            toast.success("Settings saved successfully");
        } catch (err: any) {
             toast.error(err.response?.data?.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post('/branches', newBranchData);
            toast.success("Branch created successfully");
            setIsAddBranchModalOpen(false);
            setNewBranchData({ name: "", email: "", phone: "", address: "", trn: "" });
            fetchBranches();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create branch");
        } finally {
            setIsSaving(false);
        }
    };

    const handleManageLoginClick = (branch: any) => {
        setSelectedBranchForLogin(branch);
        setLoginFormData({ 
            name: `${branch.name} Admin`, 
            username: `${branch.name.replace(/\s+/g, '').toLowerCase()}_admin`, 
            email: branch.email || "", 
            password: "" 
        });
        setIsManageLoginModalOpen(true);
    };

    const handleSaveBranchLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.post(`/branches/${selectedBranchForLogin.id}/admin`, loginFormData);
            toast.success("Branch login credentials updated successfully!");
            setIsManageLoginModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update credentials");
        } finally {
            setIsSaving(false);
        }
    };

    const formatTime = (time24: string) => {
        if (!time24) return "";
        const [h, m] = time24.split(":");
        const hours = parseInt(h);
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        return `${hours12}:${m} ${ampm}`;
    };

    const handleAddSlot = () => {
        if (!newSlotStartTime || !newSlotEndTime || !newSlotType) return toast.error("Fill all slot fields");
        const finalType = newSlotType === "Custom" ? newSlotTypeCustom : newSlotType;
        if (newSlotType === "Custom" && !newSlotTypeCustom) return toast.error("Provide a custom designation type");

        const formattedTime = `${formatTime(newSlotStartTime)} - ${formatTime(newSlotEndTime)}`;

        if (editingSlotId) {
            setTimeSlotsList(timeSlotsList.map(s => s.id === editingSlotId ? { ...s, time: formattedTime, type: finalType } : s));
            setEditingSlotId(null);
            toast.success("Time slot updated successfully");
        } else {
            setTimeSlotsList([...timeSlotsList, { id: Date.now(), time: formattedTime, type: finalType, active: true }]);
            toast.success("Time slot added to grid");
        }

        setNewSlotStartTime("");
        setNewSlotEndTime("");
        setNewSlotType("");
        setNewSlotTypeCustom("");
    };

    const handleEditSlot = (slot: any) => {
        setEditingSlotId(slot.id);
        setNewSlotStartTime("");
        setNewSlotEndTime("");
        
        const knownTypes = ["Kids", "Adults", "Toddlers", "Kids / Adults"];
        if (knownTypes.includes(slot.type)) {
            setNewSlotType(slot.type);
            setNewSlotTypeCustom("");
        } else {
            setNewSlotType("Custom");
            setNewSlotTypeCustom(slot.type);
        }
        toast.info("Select Start/End time to overwrite this slot");
    };

    const handleAddPackage = () => {
        if (!newPkgName || !newPkgClasses || !newPkgPrice) return toast.error("Fill all package fields");
        if (editingPkgId) {
            setPackagesList(packagesList.map(p => p.id === editingPkgId ? { ...p, name: newPkgName.includes("Package") ? newPkgName : newPkgName + " Package", classes: parseInt(newPkgClasses), price: parseFloat(newPkgPrice), durationMonths: parseInt(newPkgDuration) || 1 } : p));
            setEditingPkgId(null);
            toast.success("Package updated successfully");
        } else {
            setPackagesList([...packagesList, { 
                    id: Date.now(), 
                    name: newPkgName.includes("Package") ? newPkgName : newPkgName + " Package", 
                    classes: parseInt(newPkgClasses), 
                    price: parseFloat(newPkgPrice),
                    durationMonths: parseInt(newPkgDuration) || 1,
                    popular: false 
                }]);
            toast.success("Package created successfully");
        }
        setNewPkgName("");
        setNewPkgClasses("");
        setNewPkgPrice("");
        setNewPkgDuration("1");
    };

    const handleEditPackage = (pkg: any) => {
        setEditingPkgId(pkg.id);
        setNewPkgName(pkg.name.replace(" Package", ""));
        setNewPkgClasses(pkg.classes.toString());
        setNewPkgPrice(pkg.price.toString());
        setNewPkgDuration((pkg.durationMonths || 1).toString());
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Settings2 className="w-8 h-8 text-primary" />
                        System Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">Configure academy branches, scheduling slots, and financial packages.</p>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="font-bold shadow-sm gap-2">
                    <Save className="w-4 h-4" /> {isSaving ? "Saving Config..." : "Save Global Settings"}
                </Button>
            </div>

            <Tabs defaultValue="branches" className="w-full">
                <TabsList className="bg-muted p-1 rounded-xl mb-6 flex flex-wrap h-auto gap-2 justify-start">
                    <TabsTrigger value="branches" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 py-2.5 flex-grow sm:flex-grow-0">
                        <Building2 className="w-4 h-4 mr-2" /> Branches
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 py-2.5 flex-grow sm:flex-grow-0">
                        <Clock className="w-4 h-4 mr-2" /> Time Slots
                    </TabsTrigger>
                    <TabsTrigger value="finance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 py-2.5 flex-grow sm:flex-grow-0">
                        <CreditCard className="w-4 h-4 mr-2" /> Packages & Pricing
                    </TabsTrigger>
                    <TabsTrigger value="staff" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white font-bold px-6 py-2.5 flex-grow sm:flex-grow-0">
                        <UserSquare2 className="w-4 h-4 mr-2" /> Staff Setup
                    </TabsTrigger>
                </TabsList>

                {/* --- 1. BRANCH CONFIGURATION --- */}
                <TabsContent value="branches" className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-primary/5">
                            <div>
                                <h3 className="text-lg font-black text-foreground">Academy Branches</h3>
                                <p className="text-sm text-muted-foreground">Manage location details and contact information.</p>
                            </div>
                            {/* <Button variant="outline" size="sm" className="font-bold border-border/50 bg-white" onClick={() => setIsAddBranchModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" /> Add Branch
                            </Button> */}
                        </div>

                        <div className="p-6 grid gap-6">
                            {branchesList.map((branch) => (
                                <div key={branch.id} className="p-4 rounded-xl border border-border/50 bg-muted/10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-foreground text-lg">{branch.name}</h4>
                                            {branch.name.includes("Dubai") && <span className="text-[10px] font-black uppercase bg-primary text-white px-1.5 rounded">HQ</span>}
                                        </div>
                                        {/* <div className="flex items-center gap-2 mt-2">
                                            <Label className="text-xs text-muted-foreground">Active Hub</Label>
                                            <Switch defaultChecked={branch.active} />
                                        </div> */}
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Contact Number</Label>
                                                <Input 
                                                    id={`phone-${branch.id}`}
                                                    defaultValue={branch.phone} 
                                                    className="h-8 text-sm" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Email Address</Label>
                                                <Input 
                                                    id={`email-${branch.id}`}
                                                    defaultValue={branch.email} 
                                                    className="h-8 text-sm" 
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Physical Address</Label>
                                                <Input 
                                                    id={`address-${branch.id}`}
                                                    defaultValue={branch.address} 
                                                    className="h-8 text-sm" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-[#1C5CAA] uppercase">Branch TRN</Label>
                                                <Input 
                                                    id={`trn-${branch.id}`}
                                                    defaultValue={branch.trn} 
                                                    className="h-8 text-sm border-blue-200 focus:border-blue-500" 
                                                    placeholder="100xxxxxxxxxxxx"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="pt-2 border-t border-border/10">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Module Access (Admin Configuration)</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {['dashboard', 'schedule', 'registration', 'payments', 'coaches', 'reports', 'notifications', 'reminders'].map(module => {
                                                    const currentPerms = branch.permissions ? (typeof branch.permissions === 'string' ? JSON.parse(branch.permissions) : branch.permissions) : [];
                                                    const isChecked = currentPerms.includes(module);
                                                    
                                                    return (
                                                        <div key={module} className="flex items-center gap-1.5 bg-background border border-border/50 px-2 py-1 rounded-md">
                                                            <input 
                                                                type="checkbox" 
                                                                id={`perm-${branch.id}-${module}`} 
                                                                className="w-3 h-3 text-primary border-border focus:ring-primary rounded-sm"
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    const updatedPerms = e.target.checked 
                                                                        ? [...currentPerms, module] 
                                                                        : currentPerms.filter((m: string) => m !== module);
                                                                    const modifiedList = branchesList.map(b => 
                                                                        b.id === branch.id 
                                                                            ? { ...b, permissions: JSON.stringify(updatedPerms) } 
                                                                            : b
                                                                    );
                                                                    setBranchesList(modifiedList);
                                                                }}
                                                            />
                                                            <label htmlFor={`perm-${branch.id}-${module}`} className="text-xs font-medium text-foreground capitalize cursor-pointer">
                                                                {module}
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-4 lg:mt-0">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleManageLoginClick(branch)} 
                                            className="font-bold border-border/50 bg-white"
                                        >
                                            <UserSquare2 className="w-4 h-4 mr-2" /> Manage Login
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="font-bold bg-primary hover:bg-primary/90"
                                            onClick={() => {
                                                const phone = (document.getElementById(`phone-${branch.id}`) as HTMLInputElement).value;
                                                const email = (document.getElementById(`email-${branch.id}`) as HTMLInputElement).value;
                                                const address = (document.getElementById(`address-${branch.id}`) as HTMLInputElement).value;
                                                const trn = (document.getElementById(`trn-${branch.id}`) as HTMLInputElement).value;
                                                handleUpdateBranch(branch.id, { phone, email, address, trn, permissions: branch.permissions });
                                            }}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </Button>
                                        {/* <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-error/10 hover:text-error transition-colors" onClick={() => handleDeleteBranch(branch.id, branch.name)}><Trash2 className="w-4 h-4" /></Button> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* --- 2. TIME SLOTS --- */}
                <TabsContent value="schedule" className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col lg:flex-row">

                        <div className="p-6 border-b lg:border-b-0 lg:border-r border-border/50 bg-muted/20 lg:w-1/3">
                            <h3 className="text-lg font-black text-foreground mb-1">Schedule Architecture</h3>
                            <p className="text-sm text-muted-foreground mb-6">Define the standard operating hours and recurring class intervals used in the Schedule grid.</p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input type="time" value={newSlotStartTime} onChange={(e) => setNewSlotStartTime(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input type="time" value={newSlotEndTime} onChange={(e) => setNewSlotEndTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Designated For</Label>
                                    <Select value={newSlotType} onValueChange={setNewSlotType}>
                                        <SelectTrigger><SelectValue placeholder="Select allowed groups" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kids">Kids</SelectItem>
                                            <SelectItem value="Adults">Adults</SelectItem>
                                            <SelectItem value="Toddlers">Toddlers</SelectItem>
                                            <SelectItem value="Kids / Adults">Kids & Adults</SelectItem>
                                            <SelectItem value="Custom">Custom Text...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {newSlotType === "Custom" && (
                                        <Input placeholder="Enter custom designation" className="mt-2" value={newSlotTypeCustom} onChange={(e) => setNewSlotTypeCustom(e.target.value)} />
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {editingSlotId && (
                                        <Button variant="outline" className="w-1/3 text-xs" onClick={() => {
                                            setEditingSlotId(null);
                                            setNewSlotStartTime("");
                                            setNewSlotEndTime("");
                                            setNewSlotType("");
                                            setNewSlotTypeCustom("");
                                        }}>Cancel</Button>
                                    )}
                                    <Button className={`${editingSlotId ? 'w-2/3' : 'w-full'} font-bold shadow-sm`} variant={editingSlotId ? "default" : "secondary"} onClick={handleAddSlot}>
                                        {editingSlotId ? <><Edit className="w-4 h-4 mr-2" /> Update Slot</> : <><Plus className="w-4 h-4 mr-2" /> Add Slot to Grid</>}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-0 lg:w-2/3">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-border/50">
                                        <TableHead className="font-bold text-foreground">Time Slot</TableHead>
                                        <TableHead className="font-bold text-foreground">Allowed Categories</TableHead>
                                        <TableHead className="font-bold text-foreground w-[100px] text-center">Status</TableHead>
                                        <TableHead className="text-right w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {timeSlotsList.map((slot) => (
                                        <TableRow key={slot.id} className="border-border/50 hover:bg-transparent">
                                            <TableCell className="font-black text-foreground">{slot.time}</TableCell>
                                            <TableCell className="font-medium text-muted-foreground">{slot.type}</TableCell>
                                            <TableCell className="text-center">
                                                <Switch checked={slot.active} onCheckedChange={(checked) => setTimeSlotsList(timeSlotsList.map(s => s.id === slot.id ? { ...s, active: checked } : s))} />
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditSlot(slot)} className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => setTimeSlotsList(timeSlotsList.filter(s => s.id !== slot.id))} className="text-muted-foreground hover:bg-error/10 hover:text-error"><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                </TabsContent>

                {/* --- 3. PACKAGES --- */}
                <TabsContent value="finance" className="space-y-6">
                    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col lg:flex-row-reverse">

                        <div className="p-6 border-b lg:border-b-0 lg:border-l border-border/50 bg-primary/5 lg:w-1/3 border-primary/20">
                            <h3 className="text-lg font-black text-primaryDark mb-1">Create New Package</h3>
                            <p className="text-sm text-muted-foreground mb-6">Add a new financial tier or promo package.</p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Package Name</Label>
                                    <Input placeholder="e.g. Platinum Plus" className="bg-white" value={newPkgName} onChange={(e) => setNewPkgName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Classes</Label>
                                    <Input type="number" placeholder="48" className="bg-white" value={newPkgClasses} onChange={(e) => setNewPkgClasses(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (AED)</Label>
                                    <Input type="number" placeholder="5000" className="bg-white" value={newPkgPrice} onChange={(e) => setNewPkgPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (Months)</Label>
                                    <Input type="number" placeholder="1" min="1" className="bg-white" value={newPkgDuration} onChange={(e) => setNewPkgDuration(e.target.value)} />
                                </div>
                                <div className="flex gap-2">
                                    {editingPkgId && (
                                        <Button variant="outline" className="w-1/3 text-xs bg-white" onClick={() => {
                                            setEditingPkgId(null);
                                            setNewPkgName("");
                                            setNewPkgClasses("");
                                            setNewPkgPrice("");
                                        }}>Cancel</Button>
                                    )}
                                    <Button className={`${editingPkgId ? 'w-2/3' : 'w-full'} font-bold shadow-sm`} onClick={handleAddPackage}>
                                        {editingPkgId ? <><Edit className="w-4 h-4 mr-2" /> Update Package</> : "Create Package"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-0 lg:w-2/3">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-border/50">
                                        <TableHead className="font-bold text-foreground">Tier Name</TableHead>
                                        <TableHead className="font-bold text-foreground text-center">Class Count</TableHead>
                                        <TableHead className="font-bold text-foreground text-right w-[120px]">Price (AED)</TableHead>
                                        <TableHead className="text-right w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {packagesList.map((pkg) => (
                                        <TableRow key={pkg.id} className="border-border/50 hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground">{pkg.name}</span>
                                                    {pkg.popular && <span className="bg-success/10 text-success text-[10px] uppercase font-black px-1.5 rounded">Most Popular</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{pkg.classes}</TableCell>
                                            <TableCell className="text-right font-black text-foreground">AED {pkg.price}</TableCell>
                                            <TableCell className="text-right flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditPackage(pkg)} className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" onClick={() => setPackagesList(packagesList.filter(p => p.id !== pkg.id))} className="text-muted-foreground hover:text-error"><Trash2 className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                </TabsContent>

                {/* --- 4. STAFF QUICK LINKS --- */}
                <TabsContent value="staff">
                    <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm text-center">
                        <UserSquare2 className="w-16 h-16 mx-auto text-primary opacity-50 mb-4" />
                        <h3 className="text-2xl font-black text-foreground mb-2">Manage Academy Instructors</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">Coach profiles, assignments, and contact details are managed in the dedicated Staff directory.</p>
                        <Button className="font-bold shadow-sm" variant="secondary" asChild>
                            <a href="/coaches">Go To Coaches Subsystem</a>
                        </Button>
                    </div>
                </TabsContent>

            </Tabs>

            {/* Add Branch Modal */}
            <Dialog open={isAddBranchModalOpen} onOpenChange={setIsAddBranchModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Add New Branch</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            Fill in the primary details to establish a new academy branch location.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateBranch} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="font-bold">Branch Name <span className="text-error">*</span></Label>
                            <Input id="name" placeholder="e.g. Ajman Hub" value={newBranchData.name} onChange={(e) => setNewBranchData({...newBranchData, name: e.target.value})} required className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="font-bold">Phone Number</Label>
                                <Input id="phone" value={newBranchData.phone} onChange={(e) => setNewBranchData({...newBranchData, phone: e.target.value})} className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold">Email Address</Label>
                                <Input id="email" type="email" value={newBranchData.email} onChange={(e) => setNewBranchData({...newBranchData, email: e.target.value})} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="font-bold">Physical Address</Label>
                            <Input id="address" value={newBranchData.address} onChange={(e) => setNewBranchData({...newBranchData, address: e.target.value})} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="trn" className="font-bold text-[#1C5CAA]">Branch TRN</Label>
                            <Input id="trn" value={newBranchData.trn} onChange={(e) => setNewBranchData({...newBranchData, trn: e.target.value})} className="rounded-xl" />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsAddBranchModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isSaving} className="font-bold rounded-xl shadow-md bg-primary hover:bg-primary/90">
                                {isSaving ? "Creating..." : "Create Branch"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Manage Branch Login Modal */}
            <Dialog open={isManageLoginModalOpen} onOpenChange={setIsManageLoginModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Manage Branch Login</DialogTitle>
                        <DialogDescription className="font-medium text-muted-foreground">
                            Set up distinct login credentials for {selectedBranchForLogin?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveBranchLogin} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="adminName" className="font-bold">Admin Display Name <span className="text-error">*</span></Label>
                            <Input id="adminName" value={loginFormData.name} onChange={(e) => setLoginFormData({...loginFormData, name: e.target.value})} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminUsername" className="font-bold">Username <span className="text-error">*</span></Label>
                            <Input id="adminUsername" value={loginFormData.username} onChange={(e) => setLoginFormData({...loginFormData, username: e.target.value})} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminEmail" className="font-bold">Email Address <span className="text-error">*</span></Label>
                            <Input id="adminEmail" type="email" value={loginFormData.email} onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})} required className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminPassword" className="font-bold">Password <span className="text-error">*</span></Label>
                            <Input id="adminPassword" type="password" value={loginFormData.password} onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})} required minLength={6} placeholder="Enter a secure password..." className="rounded-xl" />
                            <p className="text-[10px] text-muted-foreground mt-1">If an account already exists, entering a new password will forcefully overwrite it.</p>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsManageLoginModalOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={isSaving} className="font-bold rounded-xl shadow-md bg-primary hover:bg-primary/90">
                                {isSaving ? "Saving..." : "Save Credentials"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
