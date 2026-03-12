"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login -> redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
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
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-accent-foreground font-semibold">Select Branch</Label>
            <Select defaultValue="dubai">
              <SelectTrigger id="branch" className="h-12 bg-background border-border rounded-xl">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dubai">Dubai Head Office</SelectItem>
                <SelectItem value="sharjah">Sharjah</SelectItem>
                <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-accent-foreground font-semibold">Username</Label>
            <Input
              id="username"
              placeholder="Enter admin username"
              required
              className="h-12 bg-background border-border rounded-xl"
              defaultValue="admin"
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
              defaultValue="password"
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
          <p className="text-xs text-muted-foreground">For prototype demo, any credentials will work.</p>
        </div>
      </div>
    </div>
  );
}
