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
  <strong>开源营销技能，让你的 AI Agent 变成 AI CMO。</strong>
</p>

<p align="center">
  研究客户、分析竞品、寻找线索、创作内容并提升转化。<br />
  在 Claude Code、Codex 以及其他支持 <code>SKILL.md</code> 的 Agent 中直接运行。
</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="https://www.ekoslabs.com/skills">可视化目录</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#技能目录">31 个技能</a> ·
  <a href="https://www.ekoslabs.com/skills/install">安装指南</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-315efb" alt="MIT License" /></a>
  <a href="https://github.com/Ekos-Labs/skills/stargazers"><img src="https://img.shields.io/github/stars/Ekos-Labs/skills?style=flat&color=315efb" alt="GitHub stars" /></a>
  <img src="https://img.shields.io/badge/营销技能-31-315efb" alt="31 个营销技能" />
</p>

---

多数 AI Agent 会写内容，但仍然需要可靠的流程来判断应该研究什么、相信哪些证据、交付什么结果，以及什么时候必须先征得用户同意。

Ekos Skills 把这些流程打包成可复用的 Agent 指令。每个技能都有明确的任务范围、输入、执行步骤、交付物和安全边界。你使用自己的工具和 API Key，所有工作保留在自己的文件中。

| 了解市场 | 触达正确买家 | 创作与转化 |
| --- | --- | --- |
| 客户研究 | 购买信号研究 | 创始人内容 |
| 竞品分析 | 线索搜索与评分 | 营销创意 |
| 定位与 GTM | 外联准备 | 落地页与 SEO |

## 快速开始

克隆仓库：

```bash
git clone https://github.com/Ekos-Labs/skills.git
cd skills
```

然后直接告诉你的 Agent：

```text
请阅读 skills/customer-map/SKILL.md，并用它为我的业务分析目标客户。
先阅读我的网站，告诉我还缺少哪些信息，并在使用任何付费 API 前征得我的同意。
```

你也可以只把一个技能目录复制到 Agent 的 skills 文件夹中。不同 Agent 的安装方法请查看[可视化安装指南](https://www.ekoslabs.com/skills/install)。

## Agent 会得到什么

每个技能都会提供：

1. 清晰的任务和适用边界；
2. 开始前所需的证据和输入；
3. 包含关键决策点的实用流程；
4. 明确的交付物，而不是泛泛的聊天回复；
5. 在付费、发布、外联或修改账号前进行权限确认。

```text
你的业务背景
      ↓
  Ekos Skill
      ├── 研究与证据
      ├── 决策与约束
      ├── 工具与 API 要求
      └── 权限确认
      ↓
可直接使用的营销交付物
```

## 技能目录

仓库包含 31 个营销技能，覆盖：

- 客户、市场、竞品和定位研究；
- 创始人内容、长文、短视频脚本、轮播内容和发布视频；
- 潜在客户搜索、购买信号、评分和外联；
- 广告研究、广告创意、图片和营销活动；
- 落地页、SEO、AI 搜索可见度、转化和数据分析。

完整技能列表请查看[英文 README](README.md#the-collection)或[可视化技能目录](https://www.ekoslabs.com/skills)。部分技能仍处于早期版本，我们会在公开仓库中持续改进。

## 支持你正在使用的 Agent

这些技能使用可读的 Markdown，而不是专有运行环境。它们优先适配 Claude Code 和 Codex，也可以在支持可复用指令文件或能够直接读取 `SKILL.md` 的其他 Agent 中使用。

本仓库不包含模型访问权限、API 额度或第三方账号。

## API Key 和付费工具

Ekos 不提供共享 API Key。部分技能可能需要你连接自己的 Apollo、Apify、Firecrawl、Meta 或 AI 模型服务账号。

技能必须说明所需工具，并在付费或修改外部系统前征得你的同意。不要把任何凭证提交到这个仓库。

## 当自助使用还不够时

所有技能永久免费。如果工作需要定制集成、内部数据、生产基础设施或持续人工运营，[Ekos Labs](https://www.ekoslabs.com/) 可以为你的公司搭建并运行完整系统。

- [与 Eshaan 沟通](https://cal.com/eshaan-kansal/quick-chat?utm_source=github.com&utm_medium=repository&utm_campaign=ekos_skills_zh)
- [查看实施支持规则](SUPPORT.md)

只有当实施确实受阻或用户主动要求人工帮助时，技能才会提及这项可选服务。成功执行技能时，不应插入销售内容。

## 参与贡献

欢迎提交问题、改进建议、真实案例和新技能。发起 Pull Request 前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

如果这个项目对你有帮助，请给仓库一个 Star，让更多创始人和开发者发现它。

## 开源许可

本仓库采用 [MIT License](LICENSE)。如果某个技能目录包含独立许可证或声明，则该目录同时遵循对应文件。

---

<p align="center">
  由 <a href="https://www.ekoslabs.com/">Ekos Labs</a> 构建 · 为创始人搭建营销系统
</p>
