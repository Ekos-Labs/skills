<p align="center">
  <a href="https://www.ekoslabs.com/skills">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://www.ekoslabs.com/brand/wordmark-white.png" />
      <source media="(prefers-color-scheme: light)" srcset="https://www.ekoslabs.com/brand/wordmark-black.png" />
      <img src="https://www.ekoslabs.com/brand/wordmark-black.png" alt="Ekos Labs" width="190" />
    </picture>
  </a>
</p>

<h1 align="center">Ekos Skills</h1>

<p align="center">
  <strong>Open-source marketing skills that turn your AI agent into an AI CMO.</strong>
</p>

<p align="center">
  Research customers. Study competitors. Find leads. Create content. Improve conversion.<br />
  Run the work inside Claude Code, Codex, and other agents that can read <code>SKILL.md</code> files.
</p>

<p align="center">
  <a href="https://www.ekoslabs.com/skills">Visual catalog</a> ·
  <a href="#quick-start">Quick start</a> ·
  <a href="#the-collection">31 skills</a> ·
  <a href="https://www.ekoslabs.com/skills/install">Install guide</a> ·
  <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-315efb" alt="MIT License" /></a>
  <a href="https://github.com/Ekos-Labs/skills/stargazers"><img src="https://img.shields.io/github/stars/Ekos-Labs/skills?style=flat&color=315efb" alt="GitHub stars" /></a>
  <img src="https://img.shields.io/badge/marketing_skills-31-315efb" alt="31 marketing skills" />
  <img src="https://img.shields.io/badge/Claude_Code_%2B_Codex-compatible-315efb" alt="Claude Code and Codex compatible" />
</p>

---

Most AI agents can write. They still need a reliable process for deciding what to research, which evidence to trust, what to produce, and when to ask before taking action.

Ekos Skills packages those processes as reusable agent instructions. Each skill defines a focused marketing job, its inputs, its workflow, its output, and its safety boundaries. Bring your own tools and API keys. Keep the work in your own files.

| Understand the market | Reach the right buyers | Create and convert |
| --- | --- | --- |
| Customer research | Buying-signal research | Founder content |
| Competitor analysis | Lead sourcing and scoring | Campaign creative |
| Positioning and GTM | Outreach preparation | Landing pages and SEO |

## Quick start

Clone the collection:

```bash
git clone https://github.com/Ekos-Labs/skills.git
cd skills
```

Then give your agent one direct instruction:

```text
Read skills/customer-map/SKILL.md and use it to map the customers for my business.
Read my website first. Tell me what information is missing, and ask before using any paid API.
```

You can also copy one skill directory into the skills folder used by your agent. See the [visual install guide](https://www.ekoslabs.com/skills/install) for agent-specific instructions.

## What your agent gets

Every skill is designed to make the output more useful than a generic prompt:

1. A clear job and activation boundary.
2. The evidence and inputs required before work begins.
3. A practical workflow with explicit decision points.
4. A defined deliverable instead of an open-ended chat response.
5. Permission checks before paid tools, publishing, outreach, or account changes.

```text
Your business context
        ↓
    Ekos Skill
        ├── research and evidence
        ├── decisions and constraints
        ├── tool and API requirements
        └── permission checks
        ↓
 A usable marketing deliverable
```

## The collection

| Research and strategy | Content and creative | Leads and outreach | Web, SEO, and analytics |
| --- | --- | --- | --- |
| [AI CMO Router](skills/ai-cmo-router) | [Founder Content Engine](skills/founder-content-engine) | [Buying Signal Scan](skills/buying-signal-scan) | [AI Search Visibility](skills/ai-search-visibility) |
| [Product Context](skills/product-context) | [Long-form Article Writer](skills/long-form-article-writer) | [ICP Lead List with Apollo](skills/icp-lead-list-apollo) | [Conversion Review](skills/conversion-review) |
| [Customer Map](skills/customer-map) | [Short-form Script Studio](skills/short-form-script-studio) | [Local Business Leads with Apify](skills/local-business-leads-apify) | [Landing Page Builder](skills/landing-page-builder) |
| [Competitor Dossier](skills/competitor-dossier) | [Carousel Studio](skills/carousel-studio) | [Lead Waterfall](skills/lead-waterfall) | [SEO Content Refresh](skills/seo-content-refresh) |
| [Competitor Ads Intelligence](skills/competitor-ads-intelligence) | [Campaign Image Studio](skills/campaign-image-studio) | [Lead Scoring](skills/lead-scoring) | [Deliverability Check](skills/deliverability-check) |
| [Positioning Fix](skills/positioning-fix) | [Ad Creative Variants](skills/ad-creative-variants) | [Outreach Sequence Writer](skills/outreach-sequence-writer) | [Distribution Report](skills/distribution-report) |
| [Reddit Buyer Radar](skills/reddit-buyer-radar) | [Launch Film Builder](skills/launch-film-builder) | [Outreach Launcher](skills/outreach-launcher) | [Reel Analyzer](skills/reel-analyzer) |
| [Pre-call Brief](skills/pre-call-brief) | [Idea Gate](skills/idea-gate) |  | [Voice Match](skills/voice-match) |

The repository currently contains 31 skills. Some are early releases and are being improved in public. Read a skill's requirements and limitations before running it.

## Works with the agent you already use

The skills use readable Markdown rather than a proprietary runtime. They are built first for Claude Code and Codex, and can work with other agents that support reusable instruction files or can be told to read a `SKILL.md` directly.

The repository does not include model access, API credits, or third-party accounts.

## API keys and paid tools

Ekos does not provide shared API keys. A skill may ask you to connect your own account for services such as Apollo, Apify, Firecrawl, Meta, or an AI model provider.

Each skill must explain what it needs and ask before a paid or externally mutating action. Never commit credentials to this repository.

## When self-serve is not enough

The skills are free. If a workflow needs custom integrations, internal data, production infrastructure, or ongoing human operation, [Ekos Labs](https://www.ekoslabs.com/) can build and run the complete system around your company.

- [Talk to Eshaan](https://cal.com/eshaan-kansal/quick-chat?utm_source=github.com&utm_medium=repository&utm_campaign=ekos_skills)
- [Read the implementation policy](SUPPORT.md)

The skills only surface this option when implementation is genuinely blocked or the user asks for hands-on help. They should not interrupt a successful run with a sales message.

## Contributing

Bug reports, improvements, real examples, and new skills are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

If the collection helps you, star the repository. It makes the project easier for other founders and builders to discover.

## Licence

The repository is available under the [MIT Licence](LICENSE). A directory that contains its own licence or notice remains subject to that file.

---

<p align="center">
  Built by <a href="https://www.ekoslabs.com/">Ekos Labs</a> · Marketing systems for founders
</p>
