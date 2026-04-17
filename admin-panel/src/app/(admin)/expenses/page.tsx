"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, CircleDollarSign, Plus, Edit, Trash2, BarChart3, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const EXPENSE_CATEGORIES: Record<string, string> = {
    COACH_SALARY: "Coach Salary",
    FACILITY_RENT: "Facility Rent",
    UTILITIES: "Utilities",
    EQUIPMENT: "Equipment",
    MARKETING: "Marketing",
    ADMIN_COST: "Admin Cost",
    OTHER: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
    COACH_SALARY: "bg-blue-100 text-blue-700",
    FACILITY_RENT: "bg-purple-100 text-purple-700",
    UTILITIES: "bg-yellow-100 text-yellow-700",
    EQUIPMENT: "bg-green-100 text-green-700",
    MARKETING: "bg-pink-100 text-pink-700",
    ADMIN_COST: "bg-orange-100 text-orange-700",
    OTHER: "bg-slate-100 text-slate-700",
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function ExpensesPage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);
    const [selectedExpense, setSelectedExpense] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const now = new Date();
    const [filterMonth, setFilterMonth] = useState(String(now.getMonth() + 1));
    const [filterYear, setFilterYear] = useState(String(now.getFullYear()));
    const [filterBranch, setFilterBranch] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");

    const [form, setForm] = useState({
        title: "",
        category: "COACH_SALARY",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        branchId: "",
        notes: ""
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ month: filterMonth, year: filterYear });
            if (filterBranch !== 'all') params.append('branchId', filterBranch);
            if (filterCategory !== 'all') params.append('category', filterCategory);

            const [expRes, statsRes, branchRes] = await Promise.all([
                api.get(`/expenses?${params}`),
                api.get(`/expenses/stats?month=${filterMonth}&year=${filterYear}${filterBranch !== 'all' ? `&branchId=${filterBranch}` : ''}`),
                api.get('/branches')
            ]);

            if (expRes.data.success) {
                const payload = expRes.data.data;
                // formatPaginatedResponse returns { data: [...], meta: { total, ... } }
                setExpenses(Array.isArray(payload) ? payload : (payload.data ?? payload.results ?? []));
            }
            if (statsRes.data.success) setStats(statsRes.data.data);
            setBranches(branchRes.data.data?.data || branchRes.data.data?.results || branchRes.data.data || []);
        } catch (err) {
            toast.error("Failed to load expenses");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filterMonth, filterYear, filterBranch, filterCategory]);

    const openAdd = () => {
        setEditingExpense(null);
        setForm({ title: "", category: "COACH_SALARY", amount: "", date: new Date().toISOString().split('T')[0], branchId: user?.branchId || "", notes: "" });
        setIsModalOpen(true);
    };

    const openEdit = (expense: any) => {
        setEditingExpense(expense);
        setForm({
            title: expense.title,
            category: expense.category,
            amount: String(expense.amount),
            date: expense.date?.split('T')[0] || new Date().toISOString().split('T')[0],
            branchId: expense.branchId || "",
            notes: expense.notes || ""
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.amount || !form.date) return toast.error("Please fill all required fields");

        setIsSaving(true);
        try {
            const payload = {
                title: form.title,
                category: form.category,
                amount: parseFloat(form.amount),
                date: form.date,
                branchId: form.branchId || undefined,
                notes: form.notes || undefined,
            };

            if (editingExpense) {
                await api.put(`/expenses/${editingExpense.id}`, payload);
                toast.success("Expense updated successfully");
            } else {
                await api.post('/expenses', payload);
                toast.success("Expense recorded successfully");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save expense");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedExpense) return;
        setIsSaving(true);
        try {
            await api.delete(`/expenses/${selectedExpense.id}`);
            toast.success("Expense deleted");
            setIsDeleteModalOpen(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete");
        } finally {
            setIsSaving(false);
        }
    };

    const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - i));
    const netProfitPositive = stats ? stats.netProfit >= 0 : true;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <CircleDollarSign className="w-8 h-8 text-primary" />
                        Expenses &amp; Profit
                    </h1>
                    <p className="text-muted-foreground mt-1">Track expenses, revenue, and monthly profit/loss reports.</p>
                </div>
                <Button onClick={openAdd} className="font-bold gap-2 shadow-md">
                    <Plus className="w-4 h-4" /> Log Expense
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {months.map((m, i) => <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                </Select>
                {user?.role === 'SUPER_ADMIN' && (
                    <Select value={filterBranch} onValueChange={setFilterBranch}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Branches" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* P&L Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">Total Revenue</p>
                                <p className="text-2xl font-black text-green-600">AED {stats.totalRevenue?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{months[parseInt(filterMonth)-1]} {filterYear} collections</p>
                    </div>
                    <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">Total Expenses</p>
                                <p className="text-2xl font-black text-red-500">AED {stats.totalExpenses?.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Logged for {months[parseInt(filterMonth)-1]} {filterYear}</p>
                    </div>
                    <div className={`rounded-2xl border p-5 shadow-sm ${netProfitPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${netProfitPositive ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                <BarChart3 className={`w-5 h-5 ${netProfitPositive ? 'text-emerald-600' : 'text-red-600'}`} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase">Net Profit / Loss</p>
                                <p className={`text-2xl font-black ${netProfitPositive ? 'text-emerald-700' : 'text-red-600'}`}>
                                    {netProfitPositive ? '+' : ''}AED {stats.netProfit?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{netProfitPositive ? '✓ Profitable month' : '⚠ Expenses exceed revenue'}</p>
                    </div>
                </div>
            )}

            {/* Category Breakdown */}
            {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
                    <h3 className="font-black text-foreground mb-4">Expense Breakdown by Category</h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(stats.byCategory as Record<string, number>).map(([cat, amount]) => (
                            <div key={cat} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${CATEGORY_COLORS[cat] || 'bg-slate-100 text-slate-700'}`}>
                                <span>{EXPENSE_CATEGORIES[cat] || cat}</span>
                                <span className="font-black">AED {(amount as number).toFixed(0)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Expenses Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50">
                            <TableHead className="font-bold text-foreground">Title</TableHead>
                            <TableHead className="font-bold text-foreground">Category</TableHead>
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground text-right">Amount</TableHead>
                            <TableHead className="font-bold text-foreground">Date</TableHead>
                            <TableHead className="font-bold text-foreground">Logged By</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading expenses...</TableCell></TableRow>
                        ) : expenses.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No expenses logged for this period.</TableCell></TableRow>
                        ) : expenses.map(exp => (
                            <TableRow key={exp.id} className="border-border/50 hover:bg-muted/20">
                                <TableCell className="font-bold text-foreground">{exp.title}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${CATEGORY_COLORS[exp.category] || 'bg-slate-100 text-slate-700'}`}>
                                        {EXPENSE_CATEGORIES[exp.category] || exp.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{exp.branch?.name || "—"}</TableCell>
                                <TableCell className="text-right font-black text-foreground">AED {exp.amount?.toFixed(2)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{exp.createdBy?.name || "—"}</TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(exp)} className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedExpense(exp); setIsDeleteModalOpen(true); }} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[480px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black">{editingExpense ? "Edit Expense" : "Log New Expense"}</DialogTitle>
                        <DialogDescription>Record a financial outgoing for the academy.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4 py-2">
                        <div className="space-y-1">
                            <Label className="font-bold">Title <span className="text-destructive">*</span></Label>
                            <Input placeholder="e.g. Pool Maintenance" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="font-bold">Category</Label>
                                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="font-bold">Amount (AED) <span className="text-destructive">*</span></Label>
                                <Input type="number" step="0.01" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="font-bold">Date <span className="text-destructive">*</span></Label>
                                <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                            </div>
                            {user?.role === 'SUPER_ADMIN' && (
                                <div className="space-y-1">
                                    <Label className="font-bold">Branch (Optional)</Label>
                                    <Select value={form.branchId || "none"} onValueChange={v => setForm({...form, branchId: v === 'none' ? '' : v})}>
                                        <SelectTrigger><SelectValue placeholder="No specific branch" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No specific branch</SelectItem>
                                            {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label className="font-bold">Notes (Optional)</Label>
                            <Textarea placeholder="Additional details about this expense..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="min-h-[80px]" />
                        </div>
                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSaving} className="font-bold">
                                {isSaving ? "Saving..." : editingExpense ? "Update Expense" : "Log Expense"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-destructive">Delete Expense</DialogTitle>
                        <DialogDescription>Are you sure you want to delete &quot;<strong>{selectedExpense?.title}</strong>&quot;? This cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" disabled={isSaving} onClick={handleDelete} className="font-bold">
                            {isSaving ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
