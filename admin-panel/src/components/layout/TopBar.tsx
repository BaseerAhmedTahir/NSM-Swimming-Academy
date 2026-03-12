"use client";

import { Bell, Search, Settings, LogOut, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export function TopBar() {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Update every minute but avoid hydration mismatch by grabbing initial date in effect on load if we wanted strict ssr matching
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        router.push("/");
    };

    return (
        <div className="h-auto min-h-[5rem] py-3 md:py-0 md:h-20 bg-card border-b border-border/50 px-4 md:px-8 flex items-center justify-between shadow-sm sticky top-0 z-10 w-full animate-in slide-in-from-top-4 duration-300">

            {/* Left side info */}
            <div className="flex flex-col flex-1 min-w-0 mr-2 md:mr-4">
                <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight truncate">
                    Welcome back, <span className="text-primary tracking-normal">Admin</span> 👋
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mt-1">
                    <span className="bg-secondary/10 text-secondary px-1.5 md:px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold tracking-wider uppercase shrink-0">
                        Live
                    </span>
                    <span className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                        {format(currentDate, "EEE, MMM do yyyy")}
                    </span>
                </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative hidden md:flex items-center group">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search students, staff..."
                        className="w-64 pl-9 h-10 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-xl transition-all shadow-sm"
                    />
                </div>

                {/* Quick Action */}
                <Button variant="outline" className="h-10 px-4 rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5 hidden lg:flex font-semibold shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Add Student
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative h-10 w-10 shrink-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-card animate-pulse" />
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full shrink-0 border-2 border-primary/20 hover:border-primary transition-colors hover:bg-transparent">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatar-placeholder.png" alt="@admin" />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 rounded-xl border-border/50 shadow-xl" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none">Super Administrator</p>
                                <p className="text-xs leading-none text-muted-foreground">admin@nsm.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg transition-colors font-medium">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Academy Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50" />
                        <DropdownMenuItem onClick={handleLogout} className="text-error focus:text-error focus:bg-error/10 cursor-pointer rounded-lg transition-colors font-medium">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    );
}
