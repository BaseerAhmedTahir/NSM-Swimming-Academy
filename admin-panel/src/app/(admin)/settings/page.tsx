"use client";

import { useState } from "react";
import {
    Settings2, Building2, Clock, UserSquare2,
    CreditCard, Save, Plus, Trash2, Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Mock Data
const branches = [
    { id: 1, name: "Dubai", address: "Al Quoz Industrial Area 4, Dubai", phone: "+971 4 123 4567", email: "dubai@nsmswim.com", active: true },
    { id: 2, name: "Sharjah", address: "Al Majaz 3, Sharjah", phone: "+971 6 123 4567", email: "sharjah@nsmswim.com", active: true },
    { id: 3, name: "Abu Dhabi", address: "Khalifa City A, Abu Dhabi", phone: "+971 2 123 4567", email: "ad@nsmswim.com", active: true },
];

const timeSlots = [
    { id: 1, time: "4:00 PM - 4:45 PM", type: "Kids / Toddlers", active: true },
    { id: 2, time: "4:45 PM - 5:30 PM", type: "Kids", active: true },
    { id: 3, time: "5:30 PM - 6:15 PM", type: "Kids / Adults", active: true },
    { id: 4, time: "6:15 PM - 7:00 PM", type: "Adults", active: true },
];

const packages = [
    { id: 1, name: "Individual Class", classes: 1, price: 150, popular: false },
    { id: 2, name: "Basic Package", classes: 8, price: 1000, popular: false },
    { id: 3, name: "Silver Package", classes: 12, price: 1500, popular: true },
    { id: 4, name: "Gold Package", classes: 24, price: 2800, popular: false },
];

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            toast.success("Settings saved successfully");
            setIsSaving(false);
        }, 1000);
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
                            <Button variant="outline" size="sm" className="font-bold border-border/50 bg-white">
                                <Plus className="w-4 h-4 mr-2" /> Add Branch
                            </Button>
                        </div>

                        <div className="p-6 grid gap-6">
                            {branches.map((branch) => (
                                <div key={branch.id} className="p-4 rounded-xl border border-border/50 bg-muted/10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-foreground text-lg">{branch.name}</h4>
                                            {branch.id === 1 && <span className="text-[10px] font-black uppercase bg-primary text-white px-1.5 rounded">HQ</span>}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Label className="text-xs text-muted-foreground">Active Hub</Label>
                                            <Switch defaultChecked={branch.active} />
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Contact Number</Label>
                                                <Input defaultValue={branch.phone} className="h-8 text-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-muted-foreground uppercase">Email Address</Label>
                                                <Input defaultValue={branch.email} className="h-8 text-sm" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-bold text-muted-foreground uppercase">Physical Address</Label>
                                            <Input defaultValue={branch.address} className="h-8 text-sm" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-error/10 hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></Button>
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
                                <div className="space-y-2">
                                    <Label>New Time Slot Range</Label>
                                    <Input placeholder="e.g. 7:00 PM - 7:45 PM" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Designated For</Label>
                                    <Input placeholder="e.g. Adults Only" />
                                </div>
                                <Button className="w-full font-bold shadow-sm" variant="secondary">
                                    <Plus className="w-4 h-4 mr-2" /> Add Slot to Grid
                                </Button>
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
                                    {timeSlots.map((slot) => (
                                        <TableRow key={slot.id} className="border-border/50 hover:bg-transparent">
                                            <TableCell className="font-black text-foreground">{slot.time}</TableCell>
                                            <TableCell className="font-medium text-muted-foreground">{slot.type}</TableCell>
                                            <TableCell className="text-center">
                                                <Switch defaultChecked={slot.active} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-error/10 hover:text-error"><Trash2 className="w-4 h-4" /></Button>
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
                                    <Input placeholder="e.g. Platinum Plus" className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Classes</Label>
                                    <Input type="number" placeholder="48" className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (AED)</Label>
                                    <Input type="number" placeholder="5000" className="bg-white" />
                                </div>
                                <Button className="w-full font-bold shadow-sm">
                                    {isEditMode ? "Save Changes" : "Create Package"}
                                </Button>
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
                                    {packages.map((pkg) => (
                                        <TableRow key={pkg.id} className="border-border/50 hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground">{pkg.name}</span>
                                                    {pkg.popular && <span className="bg-success/10 text-success text-[10px] uppercase font-black px-1.5 rounded">Most Popular</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-medium">{pkg.classes}</TableCell>
                                            <TableCell className="text-right font-black text-foreground">AED {pkg.price}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></Button>
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
        </div>
    );
}
