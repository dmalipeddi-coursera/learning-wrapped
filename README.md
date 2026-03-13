# Learning Wrapped 2026

**Coursera Agentic Build Day Hackathon** | Theme: *Learning Shouldn't Feel Like Work*

A Spotify Wrapped-style experience that turns a learner's annual Coursera activity into a personal, shareable story. Nine animated cards reveal stats, insights, and a learning personality, making reflection feel fun rather than like a report card.

**Live Demo**: [dmalipeddi-coursera.github.io/learning-wrapped](https://dmalipeddi-coursera.github.io/learning-wrapped/)

## Why This Exists

Year-end recaps work because they reframe data as a narrative. Spotify Wrapped doesn't show you a spreadsheet; it tells you a story. Learning Wrapped applies that same idea to education: instead of "you completed 9 courses," it says "Look what you built" and connects the dots between skills.

**How it maps to the theme:**
- Stats are presented as personal insights, not metrics ("That's 6 full days of growth")
- A learning personality quiz result (Night Owl, Early Bird, etc.) makes it feel personal
- The Knowledge Constellation visualizes how skills connect, turning a course list into a journey
- Shareable card at the end encourages social sharing, reinforcing that learning is something to celebrate

## The Experience

| Card | What it shows |
|------|--------------|
| Hook | Personalized greeting with the learner's name |
| Total Hours | Animated counter with a relatable comparison |
| Courses | Course list with colored category pills |
| Peak Time | Radial clock showing when you learn best |
| Constellation | Interactive skill graph showing topic connections |
| Personality | Learning personality type with community stats |
| Fun Stat | Quiz answers with a witty comparison |
| Streak | GitHub-style activity heatmap |
| Share | Downloadable/shareable summary card |

## Tech Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** with Coursera Design System (CDS) tokens
- **Framer Motion 12** for all animations
- **html-to-image** for shareable PNG export
- **canvas-confetti** for celebration effects
- **GitHub Pages** for deployment

## Accessibility

- Skip-to-content link
- ARIA live region announces card changes to screen readers
- Full keyboard navigation (arrow keys, Escape to exit)
- `prefers-reduced-motion` disables all custom animations
- Semantic HTML with proper roles and labels
- Focus management when story starts

## Running Locally

```bash
npm install
npm run dev
```

## Building and Deploying

```bash
npm run build      # Build to dist/
npm run deploy     # Build + deploy to GitHub Pages
```

## Project Structure

```
src/
  components/
    cards/          # 9 story cards (HookCard, TotalHoursCard, etc.)
    story/          # StoryPlayer orchestrator
    ui/             # ProgressDots, GradientBackground
  data/             # Demo profiles, personality definitions
  hooks/            # useStory, useAnimatedCounter
  utils/            # Share image utilities
  types.ts          # TypeScript interfaces
```

## Built With

This project was built entirely during the Agentic Build Day hackathon using Claude Code as the AI pair programmer, from initial scaffold to final polish.
