import {
  ArrowRight,
  Mic,
  Zap,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Sparkles,
  Clock,
  Target,
  Volume2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const platforms = [
  { name: "X", icon: Twitter, color: "from-gray-700 to-gray-900" },
  { name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-800" },
  { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
  { name: "Bluesky", icon: MessageCircle, color: "from-sky-400 to-blue-500" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-orange-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">MakerMic</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Features
              </a>
              <a
                href="#platforms"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Platforms
              </a>
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-6"
                asChild
              >
                <Link href="/dashboard">
                  Try it free
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-500/20 px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-2" />
            Built for Indie Makers
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Stop writing posts.
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Start speaking.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            Voice-dump your progress, ideas, and wins. MakerMic turns your raw
            thoughts into authentic, platform-ready posts—in your voice, not
            generic AI slop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/25"
              asChild
            >
              <Link href="/dashboard">
                <Mic className="w-5 h-5 mr-2" />
                Record your first dump
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Mic visualization */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-1 h-24">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 50}ms`,
                      animationDuration: `${800 + Math.random() * 400}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-4 font-mono">
                &quot;Just shipped the new onboarding flow. Users can now sign up in
                under 30 seconds...&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                You want to build.
                <br />
                <span className="text-gray-500">
                  Social media eats your time.
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                As an indie maker, you know building in public works. But
                crafting posts for X, LinkedIn, Instagram, and Bluesky? That&apos;s
                hours you could spend shipping features.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                Most AI tools give you generic, soulless content. Your audience
                can smell it from a mile away.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-red-950/20 border-red-900/30 p-6">
                <Clock className="w-8 h-8 text-red-400 mb-3" />
                <p className="text-2xl font-bold text-red-400 mb-1">2+ hrs</p>
                <p className="text-gray-500 text-sm">
                  daily on social media management
                </p>
              </Card>
              <Card className="bg-red-950/20 border-red-900/30 p-6">
                <Target className="w-8 h-8 text-red-400 mb-3" />
                <p className="text-2xl font-bold text-red-400 mb-1">4+</p>
                <p className="text-gray-500 text-sm">
                  platforms with different vibes
                </p>
              </Card>
              <Card className="bg-red-950/20 border-red-900/30 p-6 col-span-2">
                <Volume2 className="w-8 h-8 text-red-400 mb-3" />
                <p className="text-xl font-bold text-red-400 mb-1">
                  Generic AI = Dead engagement
                </p>
                <p className="text-gray-500 text-sm">
                  Your audience follows you for your authentic voice, not
                  ChatGPT vibes
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
              How it works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From voice dump to viral post in seconds
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Speak naturally about your progress. We handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                1
              </div>
              <Card className="bg-gray-900/50 border-gray-800 h-full pt-8">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <Mic className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Voice dump</h3>
                  <p className="text-gray-400">
                    Hit record and talk about what you shipped, learned, or are
                    struggling with. No structure needed—just speak naturally.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                2
              </div>
              <Card className="bg-gray-900/50 border-gray-800 h-full pt-8">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <Sparkles className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI magic</h3>
                  <p className="text-gray-400">
                    Our agents learn your voice, vocabulary, and patterns. They
                    craft posts that sound like you—not some generic AI.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                3
              </div>
              <Card className="bg-gray-900/50 border-gray-800 h-full pt-8">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                    <Zap className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Copy &amp; ship
                  </h3>
                  <p className="text-gray-400">
                    Get platform-optimized posts for X, LinkedIn, Instagram, and
                    Bluesky. One click to copy, ready to post.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why makers love MakerMic
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-gray-800 hover:border-amber-500/30 transition-all group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Mic className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Zero friction input
                </h3>
                <p className="text-gray-400">
                  Speaking is 3x faster than typing. Just hit record and brain
                  dump. No prompts, no structure required.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-gray-800 hover:border-amber-500/30 transition-all group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Volume2 className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your voice, kept</h3>
                <p className="text-gray-400">
                  We learn your vocabulary, phrases, and style. Posts sound like
                  you wrote them—because you did, just faster.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-gray-800 hover:border-amber-500/30 transition-all group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Target className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Platform-native posts
                </h3>
                <p className="text-gray-400">
                  Each platform has its own vibe. Our sub-agents know the
                  difference between a punchy X thread and a LinkedIn story.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-900/50 border-gray-800 hover:border-amber-500/30 transition-all group">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Context-aware</h3>
                <p className="text-gray-400">
                  We remember your projects, progress, and previous updates. No
                  more repeating yourself or losing continuity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section
        id="platforms"
        className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      >
        <div className="max-w-5xl mx-auto text-center">
          <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
            Multi-platform
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            One voice dump. Four platforms.
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Each platform gets a tailored version that fits its unique style and
            audience expectations.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <Card
                key={platform.name}
                className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all group cursor-pointer"
              >
                <CardContent className="p-6 flex flex-col items-center">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <platform.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-medium">{platform.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Twitter className="w-5 h-5 text-gray-400" />
                <span className="font-medium">X / Twitter</span>
              </div>
              <p className="text-gray-500 text-sm">
                Short, punchy hooks. Thread ideas. Engagement-optimized for the
                build in public crowd.
              </p>
            </Card>
            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Linkedin className="w-5 h-5 text-blue-400" />
                <span className="font-medium">LinkedIn</span>
              </div>
              <p className="text-gray-500 text-sm">
                Value-first storytelling. Clear takeaways. Professional tone
                that still sounds human.
              </p>
            </Card>
            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="font-medium">Instagram</span>
              </div>
              <p className="text-gray-500 text-sm">
                Casual, story-driven captions. Behind-the-scenes vibes. Perfect
                for building connection.
              </p>
            </Card>
            <Card className="bg-gray-900/30 border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-sky-400" />
                <span className="font-medium">Bluesky</span>
              </div>
              <p className="text-gray-500 text-sm">
                Tech-friendly, community-focused. Similar to X but tuned for the
                decentralized crowd.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-900/40 border border-white/10 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ship more. Post more.
                <br />
                <span className="text-gray-500">Write less.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join indie makers who are building in public without burning out
                on content creation.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/25"
                asChild
              >
                <Link href="/dashboard">
                  <Mic className="w-5 h-5 mr-2" />
                  Start your first voice dump
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="text-gray-500 text-sm mt-4">
                Free to try. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MakerMic</span>
            </div>
            <p className="text-gray-500 text-sm">
              Built by makers, for makers. Ship fast, post faster.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
