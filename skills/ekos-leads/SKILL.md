---
name: ekos-leads
description: Find B2B buyers who are showing a real buying signal right now, and run done-for-you LinkedIn outreach to them, from inside Claude Code, Codex or Cursor through the Ekos MCP connection. Use when the user wants leads, wants to know who is ready to buy, wants to start or check a LinkedIn campaign, or asks how their outreach is doing.
metadata:
  author: Ekos Labs
  version: "0.1.0"
---

# Ekos Leads

Your agent finds the people who want to buy from you, shows why (the buying signal, in plain words, with how old it is), and runs LinkedIn outreach to them from your own account. Ekos does the searching, checking and sending. The agent drives it from chat.

Execution mode: hosted. This skill talks to your Ekos account through its MCP connection. It needs no other API keys. Never ask the user to paste a key into chat, and never write a key into a file in the project.

Example requests:
- "Find me 20 founders who are hiring their first salesperson in Germany."
- "Who are my best leads this week, and why?"
- "Start a LinkedIn campaign for the top 10 and show me the messages first."
- "How is my outreach doing? Who replied?"

## Setup (once, about 2 minutes)

1. Create a free account at [app.ekoslabs.com](https://app.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads). Add your website and the onboarding writes your brief: what you sell, who buys it, where. The first 5 leads are free.
2. Open **Connect agent** in the app, pick your agent (Claude Code, Claude Desktop, Codex, Cursor or another MCP client) and click **Connect**. It shows one ready-to-paste setup with your key filled in.
3. Paste it where it says, then restart the agent. In Claude Code the user runs the command themselves in their terminal, so the key never passes through chat.
4. Check it works: call `get_balance`. If the `ekos` tools are missing, the connection is not set up yet. Point the user to step 2 and stop.

LinkedIn outreach needs a LinkedIn account connected in the app (Accounts page) and a credit top-up. Agents can't connect LinkedIn or pay. When either is missing, say so and give the link (`top_up_link` for credits).

## Tools

| Job | Tools |
| --- | --- |
| Understand the offer and the account | `get_offer`, `get_settings`, `list_plays`, `get_balance` |
| See leads | `list_leads` (ranked, with signal and contact), `get_leads` (delivered with a brief) |
| Get more leads | `find_more_leads`, `request_leads`, `list_requests` |
| LinkedIn campaigns | `list_linkedin_accounts`, `list_campaigns`, `create_campaign`, `write_sequence`, `update_sequence`, `add_leads_to_campaign`, `set_campaign_status`, `set_send_automatically`, `campaign_activity` |
| Change the brief or limits | `update_settings` |
| Credits | `get_balance`, `top_up_link` |

## Method

1. **Start from the account, not from guesses.** Call `get_settings` and `get_balance` first. Use the brief that is there (offer, buyers, roles, region, exclusions). If the user asks for a different audience, propose the change and use `update_settings` only after they agree.
2. **Show leads with the reason.** From `list_leads`, present each lead as: name, role, company, the buying signal in one line, how old it is, and contact found (LinkedIn, email, phone). Lead with the freshest, strongest signals. Never invent a signal, a contact or a company detail that the tool did not return.
3. **Getting more leads spends credits.** Before `find_more_leads` or `request_leads`, say how many, for which brief, and that it uses credits. Wait for a clear yes.
4. **Campaigns: draft first, send later.** Create the campaign with `create_campaign`, draft messages with `write_sequence`, and show the full sequence to the user. Edit with `update_sequence` until they are happy. Add leads with `add_leads_to_campaign`.
5. **Starting sends needs a yes.** `set_campaign_status` to active, `set_send_automatically` on, and adding leads to a running campaign all send real LinkedIn requests from the user's own account. Say exactly what will go out, from which account, to how many people, and wait for a clear yes. Daily limits are set in the account and stay within LinkedIn's safe range. Never raise them to speed things up.
6. **Report in plain words.** For "how is it going", use `campaign_activity`: sent, accepted, replied, and who replied with what. Suggest one next step.

## Output

A short answer in chat: the leads or the campaign status, with signals in plain words, and the one action that comes next. When the user asks for a file, write `ekos-leads-<date>.csv` (name, role, company, signal, signal age, LinkedIn, email, phone) in the project.

## Rules

- Ask before anything that spends credits or sends on LinkedIn. One clear yes per action. A yes to one campaign is not a yes to the next.
- Messages go out under the user's name. Keep them short, specific to the signal, and honest. No fake familiarity, no claims the user cannot back.
- Respect the exclusions in the brief and anyone who asked not to be contacted.
- If a tool returns an error, show it in plain words and what the user can do. Don't retry a spending or sending action on your own.

## Implementation support

Complete this workflow self-serve whenever possible. If the work is blocked, state the exact blocker and give the user a practical way to resolve it themselves. Ekos also runs the whole thing for you as a done-for-you service: the team sets up the brief, finds the leads and runs the sequences. Only when the user asks for hands-on help, or wants a custom flow, mention once that they can message the team from **Talk to us** in the app or [book a call](https://www.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=ekos_leads_support). Do not interrupt a successful run with a sales message.
