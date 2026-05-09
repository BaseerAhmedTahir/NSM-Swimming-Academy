"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, UserMinus, MessageSquare, Plus, Info, Check, X, Waves, Activity, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import StudentDetailModal from "@/components/students/StudentDetailModal";

export default function SchedulePage() {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [dateStr, setDateStr] = useState(format(new Date(), "yyyy-MM-dd"));

    const [dynamicTimeSlots, setDynamicTimeSlots] = useState<string[]>(["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"]);

    const fetchSettings = async (branchId: string) => {
        try {
            const res = await api.get('/settings');
            if (res.data.success) {
                let slotsSetting = res.data.data.find((s:any) => s.key === `TIME_SLOTS_${branchId}`);
                if (!slotsSetting) slotsSetting = res.data.data.find((s:any) => s.key === 'TIME_SLOTS');
                
                if (slotsSetting) {
                    const parsed = JSON.parse(slotsSetting.value);
                    const activeTimes = parsed.filter((s:any) => s.active).map((s:any) => s.time);
                    if (activeTimes.length > 0) {
                        setDynamicTimeSlots(activeTimes);
                    }
                }
            }
        } catch(e) { console.error("Failed to fetch slots settings", e); }
    };

    const [selectedBranch, setSelectedBranch] = useState("");
    const [branches, setBranches] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);

    useEffect(() => {
        api.get('/branches').then(res => {
            const data = res.data.data.results || res.data.data;
            if (data && data.length > 0) {
                setBranches(data);
                setSelectedBranch(user?.role === 'STAFF' && user?.branchId ? user.branchId : data[0].id);
            }
        }).catch(console.error);

        api.get('/students?limit=1000').then(res => {
            setAllStudents(res.data.data.results || res.data.data || []);
        }).catch(console.error);
    }, []);

    // UI State 
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [selectedSlotData, setSelectedSlotData] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [freezeComment, setFreezeComment] = useState("");
    const [studentToAdd, setStudentToAdd] = useState("");
    const [coachesList, setCoachesList] = useState<any[]>([]);
    const [membershipHistory, setMembershipHistory] = useState<any[]>([]);
    const [studentStatusMap, setStudentStatusMap] = useState<Record<string, string>>({}); // id -> status

    const [scheduleMap, setScheduleMap] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSchedule = async (date: string) => {
        if (!selectedBranch) return;
        setIsLoading(true);
        try {
            const res = await api.get('/schedules/grid', { params: { date, branchId: selectedBranch }});
            if (res.data?.data) {
                const { coaches, schedules } = res.data.data;
                setCoachesList(coaches);
                const newMap: any = {};
                coaches.forEach((c: any) => newMap[c.name] = {});
                schedules.forEach((sch: any) => {
                    const coachName = coaches.find((c: any) => c.id === sch.coachId)?.name;
                    if (!coachName) return;
                    sch.slots.forEach((slot: any) => {
                        if (!newMap[coachName][slot.timeSlot]) {
                            newMap[coachName][slot.timeSlot] = [];
                        }
                        if (slot.student) {
                           newMap[coachName][slot.timeSlot].push({
                               studentId: slot.student.id,
                               slotId: slot.id,
                               name: slot.student.name,
                               level: slot.student.level,
                               attendanceId: slot.attendanceRecord?.id,
                               status: slot.attendanceRecord ? slot.attendanceRecord.status : 'Pending'
                           });
                        }
                    });
                });
                setScheduleMap(newMap);
            }
        } catch (err) {
            console.error(err);
            setScheduleMap({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedBranch) {
            fetchSchedule(dateStr);
        }
    }, [dateStr, selectedBranch]);

    useEffect(() => {
        if (selectedBranch) {
            fetchSettings(selectedBranch);
        }
    }, [selectedBranch]);

    const currentSchedule = scheduleMap;
    const timeSlots = dynamicTimeSlots;

    // Handle Date Navigation
    const handlePrevDay = () => {
        const newDate = subDays(selectedDate, 1);
        setSelectedDate(newDate);
        setDateStr(format(newDate, "yyyy-MM-dd"));
    };
    const handleNextDay = () => {
        const newDate = addDays(selectedDate, 1);
        setSelectedDate(newDate);
        setDateStr(format(newDate, "yyyy-MM-dd"));
    };
    const handleSelectDate = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            setDateStr(format(date, "yyyy-MM-dd"));
        }
    };

    // Cell Interaction Handlers
    const handleMarkAttendance = async (studentData: any, statusStr: string) => {
        const uppercaseStatus = statusStr.toUpperCase();
        try {
            if (studentData.attendanceId) {
                await api.put(`/attendance/${studentData.attendanceId}?branchId=${selectedBranch}`, {
                    status: uppercaseStatus,
                    comment: "Updated from grid"
                });
            } else {
                await api.post(`/attendance?branchId=${selectedBranch}`, {
                    scheduleSlotId: studentData.slotId,
                    studentId: studentData.studentId,
                    date: dateStr,
                    status: uppercaseStatus,
                    comment: "Marked from grid"
                });
            }
            toast.success(`Marked as ${statusStr}`);
            fetchSchedule(dateStr);
        } catch (err: any) {
            console.error("Failed to mark attendance", err);
            toast.error(err.response?.data?.message || "Failed to mark attendance.");
        }
    };

    const handleOpenStudentDetails = async (studentData: any) => {
        try {
            const res = await api.get(`/students/${studentData.studentId}`);
            if (res.data.success) {
                const s = res.data.data;
                const latestPayment = s.payments?.[0];
                const mapped = {
                    id: s.id,
                    studentId: s.studentId,
                    name: s.name,
                    displayName: s.name,
                    phone: s.phone,
                    email: s.email,
                    level: s.level,
                    branch: s.branch?.name,
                    membership: s.packageType,
                    attendance: {
                        startDate: s.membershipStartDate ? new Date(s.membershipStartDate).toLocaleDateString() : "N/A",
                        expiryDate: s.membershipExpiryDate ? new Date(s.membershipExpiryDate).toLocaleDateString() : "N/A",
                        attended: 0,
                        totalClasses: 8
                    },
                    fee: {
                        status: latestPayment?.status === 'PAID' ? 'Paid' : 'Pending',
                        amount: latestPayment?.totalAmount || 0
                    },
                    raw: s
                };

                // Fetch real attendance count
                const attRes = await api.get(`/students/${s.id}/attendance`);
                if (attRes.data.success) {
                    mapped.attendance.attended = attRes.data.data.filter((r: any) => r.status === 'ATTENDED').length;
                }

                // Try to grab the latest total classes from membership packages if we can
                try {
                    const histRes = await api.get(`/students/${s.id}/membership-history`);
                    if (histRes.data.success) {
                        const activeHist = histRes.data.data.find((h: any) => h.status === 'ACTIVE');
                        if (activeHist) {
                            mapped.attendance.totalClasses = activeHist.totalClasses;
                        }
                    }
                } catch (err) {
                    console.error("Could not fetch membership history for total classes", err);
                }

                setSelectedStudent(mapped);
                setIsDetailModalOpen(true);
            }
        } catch (err) {
            console.error("Failed to fetch student details", err);
            toast.error("Could not load student profile");
        }
    };

    const handleOpenNotify = (studentData: any) => {
        setSelectedStudent({ displayName: studentData.name, id: studentData.studentId });
        setIsNotifyModalOpen(true);
    };

    const handleSaveSchedule = () => {
        toast.success("Schedule details saved successfully");
    };

    // Determine relative day context
    const today = new Date();
    const isPast = selectedDate < subDays(today, 1);
    const isFuture = selectedDate > today;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">

                {/* Date Selector */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handlePrevDay} className="h-10 w-10 border-border/50 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white hover:text-slate-900">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("h-10 min-w-[240px] justify-start text-left font-bold border-border/50 text-slate-900 dark:text-white bg-white/50 dark:bg-slate-800/50 hover:bg-white", !selectedDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                {selectedDate ? format(selectedDate, "EEEE, dd MMM yyyy") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-xl bg-card border-border shadow-xl" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleSelectDate}
                                initialFocus
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="icon" onClick={handleNextDay} className="h-10 w-10 border-border/50 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-white hover:text-slate-900">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Global Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {user?.role === 'SUPER_ADMIN' && (
                        <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                            <SelectTrigger className="w-full sm:w-[180px] h-10 border-border/50 bg-white/50 dark:bg-slate-800/50 font-semibold text-slate-900 dark:text-white hover:bg-white focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map(b => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Button variant="default" onClick={handleSaveSchedule} className="h-10 font-bold bg-secondary hover:bg-secondary/90 shadow-sm shadow-secondary/20">
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Grid Status Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-success" /><span className="text-xs font-semibold text-muted-foreground">Attended</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-error" /><span className="text-xs font-semibold text-muted-foreground">Absent</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-xs font-semibold text-muted-foreground">Informed</span></div>
                </div>
                <div className="flex items-center gap-2">
                    {isPast ? (
                        <span className="bg-muted text-muted-foreground px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Read Only History</span>
                    ) : isFuture ? (
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Future Booking</span>
                    ) : (
                        <span className="bg-success/10 text-success px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Live Editing</span>
                    )}
                </div>
            </div>

            {/* Main Schedule Grid Container */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col h-[calc(100vh-160px)]">
                <div className="flex-1 overflow-auto custom-scrollbar rounded-2xl relative bg-card">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <p className="font-bold text-muted-foreground">Loading schedule...</p>
                        </div>
                    ) : currentSchedule ? (
                        <div className="min-w-[1000px] w-full border-collapse pb-6">

                            {/* Header Row - Coaches */}
                            <div className="flex border-b border-border/50 bg-card sticky top-0 z-30 w-max min-w-full shadow-sm">
                                <div className="w-24 shrink-0 flex items-center justify-center border-r border-border/50 py-4 px-2 font-black text-foreground bg-card sticky left-0 top-0 z-40">
                                    Time
                                </div>
                                    {Object.keys(currentSchedule).map(coach => {
                                        const coachSlots = Object.values(currentSchedule[coach]).flat() as any[];
                                        const bookedCount = coachSlots.filter(Boolean).length;
                                        const attendedCount = coachSlots.filter(s => s?.status === 'Attended' || s?.status === 'ATTENDED').length;
                                        const coachObj = coachesList.find(c => c.name === coach);
                                        const isFemale = coachObj?.gender === 'FEMALE';
                                        
                                        return (
                                            <div key={coach} className={cn(
                                                "flex-1 min-w-[200px] py-4 px-4 font-bold text-center border-r border-border/50 last:border-0 relative transition-colors cursor-pointer group",
                                                isFemale ? "hover:bg-pink-50/50" : "hover:bg-muted/30"
                                            )}>
                                                <h3 className={cn("font-black", isFemale ? "text-pink-600" : "text-primaryDark")}>{coach}</h3>
                                                <p className="text-xs text-muted-foreground font-medium mt-1">{isPast ? `${attendedCount} Students Attended` : `${bookedCount} Students Booked`}</p>
                                                <div className={cn(
                                                    "absolute inset-x-0 bottom-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform origin-left",
                                                    isFemale ? "bg-pink-500" : "bg-primary/20"
                                                )} />
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* Data Rows - Times */}
                            <div className="flex flex-col w-max min-w-full">
                                {timeSlots.map(time => (
                                    <div key={time} className="flex border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors group">

                                        {/* Time Column Fixed Left */}
                                        <div className="w-24 shrink-0 flex items-center justify-center border-r border-border/50 py-4 px-2 font-bold text-xs text-muted-foreground bg-card group-hover:text-primary transition-colors sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            {time}
                                        </div>

                                        {/* Coach Cells */}
                                        {Object.keys(currentSchedule).map(coach => {
                                            const studentsInSlot = (currentSchedule[coach as keyof typeof currentSchedule][time] || []).filter(Boolean);

                                            return (
                                                <div key={`${time}-${coach}`} className="flex-1 min-w-[200px] py-2 px-2 border-r border-border/50 last:border-0 flex flex-col gap-1.5 h-full">

                                                    {/* Student Pills */}
                                                    {studentsInSlot.map((studentData: any, idx: number) => {
                                                        const cellId = studentData.slotId || `${dateStr}-${time}-${coach}-${idx}`;
                                                        
                                                        let displayStatus = 'Pending';
                                                        if (studentData.status === 'ATTENDED') displayStatus = 'Attended';
                                                        else if (studentData.status === 'ABSENT') displayStatus = 'Absent';
                                                        else if (studentData.status === 'INFORMED') displayStatus = 'Informed';

                                                        const status = displayStatus;

                                                        return (
                                                            <Popover key={cellId}>
                                                                <PopoverTrigger asChild>
                                                                    <button
                                                                            className={cn(
                                                                            "w-full text-left px-3 py-2 rounded-lg text-sm border font-medium transition-all group/cell flex items-center justify-between",
                                                                            status === 'Attended' && "bg-[#FFF176] border-[#FBC02D] text-[#F57F17] shadow-sm",
                                                                            status === 'Absent' && "bg-red-500 border-red-600 text-white shadow-sm",
                                                                            status === 'Informed' && "bg-blue-500 border-blue-600 text-white shadow-sm",
                                                                            status === 'Pending' && studentData.gender === 'FEMALE' && "bg-pink-50 border-pink-200 hover:border-pink-400 text-pink-700 hover:bg-pink-100/50 shadow-[0_2px_10px_-3px_rgba(236,72,153,0.2)]",
                                                                            status === 'Pending' && studentData.gender !== 'FEMALE' && "bg-background border-border hover:border-primary/50 text-foreground hover:bg-muted/30"
                                                                        )}
                                                                        disabled={isPast && status === 'Pending'}
                                                                    >
                                                                        <div className="truncate pr-2">{studentData.name || "Student"}</div>
                                                                        <div className="text-[10px] font-black opacity-60 bg-black/5 px-1.5 py-0.5 rounded shrink-0">
                                                                            {studentData.level || "LVL"}
                                                                        </div>
                                                                    </button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-56 p-2 rounded-xl shadow-xl flex flex-col gap-1" align="start">
                                                                    {/* Attendance Actions */}
                                                                    <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider">Attendance</div>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-success/10 hover:text-success" onClick={() => handleMarkAttendance(studentData, 'Attended')}>
                                                                        <Check className="mr-2 h-4 w-4" /> Mark Attended
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-error/10 hover:text-error" onClick={() => handleMarkAttendance(studentData, 'Absent')}>
                                                                        <X className="mr-2 h-4 w-4" /> Mark Absent
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-primary/10 hover:text-primaryDark" onClick={() => handleMarkAttendance(studentData, 'Informed')}>
                                                                        <Info className="mr-2 h-4 w-4" /> Informed Absence
                                                                    </Button>

                                                                    <div className="h-px bg-border my-1" />
                                                                    {/* Other Actions */}
                                                                    <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider mt-1">Manage</div>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold text-foreground" onClick={() => handleOpenStudentDetails(studentData)}>
                                                                        <UserMinus className="mr-2 h-4 w-4" /> View Profile
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        className="justify-start h-8 font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50" 
                                                                        onClick={() => {
                                                                            setSelectedStudent(studentData);
                                                                            setIsFreezeModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <Waves className="mr-2 h-4 w-4" /> Freeze Student
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold text-foreground" onClick={() => handleOpenNotify(studentData)}>
                                                                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        className="justify-start h-8 font-semibold text-error hover:text-error hover:bg-error/10 mt-1"
                                                                        onClick={() => {
                                                                            const coachObj = coachesList.find(c => c.name === coach);
                                                                            setSelectedSlotData({
                                                                                coachId: coachObj?.id,
                                                                                coachName: coach,
                                                                                timeSlot: time,
                                                                                slotPosition: studentsInSlot.indexOf(studentData) + 1,
                                                                                studentName: studentData.name,
                                                                                studentId: studentData.studentId
                                                                            });
                                                                            setIsRemoveModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <X className="mr-2 h-4 w-4" /> Remove Slot
                                                                    </Button>
                                                                </PopoverContent>
                                                            </Popover>
                                                        );
                                                    })}

                                                    {/* Empty Slot Adder */}
                                                    {studentsInSlot.length < 6 && !isPast && (
                                                        <button
                                                            className="w-full h-9 flex items-center justify-center border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors mt-1"
                                                            onClick={() => {
                                                                const coachObj = coachesList.find(c => c.name === coach);
                                                                setSelectedSlotData({ 
                                                                    coachId: coachObj?.id, 
                                                                    time,
                                                                    slotPosition: studentsInSlot.length + 1
                                                                });
                                                                setIsAddModalOpen(true);
                                                            }}
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                                <CalendarIcon className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">No Schedule Data</h3>
                            <p className="text-muted-foreground max-w-md">There is no class data recorded for this specific date and branch combination yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}

            {/* 4.5.8 Student Detail Modal */}
            <StudentDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                student={selectedStudent}
                onEditSuccess={() => fetchSchedule(dateStr)}
            />

{/* 
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 rounded-3xl">
                    <DialogTitle className="sr-only">Student Details</DialogTitle>
                    {selectedStudent && (
                        <>
                            <div className="bg-primary/10 p-6 flex flex-col items-center text-center border-b border-border/50 relative">
                                <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-lg mb-3">
                                    <span className="text-2xl font-black text-primaryDark">{(selectedStudent.displayName || selectedStudent.name)?.substring(0, 2).toUpperCase()}</span>
                                </div>
                                <DialogTitle className="text-2xl font-black text-[#0B213F]">{selectedStudent.name}</DialogTitle>
                                <DialogDescription className="font-bold text-[#1C5CAA] mt-1">{selectedStudent.id} • {selectedStudent.level} • {selectedStudent.branch}</DialogDescription>
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

                                {/* Package History Section */}
                                <div className="mt-4 border-t border-border/50 pt-4">
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-primary" />
                                        Package History
                                    </h4>
                                    <div className="space-y-3">
                                        {membershipHistory.length > 0 ? (
                                            membershipHistory.map((pkg, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-xl border border-border/40 shadow-sm flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold text-[#0B213F] text-sm">{pkg.packageType} Package</p>
                                                        <p className="text-[10px] font-bold text-slate-500">
                                                            Started: {new Date(pkg.startDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-black text-[#1C5CAA]">{pkg.classesUsed} / {pkg.totalClasses} Classes</p>
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase px-1.5 py-0.5 rounded",
                                                            pkg.status === 'ACTIVE' ? "bg-success/10 text-success" : "bg-slate-100 text-slate-500"
                                                        )}>{pkg.status}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic text-center py-2">No history of expired packages found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
*/}

            {/* 4.5.7 Notification Modal */}
            <Dialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="bg-[#1C5CAA] p-8 flex flex-col items-center text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <MessageSquare className="w-24 h-24" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Send Message</DialogTitle>
                        <DialogDescription className="text-blue-100 font-bold mt-1">
                            Notify {selectedStudent?.displayName} via the NSM Portal
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Template</Label>
                            <Select defaultValue="absence">
                                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-all font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/50 shadow-xl">
                                    <SelectItem value="absence" className="rounded-xl my-1 mx-1">Absence Follow Up</SelectItem>
                                    <SelectItem value="fee" className="rounded-xl my-1 mx-1">Fee Reminder</SelectItem>
                                    <SelectItem value="custom" className="rounded-xl my-1 mx-1">Custom Message</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message Content</Label>
                            <Textarea
                                className="min-h-[120px] resize-none rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-all font-medium"
                                defaultValue="Hi dear, how are you? We noticed you missed your swimming class today. Please let us know if you'd like to schedule a makeup session."
                            />
                        </div>
                    </div>

                    <div className="px-8 pb-8 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50" 
                            onClick={() => setIsNotifyModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => { toast.success("Notification sent successfully"); setIsNotifyModalOpen(false); }} 
                            className="h-12 rounded-2xl font-black bg-[#1C5CAA] hover:bg-blue-800 shadow-lg shadow-blue-200"
                        >
                            Send Now
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 4.5.4 Add Student to Slot Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="bg-primary p-8 flex flex-col items-center text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Plus className="w-24 h-24" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Add Student</DialogTitle>
                        <DialogDescription className="text-blue-100 font-bold mt-1">
                            Assign a student to the {selectedSlotData?.time} slot
                        </DialogDescription>
                    </div>

                    <div className="p-8">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Select Student</Label>
                            <Select value={studentToAdd} onValueChange={setStudentToAdd}>
                                <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-all font-bold">
                                    <SelectValue placeholder="Search student name..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-2xl border-border/50 shadow-xl">
                                    {allStudents
                                        .filter(s => s.status === 'ACTIVE')
                                        .filter(s => {
                                            const isScheduledAtThisTime = Object.values(scheduleMap || {}).some((coachSlots: any) => {
                                                const studentsInTime = coachSlots[selectedSlotData?.time] || [];
                                                return studentsInTime.some((st: any) => st.studentId === s.id);
                                            });
                                            return !isScheduledAtThisTime;
                                        })
                                        .map(student => (
                                            <SelectItem key={student.id} value={student.id} className="rounded-xl my-1 mx-1 focus:bg-primary/10">
                                                {student.name} ({student.studentId})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="px-8 pb-8 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50" 
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={!studentToAdd || isProcessing}
                            onClick={async () => { 
                                setIsProcessing(true);
                                try {
                                    await api.post(`/schedules/assign?branchId=${selectedBranch}`, {
                                        date: dateStr,
                                        coachId: selectedSlotData.coachId,
                                        timeSlot: selectedSlotData.time,
                                        slotPosition: selectedSlotData.slotPosition,
                                        studentId: studentToAdd
                                    });
                                    toast.success("Student added to slot"); 
                                    setIsAddModalOpen(false); 
                                    setStudentToAdd("");
                                    fetchSchedule(dateStr);
                                } catch (err: any) {
                                    toast.error(err.response?.data?.message || "Failed to assign student.");
                                } finally {
                                    setIsProcessing(false);
                                }
                            }} 
                            className="h-12 rounded-2xl font-black bg-primary hover:bg-blue-800 shadow-lg shadow-blue-200"
                        >
                            {isProcessing ? "Adding..." : "Add to Slot"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Freeze Student Modal */}
            <Dialog open={isFreezeModalOpen} onOpenChange={setIsFreezeModalOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="bg-blue-600 p-8 flex flex-col items-center text-center text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Waves className="w-24 h-24" />
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30 shadow-lg">
                            <Waves className="w-8 h-8 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Freeze Membership</DialogTitle>
                        <DialogDescription className="text-blue-100 font-bold mt-1">
                            Temporarily pause {selectedStudent?.displayName || selectedStudent?.name}'s account
                        </DialogDescription>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="resume-date" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Expected Resume Date</Label>
                            <Input 
                                id="resume-date" 
                                type="date" 
                                className="h-12 rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-all font-bold" 
                                defaultValue={new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="comment" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Reason / Comment</Label>
                            <Textarea
                                id="comment"
                                placeholder="e.g., Medical leave, traveling..."
                                className="min-h-[100px] resize-none rounded-2xl border-border/50 bg-muted/30 focus:bg-background transition-all font-medium"
                                value={freezeComment}
                                onChange={(e) => setFreezeComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="px-8 pb-8 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50" 
                            onClick={() => setIsFreezeModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={isProcessing}
                            onClick={async () => { 
                                setIsProcessing(true);
                                try {
                                    const resumeDate = (document.getElementById('resume-date') as HTMLInputElement).value;
                                    await api.post(`/freezings?branchId=${selectedBranch}`, {
                                        studentId: selectedStudent.studentId,
                                        freezeStartDate: new Date().toISOString().split('T')[0],
                                        freezeEndDate: resumeDate, 
                                        comment: freezeComment || "No reason provided",
                                        duration: 1
                                    });
                                    toast.success("Membership frozen successfully."); 
                                    setIsFreezeModalOpen(false); 
                                    setFreezeComment("");
                                    fetchSchedule(dateStr);
                                } catch (err: any) {
                                    console.error("Freeze error details:", err.response?.data || err.message || err);
                                    const errorData = err.response?.data;
                                    const errorMessage = errorData?.message || errorData?.error?.code || err.message || "Failed to freeze membership.";
                                    toast.error(errorMessage);
                                } finally {
                                    setIsProcessing(false);
                                }
                            }} 
                            className="h-12 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                            {isProcessing ? "Pausing..." : "Confirm Freeze"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Remove Slot Confirmation Modal */}
            <Dialog open={isRemoveModalOpen} onOpenChange={setIsRemoveModalOpen}>
                <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl bg-card rounded-[2rem]">
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <X className="w-10 h-10 text-error" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-foreground mb-2">Remove Student?</DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium text-balance">
                            Are you sure you want to remove <strong className="text-foreground">{selectedSlotData?.studentName}</strong> from this session?
                        </DialogDescription>
                    </div>
                    
                    <div className="px-8 pb-2">
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-2">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Coach</span>
                                <span className="text-foreground">{selectedSlotData?.coachName}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                <span>Session Time</span>
                                <span className="text-primary">{selectedSlotData?.timeSlot}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-6 grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-2xl font-bold border-border/50 hover:bg-muted/50 transition-all" 
                            onClick={() => setIsRemoveModalOpen(false)}
                        >
                            Keep Slot
                        </Button>
                        <Button 
                            disabled={isProcessing}
                            variant="destructive" 
                            className="h-12 rounded-2xl font-black shadow-lg shadow-error/20 hover:scale-[1.02] active:scale-95 transition-all"
                            onClick={async () => {
                                setIsProcessing(true);
                                try {
                                    await api.post(`/schedules/remove?branchId=${selectedBranch}`, {
                                        date: dateStr,
                                        coachId: selectedSlotData.coachId,
                                        timeSlot: selectedSlotData.timeSlot,
                                        slotPosition: selectedSlotData.slotPosition
                                    });
                                    toast.success("Student removed from slot");
                                    setIsRemoveModalOpen(false);
                                    fetchSchedule(dateStr);
                                } catch (err: any) {
                                    toast.error(err.response?.data?.message || "Failed to remove student.");
                                } finally {
                                    setIsProcessing(false);
                                }
                            }}
                        >
                            {isProcessing ? "Removing..." : "Remove Now"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
