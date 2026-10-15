# Image providers

| Provider | Env var | Notes |
| --- | --- | --- |
| Black Forest Labs (FLUX) | BFL_API_KEY | POST https://api.bfl.ai/v1/<model> (e.g. flux-pro-1.1), then poll the returned polling_url. Width and height in multiples of 32. Supports seed. |
| OpenAI gpt-image | OPENAI_API_KEY | POST https://api.openai.com/v1/images/generations, model gpt-image-1; sizes 1024x1024, 1536x1024, 1024x1536. Upscale or crop for other sizes. |
| Google Nano Banana | GEMINI_API_KEY | Gemini image model via generateContent with an image output modality; good for edits with a reference image. |
| fal.ai | FAL_KEY | Hosts FLUX and other models; use the queue API and poll for the result. |
| Higgsfield | HIGGSFIELD_API_KEY | Image and video models; check the current API docs for endpoints and pricing. |

Check each provider's current pricing and terms before a run; they change often.
