# Ekos Leads

The skill that turns your agent into an AI GTM engineer.

Works in Claude (claude.ai and desktop), Claude Code, ChatGPT, Grok, Codex, Cursor and OpenClaw.

## What it does

1. **Breaks your ICP into segments.** One broad market becomes clear segments, each with its own buyers.
2. **Builds your champions.** For every segment, the people who actually decide and buy.
3. **Checks buying signals across hiring, funding, leadership changes, engagement, intent and company changes,** so you reach people at the right moment.
4. **Finds decision-makers from many data sources.** With LinkedIn, and email and phone when found.
5. **Checks their fit.** Every lead is checked against your brief before it reaches you.
6. **Connects your LinkedIn for warm-up and outreach.** It warms up your account, then sends your sequence from it at safe daily limits, stops when someone replies and reports back.

Your agent asks before anything that spends credits or sends a message.

## What you can ask

- "Find me 20 founders in Berlin who run agencies with 11 to 50 people."
- "Who are my best leads this week, and why?"
- "Start a LinkedIn campaign for the top 10 and show me the messages first."
- "How is my outreach doing? Who replied?"

## Install the skill

Install only the ekos-leads skill from Ekos-Labs/skills. You don't need the rest of the collection. For Claude Code:

```bash
git clone --depth 1 https://github.com/Ekos-Labs/skills.git /tmp/ekos-skills
mkdir -p ~/.claude/skills
cp -r /tmp/ekos-skills/skills/ekos-leads ~/.claude/skills/
```

For other agents, copy just the `skills/ekos-leads` folder into that agent's skills folder. See the [install guide](https://www.ekoslabs.com/skills/install) for each agent.

## Setup (about a minute)

Ask your agent "Find me leads". It connects you:

- **Claude Code:** it offers to run `claude mcp add --transport http -s user ekos https://app.ekoslabs.com/mcp`. Then type `/mcp`, pick **ekos**, choose **Authenticate**.
- **Claude (claude.ai or desktop):** Customize, Connectors, **Add**, **Add custom connector**, paste `https://app.ekoslabs.com/mcp`, **Connect**.
- **ChatGPT, Grok, Grok Bot, Codex, Cursor, OpenClaw:** the agent gives you the two or three steps for your app.

Then sign in to Ekos with your email and press **Allow**. Signing in creates your account. Your agent sets up your brief in the chat (what you sell, who buys it, where) and starts your 5 free leads. No API key, nothing to paste back.

Step-by-step pictures for every app: [app.ekoslabs.com/app/agent](https://app.ekoslabs.com/app/agent).

## What it costs

| | |
| --- | --- |
| First 5 leads | Free |
| More leads | From credits you top up (from $39). 1 credit = $1 |
| Connecting LinkedIn | Free |
| Monthly fee | None |

## Safety

- You don't need any other API keys or data accounts. Ekos does the searching on its side.
- Your key stays in your agent's config. The skill never asks you to paste it into chat or into a project file.
- Nothing is spent and nothing is sent on LinkedIn without your clear yes, every time.
- Messages go out under your name, at daily limits that keep your LinkedIn account safe.

## Need help?

Use **Talk to us** in the app, or [book a call](https://www.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads_readme_support). Ekos can also run the whole thing for you as a done-for-you service.

Files: [`SKILL.md`](SKILL.md) is what your agent reads. [`release.json`](release.json) holds the version.
