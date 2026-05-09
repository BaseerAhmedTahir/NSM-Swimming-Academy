"use client";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, ChevronDown, ChevronUp, CheckCircle2, UserMinus } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import AddStudentModal from "./AddStudentModal";

export default function StudentDetailModal({
    isOpen,
    onClose,
    student,
    onEditSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onEditSuccess?: () => void;
}) {
    const [membershipHistory, setMembershipHistory] = useState<any[]>([]);
    const [expandedHistoryIdx, setExpandedHistoryIdx] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && student?.id) {
            api.get(`/students/${student.id}/membership-history`)
               .then(res => setMembershipHistory(res.data.data))
               .catch(err => {
                   console.error("Failed to fetch membership history", err);
                   setMembershipHistory([]);
               });
        } else {
            setMembershipHistory([]);
            setExpandedHistoryIdx(null);
        }
    }, [isOpen, student]);

    if (!student) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px] max-h-[88vh] overflow-y-auto p-0 border-border/50 rounded-3xl select-none">
                    <DialogTitle className="sr-only">Student Details</DialogTitle>
                    <div className="bg-primary/10 p-6 flex flex-col items-center text-center border-b border-border/50 relative">
                        <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg mb-3">
                            <span className="text-2xl font-black text-primaryDark">{student.name?.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DialogTitle className="text-2xl font-black text-[#0B213F]">{student.name}</DialogTitle>
                            <span className={cn(
                                "px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider",
                                student.status === 'ACTIVE' ? "bg-success/10 text-success" : "bg-error/10 text-error"
                            )}>
                                {student.status}
                            </span>
                        </div>
                        <DialogDescription className="font-bold text-[#1C5CAA] mt-1">{student.studentId || student.id} • {student.level} • {typeof student.branch === 'object' ? student.branch?.name : student.branch}</DialogDescription>
                        <Button variant="outline" size="sm" className="absolute top-14 right-4 rounded-xl font-bold bg-white" onClick={() => { setIsEditModalOpen(true); }}>Edit</Button>
                    </div>
                    <div className="p-6 grid gap-4 bg-[#f8fafc]">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Membership Info */}
                            <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Membership</p>
                                <p className="font-bold text-[#0B213F]">{student.membership}</p>
                                <p className="text-[10px] font-bold text-[#1C5CAA] mt-1">
                                    {student.attendance?.startDate} to {student.attendance?.expiryDate}
                                </p>
                            </div>

                            {/* Fee Status */}
                            <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</p>
                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider", student.fee?.status === 'Paid' || student.fee?.status?.toUpperCase() === 'PAID' ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                                        {student.fee?.status}
                                    </span>
                                    <span className="font-black text-[#0B213F] text-sm">AED {student.fee?.amount}</span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 bg-white p-4 rounded-2xl border border-border/40 shadow-sm col-span-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</p>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-[#0B213F]">{student.phone}</p>
                                    <p className="text-xs font-medium text-slate-500 truncate">{student.email || "student@example.com"}</p>
                                </div>
                            </div>

                            {/* Attendance Progress */}
                            <div className="space-y-1 bg-white p-4 rounded-2xl border border-border/40 shadow-sm col-span-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                                <p className="text-sm font-black text-[#0B213F] mt-1">
                                    <span className="text-success">{student.attendance?.attended || 0} Done</span>
                                    <span className="text-slate-400 mx-1">/</span>
                                    <span>{student.attendance?.totalClasses || 0} Total</span>
                                </p>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-success transition-all duration-500"
                                        style={{ width: `${((student.attendance?.attended || 0) / Math.max(student.attendance?.totalClasses || 1, 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Package History Section */}
                        <div className="mt-4 border-t border-border/50 pt-4">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-primary" />
                                Package History
                            </h4>
                            <div className="space-y-3">
                                {membershipHistory.length > 0 ? (
                                    membershipHistory.map((pkg, idx) => (
                                        <div key={idx} className="bg-white rounded-xl border border-border/40 shadow-sm overflow-hidden">
                                            <button
                                                type="button"
                                                className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                                                onClick={() => setExpandedHistoryIdx(expandedHistoryIdx === idx ? null : idx)}
                                            >
                                                <div className="text-left">
                                                    <p className="font-bold text-[#0B213F] text-sm">{pkg.packageType} Package</p>
                                                    <p className="text-[10px] font-bold text-slate-500">
                                                        {new Date(pkg.startDate).toLocaleDateString()} → {new Date(pkg.expiryDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-[#1C5CAA]">
                                                            {pkg.classesUsed} / {pkg.totalClasses + (pkg.freeClasses || 0)} Classes
                                                        </p>
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                                                            pkg.status === 'ACTIVE' ? "bg-success/10 text-success" : "bg-slate-100 text-slate-500"
                                                        )}>{pkg.status}</span>
                                                    </div>
                                                    {expandedHistoryIdx === idx ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                                </div>
                                            </button>
                                            {expandedHistoryIdx === idx && (
                                                <div className="px-3 pb-3 space-y-2 border-t border-slate-100">
                                                    {/* Classes Breakdown */}
                                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Package</p>
                                                            <p className="text-sm font-black text-[#0B213F]">{pkg.totalClasses}</p>
                                                        </div>
                                                        <div className="bg-emerald-50 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Free</p>
                                                            <p className="text-sm font-black text-emerald-600">{pkg.freeClasses || 0}</p>
                                                        </div>
                                                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase">Used</p>
                                                            <p className="text-sm font-black text-purple-600">{pkg.classesUsed}</p>
                                                        </div>
                                                    </div>
                                                    {/* Attendance */}
                                                    <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                                            <span className="text-xs font-bold text-slate-600">Attended: {pkg.attendedClasses ?? 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <UserMinus className="w-3.5 h-3.5 text-error" />
                                                            <span className="text-xs font-bold text-slate-600">Absent: {pkg.absentClasses ?? 0}</span>
                                                        </div>
                                                    </div>
                                                    {/* Coach Info */}
                                                    {pkg.coaches && pkg.coaches.length > 0 && (
                                                        <div className="bg-slate-50 rounded-lg p-2">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Coach(es)</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {pkg.coaches.map((c: any, ci: number) => (
                                                                    <span key={ci} className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{c.name}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Payment Details */}
                                                    {pkg.totalAmount != null && (
                                                        <div className="bg-slate-50 rounded-lg p-2 space-y-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payment Details</p>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Total</span>
                                                                    <span className="text-[10px] font-bold text-[#0B213F]">AED {pkg.totalAmount}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Paid</span>
                                                                    <span className="text-[10px] font-bold text-success">AED {pkg.paidAmount ?? 0}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Discount</span>
                                                                    <span className="text-[10px] font-bold text-orange-500">AED {pkg.discount ?? 0}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Pending</span>
                                                                    <span className="text-[10px] font-bold text-warning">AED {pkg.pendingAmount ?? 0}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Mode</span>
                                                                    <span className="text-[10px] font-bold text-slate-700">{pkg.paymentMode || '-'}</span>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <span className="text-[10px] text-slate-500">Status</span>
                                                                    <span className={cn(
                                                                        "text-[10px] font-black uppercase",
                                                                        pkg.paymentStatus === 'PAID' ? 'text-success' : (pkg.paymentStatus === 'PARTIAL' ? 'text-blue-500' : 'text-warning')
                                                                    )}>{pkg.paymentStatus || '-'}</span>
                                                                </div>
                                                            </div>
                                                            {pkg.invoiceNumber && (
                                                                <p className="text-[9px] font-bold text-slate-400 mt-1">Invoice: {pkg.invoiceNumber}</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic text-center py-2">No membership history found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AddStudentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    if (onEditSuccess) onEditSuccess();
                    onClose();
                }}
                initialData={student.raw || student}
                isEditMode={true}
            />
        </>
    );
}
