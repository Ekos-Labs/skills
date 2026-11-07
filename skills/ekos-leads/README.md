# Ekos Leads

The skill that turns your agent into an AI GTM engineer.

Works in Claude Code, Codex, Cursor and Claude Desktop.

## What it does

1. **Breaks your ICP into segments.** One broad market becomes clear segments, each with its own buyers.
2. **Builds your champions.** For every segment, the people who actually decide and buy.
3. **Checks 50+ buying signals.** Hiring, funding, new leaders, growth and more, so you reach people at the right moment.
4. **Gets leads from 30+ sources.** Decision-makers with LinkedIn, and email and phone when found.
5. **Checks their fit.** Every lead is checked against your brief before it reaches you.
6. **Connects your LinkedIn for warm-up and outreach.** It warms up your account, then sends your sequence from it at safe daily limits, stops when someone replies and reports back.

Your agent asks before anything that spends credits or sends a message.

## What you can ask

- "Find me 20 founders in Berlin who run agencies with 11 to 50 people."
- "Who are my best leads this week, and why?"
- "Start a LinkedIn campaign for the top 10 and show me the messages first."
- "How is my outreach doing? Who replied?"

## Setup (about 2 minutes)

1. **Create a free account** at [app.ekoslabs.com](https://app.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads_readme). Enter your website. Ekos writes your brief (what you sell, who buys it, where) and starts finding your 5 free leads as soon as you confirm it.
2. **Connect your agent.** In the app, open **Connect agent**, pick your agent and click **Connect**. You get one ready-to-paste setup with your key filled in.
3. **Paste it and restart your agent.** In Claude Code, run the command in your own terminal so the key never goes through chat.
4. **Add the skill.** Copy this `ekos-leads` folder into your agent's skills folder, or tell your agent:

   ```text
   Read skills/ekos-leads/SKILL.md and use it to show me my Ekos leads.
   ```

   See the [install guide](https://www.ekoslabs.com/skills/install) for each agent.

5. **Ask for your leads.** Try "Show me my leads". If your free 5 are still being found, your agent tells you, and you also get an email when they land.

## What it costs

| | |
| --- | --- |
| First 5 leads | Free |
| More leads | From credits you top up (from $39). 1 credit = $1 or €1 |
| Connecting LinkedIn | Free |
| Monthly fee | None |

## Safety

- Your key stays in your agent's config. The skill never asks you to paste it into chat or into a project file.
- Nothing is spent and nothing is sent on LinkedIn without your clear yes, every time.
- Messages go out under your name, at daily limits that keep your LinkedIn account safe.

## Need help?

Use **Talk to us** in the app, or [book a call](https://www.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads_readme_support). Ekos can also run the whole thing for you as a done-for-you service.

Files: [`SKILL.md`](SKILL.md) is what your agent reads. [`release.json`](release.json) holds the version.
