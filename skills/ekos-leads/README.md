# Ekos Leads

The skill that turns your agent into an AI GTM engineer.

Works in Claude Code, Codex, Cursor and Claude Desktop.

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

## Setup (about 2 minutes)

1. **Open the start link:** [app.ekoslabs.com/app/start](https://app.ekoslabs.com/app/start?src=skill&utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads_readme). Enter your website.
2. **Confirm your brief.** Ekos writes it for you (what you sell, who buys it, where). Your 5 free leads start as soon as you confirm it.
3. **Verify your email.**
4. **Copy the one setup command the app shows** for your agent and run it. In Claude Code, run it in your own terminal so your key never goes through chat.
5. **Restart your agent.**
6. **Paste the prompt the app gives you:**

   ```text
   Ekos is connected. Check my setup and show me the status of my first five leads.
   ```

   Your agent checks your setup and tells you where your free leads are. You also get an email when they land.

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
