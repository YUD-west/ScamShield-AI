"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Shield, Lock, Globe, Smartphone, Wallet, Users, CheckCircle2, ArrowRight, Zap, Star, Trophy } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: any;
  category: string;
  completed: boolean;
  progress: number;
}

const initialChallenges: Challenge[] = [
  { id: "c1", title: "Password Audit", description: "Review and update passwords for 5 accounts", xp: 50, icon: Lock, category: "Passwords", completed: false, progress: 0 },
  { id: "c2", title: "Phishing Spotter", description: "Correctly identify 3 phishing emails in a row", xp: 75, icon: Shield, category: "Phishing", completed: false, progress: 0 },
  { id: "c3", title: "2FA Champion", description: "Enable 2FA on 3 accounts this week", xp: 100, icon: Smartphone, category: "Authentication", completed: false, progress: 0 },
  { id: "c4", title: "Privacy Cleanup", description: "Review and remove unused app permissions", xp: 60, icon: Globe, category: "Privacy", completed: false, progress: 0 },
  { id: "c5", title: "Scam Report", description: "Report a suspicious message to the community", xp: 40, icon: Users, category: "Community", completed: false, progress: 0 },
  { id: "c6", title: "Crypto Safe", description: "Learn to identify 5 types of crypto scams", xp: 90, icon: Wallet, category: "Crypto", completed: false, progress: 0 },
];

export function SecurityChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.filter((c) => c.completed).reduce((a, c) => a + c.xp, 0);

  function completeChallenge(id: string) {
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, completed: true, progress: 100 } : c));
  }

  return (
    <Card className="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-4 w-4 text-cyan-400" /> Security Challenges
        </CardTitle>
        <Badge variant="outline" className="border-amber-500/30 text-amber-400 gap-1">
          <Trophy className="h-3 w-3" /> {completedCount}/6
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Weekly progress</span>
          <span>{totalXP} XP earned</span>
        </div>
        <Progress value={(completedCount / 6) * 100} className="h-1.5 mb-4" />
        {challenges.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 rounded-lg border p-3 transition ${
              c.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 hover:border-cyan-500/20"
            }`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              c.completed ? "bg-emerald-500/20" : "bg-cyan-500/10"
            }`}>
              <c.icon className={`h-4 w-4 ${c.completed ? "text-emerald-400" : "text-cyan-400"}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{c.title}</p>
                {c.completed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <p className="text-xs text-muted-foreground">{c.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400">+{c.xp}XP</span>
              {!c.completed && (
                <Button variant="outline" size="sm" className="h-7 text-xs border-cyan-500/20" onClick={() => completeChallenge(c.id)}>
                  Start
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
