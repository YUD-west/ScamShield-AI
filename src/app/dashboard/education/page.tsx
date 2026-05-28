"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  Shield,
  Trophy,
  Star,
  Lock,
  Globe,
  Smartphone,
  Wallet,
  Users,
  Code,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Brain,
  Zap,
  Sparkles,
  Award,
  Flame,
  Target,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const lessons = [
  {
    id: "phishing-101",
    title: "Phishing 101",
    icon: Shield,
    description: "Learn to identify and avoid phishing emails, SMS, and websites.",
    level: "Beginner",
    duration: "5 min",
    xp: 50,
    content: {
      sections: [
        { type: "text", content: "Phishing is a cyberattack where criminals impersonate legitimate organizations to steal sensitive information. These attacks often arrive via email, SMS, or social media." },
        { type: "tip", content: "Legitimate companies never ask for passwords or 2FA codes via email or text." },
        { type: "example", title: "🚨 Phishing Example", content: "Subject: URGENT: Your account has been compromised\nFrom: security@bank-secure-alert.com\nBody: Click here immediately to verify your account or it will be closed." },
        { type: "text", content: "Red flags include: urgent language, generic greetings, mismatched sender addresses, suspicious links, and requests for personal information." },
      ],
    },
  },
  {
    id: "password-security",
    title: "Password Security",
    icon: Lock,
    description: "Create strong passwords and use password managers effectively.",
    level: "Beginner",
    duration: "4 min",
    xp: 40,
    content: {
      sections: [
        { type: "text", content: "Strong passwords are your first line of defense. Use a unique, complex password for every account." },
        { type: "tip", content: "A passphrase like 'Correct-Horse-Battery-Staple' is stronger and easier to remember than 'P@ssw0rd!'" },
        { type: "text", content: "Use a password manager to generate and store unique passwords. Enable multi-factor authentication wherever possible." },
      ],
    },
  },
  {
    id: "social-engineering",
    title: "Social Engineering",
    icon: Users,
    description: "Understand how attackers manipulate human psychology to gain access.",
    level: "Intermediate",
    duration: "7 min",
    xp: 75,
    content: {
      sections: [
        { type: "text", content: "Social engineering exploits human psychology rather than technical vulnerabilities. Attackers manipulate trust, fear, and urgency." },
        { type: "example", title: "🎭 Common Tactics", content: "• Pretexting: Creating a fake scenario\n• Baiting: Offering something tempting\n• Tailgating: Following authorized personnel\n• Quid pro quo: Offering a service in exchange for info" },
        { type: "tip", content: "Always verify identities through official channels. If someone calls claiming to be IT support, hang up and call the official number." },
      ],
    },
  },
  {
    id: "romance-scams",
    title: "Romance & Dating Scams",
    icon: Heart,
    description: "Spot fake profiles and emotional manipulation tactics used by scammers.",
    level: "Intermediate",
    duration: "6 min",
    xp: 60,
    content: {
      sections: [
        { type: "text", content: "Romance scammers create fake profiles on dating apps and social media to build emotional relationships, then fabricate emergencies requiring money." },
        { type: "example", title: "⚠️ Warning Signs", content: "• Professes love very quickly\n• Always has excuses not to meet in person\n• Asks for money for emergencies, travel, or medical bills\n• Requests gift cards or cryptocurrency" },
        { type: "tip", content: "Never send money to someone you haven't met in person. Video chat early and reverse image search their profile photos." },
      ],
    },
  },
  {
    id: "crypto-scams",
    title: "Crypto & Investment Scams",
    icon: Wallet,
    description: "Identify fake investment platforms and cryptocurrency fraud schemes.",
    level: "Advanced",
    duration: "8 min",
    xp: 90,
    content: {
      sections: [
        { type: "text", content: "Crypto scams promise guaranteed returns, use high-pressure tactics, and often involve fake trading platforms or celebrity endorsements." },
        { type: "example", title: "💰 Common Crypto Scams", content: "• Pump and dump schemes\n• Fake ICOs (Initial Coin Offerings)\n• Rug pulls in DeFi projects\n• Pig butchering (long-term investment romance scams)" },
        { type: "tip", content: "If someone guarantees returns in crypto, it's a scam. Real investments always carry risk." },
      ],
    },
  },
  {
    id: "smishing-vishing",
    title: "Smishing & Vishing",
    icon: Smartphone,
    description: "Recognize SMS phishing and voice call social engineering attacks.",
    level: "Beginner",
    duration: "5 min",
    xp: 45,
    content: {
      sections: [
        { type: "text", content: "Smishing (SMS phishing) and vishing (voice phishing) are mobile-based attacks. Smishing uses fake text messages; vishing uses phone calls." },
        { type: "example", title: "📱 Smishing Example", content: "Text from 'Amazon': Your package has been delayed. Track your delivery here: bit.ly/amzn-track-f9d2" },
        { type: "tip", content: "Never click links in unsolicited text messages. Banks and government agencies won't call asking for personal info." },
      ],
    },
  },
];

const quizzes = [
  {
    id: "quiz-1",
    title: "Phishing Detection Quiz",
    icon: Shield,
    question: "Which of these is the strongest indicator of a phishing email?",
    options: [
      "The email has a company logo",
      "The email creates urgency and asks you to click a link to verify your account",
      "The email was sent during business hours",
      "The email addresses you by your name",
    ],
    correct: 1,
    explanation: "Urgency + requests for account verification are classic phishing tactics. Legitimate companies don't ask you to verify accounts via email links.",
  },
  {
    id: "quiz-2",
    title: "Password Security Quiz",
    icon: Lock,
    question: "Which password is strongest?",
    options: [
      "P@ssw0rd123",
      "Correct-Horse-Battery-Staple",
      "Summer2024!",
      "abcdef123456",
    ],
    correct: 1,
    explanation: "Long passphrases with uncommon word combinations are far stronger than short passwords with symbol substitutions.",
  },
  {
    id: "quiz-3",
    title: "Social Engineering Quiz",
    icon: Users,
    question: "A caller claims to be from your bank's fraud department and asks for your account PIN to 'verify your identity'. What should you do?",
    options: [
      "Provide the PIN to help them verify",
      "Hang up and call your bank's official number",
      "Ask them to call back later",
      "Give them partial information only",
    ],
    correct: 1,
    explanation: "Your bank will never call and ask for your PIN. Always hang up and contact the bank through official channels.",
  },
];

const badges = [
  { name: "Scam Spotter", icon: Shield, desc: "Complete Phishing 101", xp: 50, color: "from-cyan-500 to-emerald-500" },
  { name: "Password Pro", icon: Lock, desc: "Complete Password Security", xp: 40, color: "from-violet-500 to-purple-600" },
  { name: "Social Engineer", icon: Users, desc: "Complete Social Engineering", xp: 75, color: "from-amber-500 to-orange-600" },
  { name: "Crypto Wise", icon: Wallet, desc: "Complete Crypto Scams", xp: 90, color: "from-rose-500 to-pink-600" },
  { name: "Perfect Score", icon: Trophy, desc: "Get 3/3 on all quizzes", xp: 200, color: "from-yellow-400 to-amber-500" },
  { name: "Quick Learner", icon: Zap, desc: "Complete 3 lessons in one day", xp: 100, color: "from-blue-500 to-cyan-600" },
];

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<"learn" | "quiz" | "badges">("learn");
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [totalXP, setTotalXP] = useState(0);

  const activeLessonData = lessons.find((l) => l.id === activeLesson);

  function completeLesson(id: string) {
    if (!completedLessons.includes(id)) {
      const lesson = lessons.find((l) => l.id === id);
      setCompletedLessons((prev) => [...prev, id]);
      if (lesson) setTotalXP((prev) => prev + lesson.xp);
    }
    setActiveLesson(null);
  }

  function submitQuiz(quizId: string) {
    const answer = quizAnswers[quizId];
    if (answer === undefined) return;
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;
    const correct = answer === quiz.correct ? 1 : 0;
    setQuizScores((prev) => ({ ...prev, [quizId]: correct }));
    setQuizSubmitted((prev) => ({ ...prev, [quizId]: true }));
    if (correct) setTotalXP((prev) => prev + 30);
  }

  const xpProgress = (totalXP % 100);
  const level = Math.floor(totalXP / 100) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Cybersecurity Education Hub</h1>
          <p className="mt-1 text-muted-foreground">Learn to protect yourself from scams and cyber threats</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2">
          <Flame className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium">Level {level}</p>
            <p className="text-xs text-muted-foreground">{totalXP} XP</p>
          </div>
          <div className="w-20">
            <Progress value={xpProgress} className="h-1.5" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border/50">
        {[
          { id: "learn" as const, label: "Lessons", icon: BookOpen },
          { id: "quiz" as const, label: "Quizzes", icon: Brain },
          { id: "badges" as const, label: "Achievements", icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-cyan-400 text-cyan-300"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "learn" && (
          <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {activeLesson ? (
              <div className="space-y-4">
                <button onClick={() => setActiveLesson(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-cyan-400">
                  <ChevronRight className="h-4 w-4 rotate-180" /> Back to lessons
                </button>
                {activeLessonData && (
                  <Card className="glass overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <activeLessonData.icon className="h-6 w-6 text-cyan-400" />
                        <div>
                          <h2 className="text-xl font-bold">{activeLessonData.title}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-[10px]">{activeLessonData.level}</Badge>
                            <span className="text-xs text-muted-foreground">{activeLessonData.duration}</span>
                            <span className="text-xs text-amber-400">+{activeLessonData.xp} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="space-y-4 p-6">
                      {activeLessonData.content.sections.map((section, i) => (
                        <div key={i}>
                          {section.type === "text" && (
                            <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                          )}
                          {section.type === "tip" && (
                            <div className="flex gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                              <Lightbulb className="h-5 w-5 shrink-0 text-amber-400" />
                              <p className="text-sm text-cyan-200">{section.content}</p>
                            </div>
                          )}
                          {section.type === "example" && (
                            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                              <p className="mb-2 text-sm font-medium text-rose-300">{section.title}</p>
                              <pre className="whitespace-pre-wrap text-sm text-rose-200/80 font-mono text-xs">{section.content}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button variant="cyber" onClick={() => completeLesson(activeLessonData.id)} className="mt-4">
                        <CheckCircle2 className="h-4 w-4" /> Mark as Complete (+{activeLessonData.xp} XP)
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson, i) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        className={`glass cursor-pointer transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 ${isCompleted ? "border-emerald-500/30" : ""}`}
                        onClick={() => setActiveLesson(lesson.id)}
                      >
                        <CardContent className="p-5">
                          <div className="mb-3 flex items-start justify-between">
                            <div className={`rounded-xl p-3 ${isCompleted ? "bg-emerald-500/20" : "bg-cyan-500/10"}`}>
                              <lesson.icon className={`h-5 w-5 ${isCompleted ? "text-emerald-400" : "text-cyan-400"}`} />
                            </div>
                            {isCompleted && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                          </div>
                          <h3 className="font-semibold">{lesson.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{lesson.description}</p>
                          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px]">{lesson.level}</Badge>
                            <span>{lesson.duration}</span>
                            <span className="text-amber-400/80">+{lesson.xp} XP</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-2">
            {quizzes.map((quiz) => {
              const isSubmitted = quizSubmitted[quiz.id];
              const score = quizScores[quiz.id];
              return (
                <Card key={quiz.id} className="glass">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-500/10 p-2">
                        <quiz.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{quiz.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">Select the correct answer</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium">{quiz.question}</p>
                    {quiz.options.map((option, i) => {
                      let optionClass = "border-white/[0.06] bg-secondary/50 hover:border-cyan-500/20";
                      if (isSubmitted) {
                        if (i === quiz.correct) optionClass = "border-emerald-500/40 bg-emerald-500/10";
                        else if (quizAnswers[quiz.id] === i) optionClass = "border-rose-500/40 bg-rose-500/10";
                        else optionClass = "border-white/[0.06] bg-secondary/30 opacity-60";
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => !isSubmitted && setQuizAnswers((prev) => ({ ...prev, [quiz.id]: i }))}
                          disabled={isSubmitted}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all ${optionClass} ${
                            quizAnswers[quiz.id] === i && !isSubmitted ? "border-cyan-500/40 bg-cyan-500/10" : ""
                          }`}
                        >
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                            isSubmitted && i === quiz.correct ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" :
                            isSubmitted && quizAnswers[quiz.id] === i ? "border-rose-500 bg-rose-500/20 text-rose-400" :
                            "border-border"
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          {option}
                        </button>
                      );
                    })}
                    {isSubmitted ? (
                      <div className={`flex items-start gap-3 rounded-lg p-3 ${
                        score ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"
                      }`}>
                        {score ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
                        <div>
                          <p className="text-sm font-medium">{score ? "Correct!" : "Not quite right."}</p>
                          <p className="text-xs mt-1 opacity-80">{quiz.explanation}</p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="cyber"
                        size="sm"
                        className="w-full"
                        onClick={() => submitQuiz(quiz.id)}
                        disabled={quizAnswers[quiz.id] === undefined}
                      >
                        Submit Answer <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {activeTab === "badges" && (
          <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge, i) => {
                const earned = completedLessons.length >= 1 && i < 4 ? badge.name === "Scam Spotter" || badge.name === "Password Pro" : false;
                return (
                  <motion.div
                    key={badge.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className={`glass text-center transition-all ${earned ? "border-amber-500/30" : "opacity-60"}`}>
                      <CardContent className="p-6">
                        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} shadow-lg ${earned ? "" : "grayscale"}`}>
                          <badge.icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{badge.desc}</p>
                        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-amber-400">
                          <Star className="h-3 w-3" /> {badge.xp} XP
                        </div>
                        {earned && (
                          <Badge className="mt-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
                            <Trophy className="h-3 w-3 mr-1" /> Earned
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Lightbulb(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> }

function Heart(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> }
