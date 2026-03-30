"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Waves } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"BRANCH" | "HQ">("BRANCH");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);
  const [fetchError, setFetchError] = useState(false);

  // Fetch branches on mount for the select dropdown
  useEffect(() => {
    api.get('/branches').then((res: any) => {
      if (res.data.success) {
        setBranches(res.data.data);
      } else {
        setFetchError(true);
      }
    }).catch((err: any) => {
      console.error("Could not load branches", err);
      setFetchError(true);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === "BRANCH" && !branchId) {
      toast.error("Please select a branch");
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = { username, password };
      if (loginType === "BRANCH") {
        payload.branchId = branchId;
      }
      
      const response = await api.post('/auth/admin/login', payload);

      if (response.data.success) {
        toast.success("Login successful!");
        const { accessToken, admin } = response.data.data;
        
        // Parse branch permissions for STAFF users so they're available globally
        let parsedPermissions: string[] | undefined;
        if (admin.role === 'STAFF' && admin.branch?.permissions) {
          try {
            parsedPermissions = typeof admin.branch.permissions === 'string'
              ? JSON.parse(admin.branch.permissions)
              : admin.branch.permissions;
          } catch {
            parsedPermissions = ['dashboard', 'schedule', 'registration', 'payments', 'coaches', 'reminders'];
          }
        }
        
        login(accessToken, { ...admin, permissions: parsedPermissions });
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.details || "Invalid credentials or branch access denied");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Waves */}
      <div className="absolute top-0 w-full h-64 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[120%] h-64 bg-primary/20 rounded-[100%] scale-x-150 rotate-3 animate-in fade-in duration-1000" />
        <div className="absolute -top-32 -right-10 w-[120%] h-64 bg-accent/20 rounded-[100%] scale-x-150 -rotate-2 animate-in fade-in duration-1000 delay-150" />
      </div>

      <div className="absolute bottom-0 w-full h-48 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-10 w-[110%] h-48 bg-secondary/10 rounded-[100%] outline-none scale-x-125 -rotate-1" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-card p-8 rounded-3xl shadow-xl card-hover border border-primary/10">

        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-card outline outline-2 outline-primary">
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">NSM Admin</h1>
          <p className="text-muted-foreground mt-2 font-medium">Dive Into Excellence</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex p-1 bg-muted/50 rounded-xl mb-2">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'BRANCH' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setLoginType('BRANCH')}
            >
              Branch Login
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'HQ' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setLoginType('HQ')}
            >
              HQ Login
            </button>
          </div>

          {loginType === 'BRANCH' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="branch" className="text-accent-foreground font-semibold">Select Branch</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger id="branch" className="h-12 bg-background border-border rounded-xl">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {fetchError ? (
                    <SelectItem value="error" disabled>Failed to load branches. Is backend running?</SelectItem>
                  ) : branches.length === 0 ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    branches.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-accent-foreground font-semibold">Username</Label>
            <Input
              id="username"
              placeholder="Enter admin username"
              required
              className="h-12 bg-background border-border rounded-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-accent-foreground font-semibold">Password</Label>
              <a href="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="h-12 bg-background border-border rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-base font-bold rounded-xl bg-secondary hover:bg-secondary/90 text-white shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login to Dashboard"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">Login directly connects to the real PostgreSQL database via the API.</p>
        </div>
      </div>
    </div>
  );
}
