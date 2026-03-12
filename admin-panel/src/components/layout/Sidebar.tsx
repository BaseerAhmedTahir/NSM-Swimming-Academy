"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    CalendarDays,
    Users,
    UserSquare2,
    CreditCard,
    BellRing,
    BarChart3,
    Settings,
    Waves,
    UserMinus,
    History as HistoryIcon,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Schedule", href: "/schedule", icon: CalendarDays },
    { title: "Registration", href: "/students", icon: Users },
    { title: "Expired Packages", href: "/students/expired", icon: HistoryIcon },
    { title: "Frozen Students", href: "/students/frozen", icon: Waves }, // Added
    { title: "Cancelled Students", href: "/students/cancelled", icon: UserMinus }, // Added
    { title: "Coaches", href: "/coaches", icon: UserSquare2 },
    { title: "Payments", href: "/payments", icon: CreditCard },
    { title: "Notifications", href: "/notifications", icon: BellRing },
    { title: "Reports", href: "/reports", icon: BarChart3 },
    { title: "Reminders", href: "/reminders", icon: BellRing },
    { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(true); // Default to collapsed initially to be mobile friendly

    return (
        <>
            {/* Backdrop for mobile when expanded */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setCollapsed(true)}
                />
            )}

            <div
                className={cn(
                    "flex flex-col h-screen bg-card border-r border-border transition-all duration-300 z-30 shrink-0",
                    collapsed ? "w-16 md:w-20 relative" : "absolute inset-y-0 left-0 w-64 shadow-2xl md:relative md:w-64 md:shadow-none"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-20 flex items-center justify-center border-b border-border/50 relative px-4">
                    {collapsed ? (
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-sm">
                            <Waves className="w-6 h-6 text-white" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 w-full animate-in fade-in duration-300">
                            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <Waves className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-lg font-black tracking-tight text-foreground truncate">NSM Admin</span>
                                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider truncate">Swimming Academy</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-7 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-30"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-xl transition-all duration-200 group relative",
                                    collapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 py-3",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary/5 hover:text-secondary font-medium"
                                )}
                            >
                                <item.icon className={cn("shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5 mr-3", isActive && "text-primary")} />

                                {!collapsed && (
                                    <span className="truncate">{item.title}</span>
                                )}

                                {/* Active Indicator Line */}
                                {isActive && !collapsed && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                                )}
                                {isActive && collapsed && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                                )}

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded-md text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-md z-50">
                                        {item.title}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Bottom Branch Indicator */}
                <div className="p-4 border-t border-border/50 bg-muted/30">
                    {collapsed ? (
                        <div className="w-10 h-10 mx-auto bg-card border border-border rounded-lg flex items-center justify-center group relative">
                            <span className="text-xs font-bold text-primaryDark">DXB</span>
                            <div className="absolute left-12 bottom-0 bg-popover text-popover-foreground px-2 py-1 rounded-md text-sm font-semibold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-md z-50">
                                Dubai
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-start shadow-sm">
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Current Branch</span>
                            <div className="flex items-center w-full">
                                <div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse" />
                                <span className="text-sm font-bold text-foreground truncate">Dubai</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
