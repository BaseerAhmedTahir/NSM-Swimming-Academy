import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Users, Calendar, AlertCircle, TrendingUp, UserPlus, FileEdit, CheckCircle2 } from "lucide-react";

const stats = [
    {
        title: "Total Students",
        value: "154",
        description: "+12% from last month",
        icon: Users,
        trend: "up",
        color: "bg-primary/10 text-primary",
    },
    {
        title: "Active Memberships",
        value: "132",
        description: "85% retention rate",
        icon: TrendingUp,
        trend: "up",
        color: "bg-success/10 text-success",
    },
    {
        title: "Classes Today",
        value: "24",
        description: "Across 3 branches",
        icon: Calendar,
        trend: "neutral",
        color: "bg-accent/10 text-accent",
    },
    {
        title: "Pending Payments",
        value: "18",
        description: "Requires attention",
        icon: AlertCircle,
        trend: "down",
        color: "bg-warning/10 text-warning",
    },
];

const upcomingClasses = [
    { time: "4:00 PM", level: "Toddlers T1", coach: "Coach Ahmed", branch: "Dubai", students: 6 },
    { time: "4:30 PM", level: "Kids K2", coach: "Coach Sarah", branch: "Dubai", students: 5 },
    { time: "5:00 PM", level: "Adults A1", coach: "Coach Mike", branch: "Sharjah", students: 4 },
    { time: "5:30 PM", level: "Kids K4", coach: "Coach Ahmed", branch: "Dubai", students: 6 },
];

const recentActivity = [
    { action: "New student registered", detail: "Ziad Ahmed (K2) joined Dubai branch", time: "10 mins ago", icon: UserPlus, color: "text-primary" },
    { action: "Payment received", detail: "AED 1,200 from Sarah Mohammed", time: "1 hour ago", icon: CheckCircle2, color: "text-success" },
    { action: "Schedule updated", detail: "Coach Mike reassigned for 5 PM slot", time: "2 hours ago", icon: FileEdit, color: "text-accent" },
    { action: "Absence logged", detail: "Naira Kareem (T1) marked absent (Informed)", time: "3 hours ago", icon: AlertCircle, color: "text-warning" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening at the academy today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <p className="text-xs font-semibold text-muted-foreground mt-4">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Quick Schedule */}
                <Card className="lg:col-span-2 border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold">Today's Next Classes</CardTitle>
                        <CardDescription>Quick overview of upcoming sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/50">
                            {upcomingClasses.map((cls, j) => (
                                <div key={j} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg text-sm">
                                            {cls.time}
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{cls.level}</p>
                                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                                                <span>{cls.coach}</span>
                                                <span className="w-1 h-1 bg-border rounded-full mx-1" />
                                                <span>{cls.branch}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-foreground">{cls.students} <span className="text-muted-foreground font-medium">Students</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Log */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {recentActivity.map((activity, k) => (
                                <div key={k} className="flex gap-4">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 z-10 relative shadow-sm">
                                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                                        </div>
                                        {/* Timeline Line */}
                                        {k !== recentActivity.length - 1 && (
                                            <div className="absolute top-8 bottom-[-24px] left-1/2 -ml-px w-px bg-border/50" />
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 pb-1">
                                        <p className="text-sm font-bold text-foreground">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{activity.detail}</p>
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground/70 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
