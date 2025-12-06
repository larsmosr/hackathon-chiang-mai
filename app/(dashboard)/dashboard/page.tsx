"use client";
import { Card } from "@/components/ui/card";
import {
	Mic,
	Send,
	TrendingUp,
	Eye,
	MessageSquare,
	Share2,
	Clock,
	Sparkles,
} from "lucide-react";

const stats = [
	{
		title: "Voice Minutes",
		value: "47:32",
		icon: Mic,
		description: "+12 min this week",
	},
	{
		title: "Posts Generated",
		value: "156",
		icon: Send,
		description: "+23 posts this week",
	},
	{
		title: "Total Reach",
		value: "24.8K",
		icon: Eye,
		description: "+2.4K from last week",
	},
	{
		title: "Engagement Rate",
		value: "4.2%",
		icon: TrendingUp,
		description: "+0.8% from average",
	},
];

const platformStats = [
	{ name: "X / Twitter", posts: 52, reach: "8.2K", engagement: "5.1%", color: "bg-zinc-900" },
	{ name: "LinkedIn", posts: 38, reach: "12.4K", engagement: "3.8%", color: "bg-blue-600" },
	{ name: "Instagram", posts: 41, reach: "3.1K", engagement: "4.6%", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
	{ name: "Bluesky", posts: 25, reach: "1.1K", engagement: "6.2%", color: "bg-sky-500" },
];

const recentActivity = [
	{ action: "Voice entry transcribed", detail: "2 min 34 sec • Product update", time: "3 min ago", color: "bg-rose-500" },
	{ action: "X post generated", detail: "Thread idea about shipping fast", time: "5 min ago", color: "bg-zinc-700" },
	{ action: "LinkedIn post published", detail: "Reached 842 impressions", time: "2 hours ago", color: "bg-blue-600" },
];

export default function DashboardPage() {
	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground text-lg">
					Your voice-to-content performance at a glance.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card
							key={stat.title}
							className="group hover:shadow-lg transition-all duration-200 p-6 gap-0"
						>
							<div className="flex items-center justify-between mb-4">
								<span className="text-sm font-medium text-muted-foreground">
									{stat.title}
								</span>
								<div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
									<Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
								</div>
							</div>
							<div className="text-3xl font-bold mb-1">{stat.value}</div>
							<p className="text-sm text-muted-foreground">
								{stat.description}
							</p>
						</Card>
					);
				})}
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card className="p-6 gap-0">
					<div className="flex items-center gap-2 text-xl font-semibold mb-1">
						<Share2 className="h-5 w-5" />
						Platform Performance
					</div>
					<p className="text-muted-foreground mb-4">
						Posts and reach by platform
					</p>
					<div className="space-y-3">
						{platformStats.map((platform) => (
							<div key={platform.name} className="flex items-center gap-4 p-4 rounded-lg border">
								<div className={`w-3 h-3 rounded-full ${platform.color}`} />
								<div className="flex-1">
									<p className="font-medium">{platform.name}</p>
									<p className="text-sm text-muted-foreground">
										{platform.posts} posts • {platform.reach} reach
									</p>
								</div>
								<div className="text-right">
									<p className="font-semibold text-emerald-600">{platform.engagement}</p>
									<p className="text-xs text-muted-foreground">engagement</p>
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card className="p-6 gap-0">
					<div className="flex items-center gap-2 text-xl font-semibold mb-1">
						<Clock className="h-5 w-5" />
						Recent Activity
					</div>
					<p className="text-muted-foreground mb-4">
						Latest voice entries and posts
					</p>
					<div className="space-y-3">
						{recentActivity.map((item, i) => (
							<div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
								<div className={`w-2 h-2 rounded-full ${item.color}`} />
								<div className="flex-1">
									<p className="font-medium">{item.action}</p>
									<p className="text-sm text-muted-foreground">{item.detail}</p>
								</div>
								<span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
							</div>
						))}
					</div>
				</Card>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="p-6 gap-0">
					<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
						<Mic className="h-4 w-4" />
						Voice Sessions
					</div>
					<div className="text-2xl font-bold">23</div>
					<p className="text-sm text-muted-foreground">recordings this week</p>
					<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
						<div className="h-full w-3/4 bg-rose-500 rounded-full" />
					</div>
					<p className="text-xs text-muted-foreground mt-2">75% of weekly goal</p>
				</Card>

				<Card className="p-6 gap-0">
					<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
						<Sparkles className="h-4 w-4" />
						AI Generations
					</div>
					<div className="text-2xl font-bold">89</div>
					<p className="text-sm text-muted-foreground">posts created by AI</p>
					<div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
						<div className="h-full w-[60%] bg-violet-500 rounded-full" />
					</div>
					<p className="text-xs text-muted-foreground mt-2">57% conversion to published</p>
				</Card>

				<Card className="p-6 gap-0">
					<div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
						<MessageSquare className="h-4 w-4" />
						Best Performer
					</div>
					<div className="text-2xl font-bold">X Thread</div>
					<p className="text-sm text-muted-foreground">&ldquo;Why I shipped 3 features...&rdquo;</p>
					<div className="mt-4 flex gap-4 text-sm">
						<div>
							<span className="font-semibold">2.1K</span>
							<span className="text-muted-foreground ml-1">views</span>
						</div>
						<div>
							<span className="font-semibold">124</span>
							<span className="text-muted-foreground ml-1">likes</span>
						</div>
						<div>
							<span className="font-semibold">18</span>
							<span className="text-muted-foreground ml-1">replies</span>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
