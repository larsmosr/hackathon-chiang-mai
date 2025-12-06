# MakerMic 🎙️

Voice-to-content for indie makers. Stop writing posts. Start speaking.

![MakerMic](https://shadcn-nextjs-dashboard.vercel.app/og-image.png)

## What is MakerMic?

MakerMic is a web app that lets indie makers voice-dump their progress, ideas, and wins—then transforms those recordings into authentic, platform-ready social posts. No more staring at a blank screen. Just speak naturally and get posts that sound like you, not generic AI slop.

## ✨ Features

### Voice-First Input
- **Zero friction recording**: Hit record and brain dump. Speaking is 3x faster than typing.
- **Natural transcription**: No prompts or structure required—just speak naturally about what you shipped, learned, or are struggling with.

### Multi-Platform Content
Generate tailored posts for 5 platforms from a single voice recording:

| Platform | Style |
|----------|-------|
| **X / Twitter** | Short, punchy hooks. Thread ideas. Build-in-public optimized. |
| **Threads** | Casual, conversational. Community vibes. |
| **LinkedIn** | Value-first storytelling. Clear takeaways. Professional but human. |
| **Instagram** | Story-driven captions. Behind-the-scenes energy. |
| **Bluesky** | Tech-friendly, decentralized crowd focus. |

### AI Image Generation
- **One-click image gen**: Generate Instagram-worthy images from your post content using DALL-E 3
- **Stored in Convex**: Images are persisted and displayed alongside posts

### One-Click Actions
- **Copy to clipboard**: Grab any post instantly
- **Post celebration**: Hit "Post" and get confetti 🎉

### Dashboard & Analytics
- Track voice minutes, posts generated, total reach, and engagement
- View platform-specific performance metrics
- Recent activity feed

### Brainstorm Room
Dedicated space for ideation and content planning

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: [Convex](https://convex.dev) for real-time database and server functions
- **AI**: OpenAI GPT-4 for content generation, DALL-E 3 for image generation
- **UI**: shadcn/ui components
- **Effects**: canvas-confetti for celebrations

## 📦 Getting Started

### Prerequisites

- Node.js 18.17+
- npm or yarn
- Convex account
- OpenAI API key

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/makermic.git
   cd makermic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Convex:
   ```bash
   npx convex dev
   ```

4. Create `.env.local` with your keys:
   ```
   CONVEX_DEPLOYMENT=your-deployment
   NEXT_PUBLIC_CONVEX_URL=your-convex-url
   OPENAI_API_KEY=your-openai-key
   ```

5. Run the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── (auth)/           # Auth pages (login, register, etc.)
│   ├── (dashboard)/      # Dashboard with platform-specific pages
│   │   └── dashboard/
│   │       ├── x/
│   │       ├── threads/
│   │       ├── linkedin/
│   │       ├── instagram/
│   │       ├── bluesky/
│   │       └── brainstorm/
│   └── page.tsx          # Landing page
├── components/
│   ├── shared/           # Sidebar, topbar, post cards
│   └── ui/               # shadcn/ui components
├── convex/
│   ├── posts.ts          # Post queries & mutations
│   ├── images.ts         # AI image generation action
│   └── schema.ts         # Database schema
└── lib/
    └── utils.ts          # Utility functions
```

## 🎯 Core Concepts

### Voice Dump Flow
1. User records a voice memo about their progress/ideas
2. Audio is transcribed to text
3. AI generates platform-optimized versions
4. User copies or "posts" with one click

### Platform-Specific Agents
Each platform has tailored generation rules:
- **X**: Hook + optional thread, punchy language
- **LinkedIn**: Context-rich, value-oriented, professional
- **Instagram**: Storytelling, casual, caption-ready
- **Bluesky**: Technical-friendly, similar to X

### Data Model
```typescript
posts: {
  platform: "x" | "threads" | "linkedin" | "instagram" | "bluesky"
  content: string
  timestamp: string
  imageId?: Id<"_storage">  // For AI-generated images
}
```

## 🚀 Roadmap

- [ ] Voice recording integration (ElevenLabs STT)
- [ ] User authentication
- [ ] Style profile learning (match user's vocabulary over time)
- [ ] Direct platform posting via OAuth
- [ ] Scheduling and queue management
- [ ] Analytics and insights
- [ ] Mobile app

## 🤝 Contributing

Contributions welcome! This project follows these conventions:
- Files: `kebab-case.ts`
- Components: `PascalCase`
- Functions: `camelCase`
- Prefer functional components, avoid classes

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built for makers, by makers. Ship fast, post faster. 🚀
