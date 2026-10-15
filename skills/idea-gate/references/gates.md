# Source and gate definitions

Adapted from Pocket CMO's [Idea Gate source at commit bfb8e8c](https://github.com/Eshaank08/pocket-cmo/blob/bfb8e8c77ecc94c7c06076bc32ffebaef564989f/src/lib/idea-gate-gates.ts), by Eshaan Kansal. The upstream project is MIT licensed. This adaptation keeps the ten binary decisions but makes their evidence explicit for an agent workflow. The original licence notice is included in this package as `LICENSE`.

| Gate | Pass when… | Fail when… |
| --- | --- | --- |
| Relevance | The idea matters to the named audience and the maker's current work. | It is a random trend pursued only for views. |
| Not overplayed | There is a distinct angle or new evidence relative to common takes. | It repeats a saturated point without a contribution. |
| Standing | The maker has direct experience, work, observation, or defensible research to speak from. | It impersonates authority the maker does not have. |
| Survives without a flex | The lesson helps even if the personal achievement is removed. | It is mainly self-congratulation. |
| Connected to work | The topic connects to what the maker actually builds, sells, researches, or does. | It is detached commentary with no credible link to their work. |
| Thought through | There is a considered mechanism, tradeoff, or reasoning. | It is an unexamined repost of someone else's opinion. |
| Only this maker | There is a specific detail, example, or insight that could not be copied by anyone. | A generic account could publish it unchanged. |
| Sendable | One can name a particular person who would benefit from seeing it and why. | It is pleasant but not useful enough to forward. |
| Spine | The idea makes a clear, honest distinction or choice. | It is safe mush that says everything and nothing. |
| Fingerprint | Wording, viewpoint, examples, or posture match the maker's real voice. | It reads as interchangeable AI copy or a borrowed persona. |

The gate evidence can come from the idea itself or source material the user supplies. Missing evidence is not a pass. A pass does not imply market validation, and the ten gates are not a statistical model.
