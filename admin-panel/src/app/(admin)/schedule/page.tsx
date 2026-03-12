"use client";

import { useState } from "react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, UserMinus, MessageSquare, Plus, Info, Check, X } from "lucide-react";
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

// Mock Data Source
import { scheduleData, students } from "@/lib/mockData";

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-02-23")); // Set to a date with known mock data
    const [selectedBranch, setSelectedBranch] = useState("Dubai");
    const [dateStr, setDateStr] = useState("2026-02-23");

    // UI State 
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [studentStatusMap, setStudentStatusMap] = useState<Record<string, string>>({}); // id -> status

    // Get data for selected date and branch
    const getBranchSchedule = () => {
        const formatted = format(selectedDate, "yyyy-MM-dd");
        const dayData = (scheduleData as Record<string, any>)[formatted];
        if (dayData && dayData[selectedBranch]) {
            return dayData[selectedBranch].coaches;
        }
        return null;
    };

    const currentSchedule = getBranchSchedule();
    const timeSlots = ["4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"];

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
    const handleMarkAttendance = (id: string, status: string) => {
        setStudentStatusMap(prev => ({ ...prev, [id]: status }));
        toast.success(`Marked as ${status}`);
    };

    const handleOpenStudentDetails = (studentStr: string) => {
        // Parse mock string "NameAgeLevel"
        // For prototype just finding a random student to show detail modal format
        const mockStudent = students.find(s => s.branch === selectedBranch) || students[0];
        setSelectedStudent({ ...mockStudent, displayName: studentStr });
        setIsDetailModalOpen(true);
    };

    const handleOpenNotify = (studentStr: string) => {
        setSelectedStudent({ displayName: studentStr });
        setIsNotifyModalOpen(true);
    };

    const handleSaveSchedule = () => {
        toast.success("Schedule details saved successfully");
    };

    // Determine relative day context
    const today = new Date("2026-02-23"); // Mock today to match data
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
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger className="w-full sm:w-[180px] h-10 border-border/50 bg-white/50 dark:bg-slate-800/50 font-semibold text-slate-900 dark:text-white hover:bg-white focus:ring-1 focus:ring-primary">
                            <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Dubai">Dubai</SelectItem>
                            <SelectItem value="Sharjah">Sharjah</SelectItem>
                            <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                        </SelectContent>
                    </Select>

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
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">

                    {currentSchedule ? (
                        <div className="min-w-[1000px] w-full border-collapse pb-6">

                            {/* Header Row - Coaches */}
                            <div className="flex border-b border-border/50 bg-muted/10 sticky top-0 z-10 w-max min-w-full">
                                <div className="w-24 shrink-0 flex items-center justify-center border-r border-border/50 py-4 px-2 font-black text-foreground bg-card sticky left-0 z-20">
                                    Time
                                </div>
                                {Object.keys(currentSchedule).map(coach => (
                                    <div key={coach} className="flex-1 min-w-[200px] py-4 px-4 font-bold text-center border-r border-border/50 last:border-0 relative hover:bg-muted/30 transition-colors cursor-pointer group">
                                        <h3 className="text-primaryDark">{coach}</h3>
                                        <p className="text-xs text-muted-foreground font-medium mt-1">6 Slots / {isPast ? '6 Attended' : '6 Booked'}</p>
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                    </div>
                                ))}
                            </div>

                            {/* Data Rows - Times */}
                            <div className="flex flex-col w-max min-w-full">
                                {timeSlots.map(time => (
                                    <div key={time} className="flex border-b border-border/50 last:border-0 hover:bg-muted/5 transition-colors group">

                                        {/* Time Column Fixed Left */}
                                        <div className="w-24 shrink-0 flex items-center justify-center border-r border-border/50 py-4 px-2 font-bold text-xs text-muted-foreground bg-card group-hover:text-primary transition-colors sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            {time}
                                        </div>

                                        {/* Coach Cells */}
                                        {Object.keys(currentSchedule).map(coach => {
                                            const studentsInSlot = (currentSchedule[coach as keyof typeof currentSchedule][time] || []).filter(Boolean);

                                            return (
                                                <div key={`${time}-${coach}`} className="flex-1 min-w-[200px] py-2 px-2 border-r border-border/50 last:border-0 flex flex-col gap-1.5 h-full">

                                                    {/* Student Pills */}
                                                    {studentsInSlot.map((studentStr: string, idx: number) => {
                                                        const cellId = `${dateStr}-${time}-${coach}-${idx}`;
                                                        const status = studentStatusMap[cellId] || 'Pending';

                                                        return (
                                                            <Popover key={cellId}>
                                                                <PopoverTrigger asChild>
                                                                    <button
                                                                        className={cn(
                                                                            "w-full text-left px-3 py-2 rounded-lg text-sm border font-medium transition-all group/cell flex items-center justify-between",
                                                                            status === 'Attended' && "bg-[#FFF176] border-[#FBC02D] text-[#F57F17] shadow-sm",
                                                                            status === 'Absent' && "bg-red-500 border-red-600 text-white shadow-sm",
                                                                            status === 'Informed' && "bg-blue-500 border-blue-600 text-white shadow-sm",
                                                                            status === 'Pending' && "bg-background border-border hover:border-primary/50 text-foreground hover:bg-muted/30"
                                                                        )}
                                                                        disabled={isPast && status === 'Pending'}
                                                                    >
                                                                        <div className="truncate pr-2">{studentStr.match(/[a-zA-Z]+/)?.[0] || studentStr}</div>
                                                                        <div className="text-[10px] font-black opacity-60 bg-black/5 px-1.5 py-0.5 rounded shrink-0">
                                                                            {studentStr.match(/[A-Z0-9]+$/)?.[0]}
                                                                        </div>
                                                                    </button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-56 p-2 rounded-xl shadow-xl flex flex-col gap-1" align="start">
                                                                    {/* Attendance Actions */}
                                                                    <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider">Attendance</div>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-success/10 hover:text-success" onClick={() => handleMarkAttendance(cellId, 'Attended')}>
                                                                        <Check className="mr-2 h-4 w-4" /> Mark Attended
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-error/10 hover:text-error" onClick={() => handleMarkAttendance(cellId, 'Absent')}>
                                                                        <X className="mr-2 h-4 w-4" /> Mark Absent
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold hover:bg-primary/10 hover:text-primaryDark" onClick={() => handleMarkAttendance(cellId, 'Informed')}>
                                                                        <Info className="mr-2 h-4 w-4" /> Informed Absence
                                                                    </Button>

                                                                    <div className="h-px bg-border my-1" />
                                                                    {/* Other Actions */}
                                                                    <div className="text-xs font-bold text-muted-foreground uppercase px-2 py-1 tracking-wider mt-1">Manage</div>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold text-foreground" onClick={() => handleOpenStudentDetails(studentStr)}>
                                                                        <UserMinus className="mr-2 h-4 w-4" /> View Profile
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold text-foreground" onClick={() => handleOpenNotify(studentStr)}>
                                                                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                                                                    </Button>
                                                                    <Button variant="ghost" className="justify-start h-8 font-semibold text-error hover:text-error hover:bg-error/10 mt-1">
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
                                                            onClick={() => setIsAddModalOpen(true)}
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
                            <p className="text-muted-foreground max-w-md">There is no class data generated for this specific date and branch combination in the mock dataset. Try February 23rd or 24th, 2026.</p>
                            <Button variant="outline" className="mt-6" onClick={() => { setSelectedDate(new Date("2026-02-23")); setDateStr("2026-02-23"); }}>
                                Load Sample Data
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}

            {/* 4.5.8 Student Detail Modal */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-border/50 rounded-3xl">
                    <DialogTitle className="sr-only">Student Details</DialogTitle>
                    {selectedStudent && (
                        <>
                            <div className="bg-primary/10 p-6 flex items-start justify-between border-b border-border/50">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-md">
                                        <span className="text-xl font-black text-primaryDark">{selectedStudent.displayName.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-black">{selectedStudent.name}</DialogTitle>
                                        <DialogDescription className="font-semibold text-primary">{selectedStudent.id} • {selectedStudent.level}</DialogDescription>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 grid gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Membership</p>
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-foreground">{selectedStudent.membership}</p>
                                            {selectedStudent.attendance && (
                                                <p className="text-[11px] font-semibold text-muted-foreground/80 mt-1 uppercase tracking-tighter">
                                                    {format(new Date(selectedStudent.attendance.startDate), "MMM d")} - {format(new Date(selectedStudent.attendance.expiryDate), "MMM d, yy")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Fee Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2 py-0.5 rounded text-xs font-bold", selectedStudent.fee.status === 'Paid' ? "bg-success/20 text-success" : "bg-warning/20 text-warning")}>
                                                {selectedStudent.fee.status}
                                            </span>
                                            <span className="font-bold">AED {selectedStudent.fee.amount}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact</p>
                                        <p className="text-sm font-semibold text-foreground">{selectedStudent.phone}</p>
                                    </div>
                                    <div className="space-y-1 bg-muted/30 p-3 rounded-xl border border-border/50">
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Attendance</p>
                                        <p className="text-sm font-bold text-foreground">
                                            <span className="text-success">{selectedStudent.attendance.attended} Done</span> / {selectedStudent.attendance.totalClasses} Total
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* 4.5.7 Notification Modal */}
            <Dialog open={isNotifyModalOpen} onOpenChange={setIsNotifyModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Send Message</DialogTitle>
                        <DialogDescription>
                            Send a notification to {selectedStudent?.displayName} via the NSM Portal.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Message Template</Label>
                            <Select defaultValue="absence">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="absence">Absence Follow Up</SelectItem>
                                    <SelectItem value="fee">Fee Reminder</SelectItem>
                                    <SelectItem value="custom">Custom Message</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Message Content</Label>
                            <Textarea
                                className="h-32 resize-none"
                                defaultValue="Hi dear, how are you? We noticed you missed your swimming class today. Please let us know if you'd like to schedule a makeup session."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNotifyModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Notification sent successfully"); setIsNotifyModalOpen(false); }} className="font-bold">
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 4.5.4 Add Student to Slot Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Student to Slot</DialogTitle>
                        <DialogDescription>
                            Select a student to fill this time slot.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Search Student (Mock)</Label>
                            <Select defaultValue="ziad">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ziad">Ziad Ahmed (***4567) - K2</SelectItem>
                                    <SelectItem value="sara">Sara Ali (***3575) - T1</SelectItem>
                                    <SelectItem value="omar">Omar Hassan (***5026) - A1</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Student added to slot"); setIsAddModalOpen(false); }} className="font-bold">
                            Add to Schedule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
