"use client";

import { useState, useEffect } from "react";
import { Star, StarHalf, TrendingUp, MessageSquare, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const GOOGLE_MAPS_REVIEW_URL = "https://g.page/r/REPLACE_WITH_YOUR_GOOGLE_MAPS_LINK/review";

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                />
            ))}
            <span className="ml-1 text-xs font-bold text-slate-500">{rating}/5</span>
        </div>
    );
}

export default function ReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [branches, setBranches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("all");
    const [selectedRating, setSelectedRating] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);
    const pageSize = 20;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ page: String(currentPage), limit: String(pageSize) });
            if (selectedBranch !== 'all') params.append('branchId', selectedBranch);
            if (selectedRating !== 'all') params.append('rating', selectedRating);

            const [reviewsRes, statsRes, branchRes] = await Promise.all([
                api.get(`/reviews?${params}`),
                api.get(`/reviews/stats${selectedBranch !== 'all' ? `?branchId=${selectedBranch}` : ''}`),
                api.get('/branches')
            ]);

            if (reviewsRes.data.success) {
                const payload = reviewsRes.data.data;
                setReviews(Array.isArray(payload) ? payload : (payload.data ?? payload.results ?? []));
                setTotalEntries(payload.meta?.total ?? payload.total ?? 0);
            }
            if (statsRes.data.success) setStats(statsRes.data.data);
            setBranches(branchRes.data.data?.data || branchRes.data.data?.results || branchRes.data.data || []);
        } catch (err) {
            toast.error("Failed to load reviews");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentPage, selectedBranch, selectedRating]);

    const filteredReviews = reviews.filter(r =>
        !searchTerm ||
        r.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.text?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(totalEntries / pageSize);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                        Student Reviews
                    </h1>
                    <p className="text-muted-foreground mt-1">Read, manage, and share student feedback to boost your Google presence.</p>
                </div>
                <Button
                    onClick={() => window.open(GOOGLE_MAPS_REVIEW_URL, '_blank')}
                    className="font-bold gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                >
                    <ExternalLink className="w-4 h-4" />
                    View on Google Maps
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Reviews", value: stats.total, icon: <MessageSquare className="w-5 h-5 text-blue-500" />, color: "blue" },
                        { label: "Average Rating", value: <StarRating rating={stats.averageRating} />, icon: <Star className="w-5 h-5 text-amber-400 fill-amber-400" />, color: "amber" },
                        { label: "5-Star Reviews", value: stats.fiveStarCount, icon: <Star className="w-5 h-5 text-green-500 fill-green-500" />, color: "green" },
                        { label: "This Month", value: stats.thisMonthCount, icon: <TrendingUp className="w-5 h-5 text-purple-500" />, color: "purple" },
                    ].map(card => (
                        <div key={card.label} className="bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4 shadow-sm">
                            <div className={`w-10 h-10 rounded-xl bg-${card.color}-50 flex items-center justify-center shrink-0`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground font-bold uppercase">{card.label}</p>
                                <div className="font-black text-xl text-foreground">{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search by student or review text..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                {user?.role === 'SUPER_ADMIN' && (
                    <Select value={selectedBranch} onValueChange={(v) => { setSelectedBranch(v); setCurrentPage(1); }}>
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Branches" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
                <Select value={selectedRating} onValueChange={(v) => { setSelectedRating(v); setCurrentPage(1); }}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Ratings" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                        <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                        <SelectItem value="1">⭐ 1 Star</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50">
                            <TableHead className="font-bold text-foreground">Student</TableHead>
                            <TableHead className="font-bold text-foreground">Branch</TableHead>
                            <TableHead className="font-bold text-foreground">Rating</TableHead>
                            <TableHead className="font-bold text-foreground">Review</TableHead>
                            <TableHead className="font-bold text-foreground">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Loading reviews...</TableCell></TableRow>
                        ) : filteredReviews.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No reviews found.</TableCell></TableRow>
                        ) : filteredReviews.map(review => (
                            <TableRow key={review.id} className="border-border/50 hover:bg-muted/20">
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-foreground">{review.student?.name || "Unknown"}</p>
                                        <p className="text-xs text-muted-foreground">{review.student?.studentId}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">{review.branch?.name || "—"}</TableCell>
                                <TableCell><StarRating rating={review.rating} /></TableCell>
                                <TableCell className="max-w-[300px]">
                                    <p className="text-sm text-foreground line-clamp-2">{review.text || <span className="italic text-muted-foreground">No written review</span>}</p>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border/50 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">{totalEntries} reviews total</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                            <span className="text-sm font-bold px-2 flex items-center">{currentPage} / {totalPages}</span>
                            <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Google Direction */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                <Star className="w-8 h-8 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-black text-amber-900 mb-1">Share Reviews on Google</h3>
                    <p className="text-sm text-amber-800">
                        To push a student's review to Google, copy their feedback and paste it as a Google Maps reply, or share the direct review link with them.
                        Update the <code className="bg-amber-100 px-1 rounded text-xs">GOOGLE_MAPS_REVIEW_URL</code> variable at the top of this page with your actual Google Maps review link.
                    </p>
                    <Button variant="outline" className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100 font-bold gap-2" onClick={() => window.open(GOOGLE_MAPS_REVIEW_URL, '_blank')}>
                        <ExternalLink className="w-4 h-4" /> Open Google Maps Review Link
                    </Button>
                </div>
            </div>
        </div>
    );
}
