# Voice-to-Content App Implementation Plan

---

## 1. Codebase Overview

### Current State Summary

**Frontend:**

- Next.js 14 App Router with TypeScript strict mode
- Tailwind CSS + complete shadcn/ui component library (40+ components)
- Clerk authentication with dark/light mode support
- Team-based routing at `/t/[teamSlug]/`
- Example MessageBoard component demonstrating real-time data patterns

**Backend (Convex):**

- Uses `convex-ents` for entity relationships and soft deletion
- Custom function wrappers with `viewer` context for auth
- Existing schema: `teams`, `users`, `members`, `roles`, `permissions`, `invites`, `messages`
- Permission system with `viewerHasPermission()` helpers

**Auth:**

- Clerk JWT integration configured in [`convex/auth.config.js`](convex/auth.config.js)
- Middleware at [`middleware.ts`](middleware.ts) protecting all routes except `/`
- User stored in Convex via `api.users.store` on auth

**Technical Debt:**

- `messages` table is a demo feature - repurpose or remove
- `/layouts/` folder contains layout demos - remove entirely
- `as` table in schema is test data - remove
- Landing page at [`app/page.tsx`](app/page.tsx) is boilerplate text

---

## 2. Platform Agent Characters

The core UX innovation: 4 distinct AI agents with unique personalities users can interact with.

### Agent Definitions

**Chirp** (X/Twitter)

- Color: `#1DA1F2` (Twitter blue)
- Avatar: Bird icon or speech bubble with lightning
- Personality: Quick, witty, punchy. Loves hooks and hot takes.
- Greeting: "Let's make this pop in 280 chars!"
- Strengths: Hooks, threads, viral potential, brevity

**Lindy** (LinkedIn)

- Color: `#0A66C2` (LinkedIn blue)
- Avatar: Briefcase or professional handshake icon
- Personality: Professional but warm. Value-focused, story-driven.
- Greeting: "What's the takeaway for your network?"
- Strengths: Professional storytelling, lessons learned, value props

**Pixel** (Instagram)

- Color: `#E4405F` to `#F77737` (Instagram gradient)
- Avatar: Camera with sparkles or gradient square
- Personality: Creative, emotional, visual storyteller. Caption queen.
- Greeting: "Let's tell a story they'll feel."
- Strengths: Emotional hooks, hashtags, relatable captions

**Skylar** (Bluesky)

- Color: `#0085FF` (Bluesky blue)
- Avatar: Cloud or butterfly icon
- Personality: Tech-savvy, open-minded, community builder.
- Greeting: "Let's share something the devs will love."
- Strengths: Technical authenticity, community vibes, open web energy

### Interaction Modes

1. **Quick Generate**: Record voice, all 4 agents generate posts simultaneously
2. **Single Agent Mode**: Select one agent, talk directly to them, refine iteratively
3. **Chat Refinement**: After generation, chat with any agent to tweak ("Make it punchier", "Add a hook")

---

## 3. Proposed Data Model (Convex)

### MVP Tables

**`voiceEntries`**

```typescript
{
  userId: v.id("users"),
  rawTranscript: v.string(),
  durationMs: v.optional(v.number()),
  audioStorageId: v.optional(v.id("_storage")),
  tags: v.optional(v.array(v.string())),
  projectName: v.optional(v.string()),
  status: v.optional(v.union(v.literal("idea"), v.literal("in_progress"), v.literal("shipped"))),
}
// Index: by_userId
```

**`generatedPosts`**

```typescript
{
  userId: v.id("users"),
  voiceEntryId: v.id("voiceEntries"),
  platform: v.union(v.literal("twitter"), v.literal("linkedin"), v.literal("instagram"), v.literal("bluesky")),
  agentName: v.string(), // "chirp", "lindy", "pixel", "skylar"
  content: v.string(),
  tone: v.optional(v.string()),
  chatHistory: v.optional(v.array(v.object({ role: v.string(), content: v.string() }))),
}
// Index: by_voiceEntryId, by_userId_and_platform
```

**`styleProfiles`**

```typescript
{
  userId: v.id("users"),
  inferredTone: v.optional(v.string()),
  commonPhrases: v.optional(v.array(v.string())),
  vocabularyNotes: v.optional(v.string()),
  platformPreferences: v.optional(v.record(v.string(), v.string())),
}
// Index: by_userId (unique)
```

---

## 4. Implementation Plan by Phase

### Phase 0 - Codebase Cleanup (30 min)

**Goal:** Remove demo code and prepare clean foundation.

- Delete `app/layouts/` folder entirely
- Remove `messages` table: delete [`convex/users/teams/messages.ts`](convex/users/teams/messages.ts), remove from schema
- Delete [`app/t/[teamSlug]/MessageBoard.tsx`](app/t/[teamSlug]/MessageBoard.tsx)
- Remove `as` test table from [`convex/schema.ts`](convex/schema.ts)
- Update [`app/page.tsx`](app/page.tsx) with product landing copy
- Update metadata in [`app/layout.tsx`](app/layout.tsx)

### Phase 1 - Schema and Base Functions (2 hours)

**Goal:** Define data model and basic CRUD operations.

- Add `voiceEntries`, `generatedPosts`, `styleProfiles` tables to [`convex/schema.ts`](convex/schema.ts)
- Create `convex/voice-entries.ts` with `create`, `list`, `get`, `delete` functions
- Create `convex/generated-posts.ts` with `listByEntry`, `get`, `update` queries
- Create `convex/style-profiles.ts` with `get`, `upsert` functions

### Phase 2 - Voice Recording UI (3 hours)

**Goal:** Build the core recording experience with big, obvious record button.

- Create `components/voice/record-button.tsx` - large, animated mic button
- Create `hooks/use-voice-recorder.ts` - MediaRecorder API wrapper with state machine
- Create `components/voice/recording-status.tsx` - shows duration, waveform visualization
- Create `components/voice/voice-entry-list.tsx` - scrollable list of past entries
- Create `components/voice/voice-entry-card.tsx` - card showing transcript preview, timestamp, tags
- Wire up dashboard at [`app/t/[teamSlug]/page.tsx`](app/t/[teamSlug]/page.tsx)

### Phase 3 - Speech-to-Text Integration (2 hours)

**Goal:** Connect ElevenLabs STT API for transcription.

- Create `convex/http.ts` with audio upload endpoint
- Create `convex/ai/transcribe.ts` with `transcribeAudio` action calling ElevenLabs
- Handle audio storage in Convex file storage
- Add `ELEVENLABS_API_KEY` to environment
- Update `hooks/use-voice-recorder.ts` to upload and poll for transcript
- Add error handling and retry logic

### Phase 4 - Platform Agent Characters and AI (4 hours)

**Goal:** Build the 4 agent personalities with distinct generation and chat capabilities.

- Create `lib/agents/config.ts` - agent definitions (names, colors, avatars, personalities)
- Create agent avatar components in `components/agents/`:
  - `agent-avatar.tsx` - renders the right icon/color for each agent
  - `agent-greeting.tsx` - shows personality-driven greeting
  - `agent-card.tsx` - card component for each agent with their generated content
- Create agent system prompts in `convex/ai/agents/`:
  - `chirp.ts` - Twitter agent prompt and constraints
  - `lindy.ts` - LinkedIn agent prompt and constraints
  - `pixel.ts` - Instagram agent prompt and constraints
  - `skylar.ts` - Bluesky agent prompt and constraints
- Create `convex/ai/agent-orchestrator.ts` - coordinates multiple agents
- Create `convex/ai/generate-posts.ts`:
  - `generateWithAgent` action - single agent generation
  - `generateAllAgents` action - parallel generation for all 4
- Create `convex/ai/chat-with-agent.ts` - conversational refinement with an agent
- Add `OPENAI_API_KEY` to environment

### Phase 5 - Context and Style Profile (2 hours)

**Goal:** Make posts context-aware and learn user's authentic voice.

- Create `convex/ai/context-loader.ts` - loads recent entries, project history
- Inject context into agent prompts
- Create `convex/ai/style-analyzer.ts` - infers tone/phrases from transcripts
- Auto-update style profile after each voice entry
- Create `app/t/[teamSlug]/settings/style/page.tsx` for manual style editing

### Phase 6 - Agent Interaction UI (3 hours)

**Goal:** Build the playful, character-driven post generation experience.

- Create `components/agents/agent-selector.tsx` - pick single agent or "all"
- Create `components/agents/agent-chat.tsx` - chat interface for refinement
- Create `components/posts/platform-tabs.tsx` - tabs showing each agent's output
- Create `components/posts/post-preview.tsx` - shows generated content with agent branding
- Create `components/posts/copy-button.tsx` - one-click copy with success feedback
- Create `components/posts/tone-selector.tsx` - quick tone adjustments
- Build `app/t/[teamSlug]/entry/[entryId]/page.tsx` - voice entry detail with all agent outputs
- Add regenerate functionality per agent

### Phase 7 - Polish and Demo Readiness (2 hours)

**Goal:** Production-quality UX, delightful interactions.

- Add loading skeletons with agent-colored accents
- Implement error boundaries with friendly agent error messages
- Add toast notifications (existing shadcn component)
- Mobile-responsive recording and agent UI
- Keyboard shortcuts: spacebar to record, escape to cancel
- Create onboarding empty state with agent introductions
- Add subtle animations for agent interactions (typing indicator, generation progress)

---

## 5. Boilerplate Mapping

### Keep and Adapt

- [`convex/schema.ts`](convex/schema.ts) - Add new tables, keep `users`
- [`convex/functions.ts`](convex/functions.ts) - Keep custom wrappers with viewer context
- [`app/t/[teamSlug]/layout.tsx`](app/t/[teamSlug]/layout.tsx) - Keep structure, update nav
- [`app/ConvexClientProvider.tsx`](app/ConvexClientProvider.tsx) - Keep as-is
- [`components/ui/*`](components/ui/) - Use all shadcn components
- [`lib/utils.tsx`](lib/utils.tsx) - Keep `cn()` helper

### Remove Entirely

- `app/layouts/*` - Demo layouts
- `app/t/[teamSlug]/MessageBoard.tsx` - Example feature
- `convex/users/teams/messages.ts` - Example feature
- `as` table in schema - Test table

### Simplify

- Consider simplifying `/t/[teamSlug]/ `to `/dashboard/` since we're user-centric not team-centric
- Move relevant Convex functions from `convex/users/teams/` to root `convex/`

---

## 6. Risks and Mitigations

| Risk | Mitigation |

|------|------------|

| Browser mic permissions | Clear permission prompts, fallback instructions |

| ElevenLabs STT latency (2-10s) | Progress indicator with agent waiting animation |

| OpenAI API costs | Token tracking, cache similar requests |

| Audio file size | Max 5 min recording, compress before upload |

| Rate limiting | Exponential backoff, queue system |

---

## 7. Confidence Level: 98%

This plan is highly actionable because:

- Clear separation of concerns across 8 focused phases
- Each phase builds on the previous with minimal dependencies
- Leverages existing boilerplate (Clerk auth, Convex patterns, shadcn UI)
- Agent character system is well-defined and implementable
- All external APIs (ElevenLabs, OpenAI) have clear integration points
- Chat refinement adds value without blocking core flow

**Remaining 2% uncertainty:**

- ElevenLabs STT exact API response format (will confirm in Phase 3)
- OpenAI function calling vs. standard completion choice (will decide in Phase 4)

---

## Estimated Timeline

| Phase | Duration | Cumulative |

|-------|----------|------------|

| Phase 0 | 30 min | 30 min |

| Phase 1 | 2 hours | 2.5 hours |

| Phase 2 | 3 hours | 5.5 hours |

| Phase 3 | 2 hours | 7.5 hours |

| Phase 4 | 4 hours | 11.5 hours |

| Phase 5 | 2 hours | 13.5 hours |

| Phase 6 | 3 hours | 16.5 hours |

| Phase 7 | 2 hours | 18.5 hours |

**Total: ~18-20 hours of focused work**