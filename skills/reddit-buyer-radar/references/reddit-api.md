# Reddit API notes

- Create a "script" app at https://www.reddit.com/prefs/apps. The client ID is under the app name; the secret is labelled "secret".
- App-only token: POST https://www.reddit.com/api/v1/access_token with HTTP basic auth (client ID, secret) and body `grant_type=client_credentials`. Use the token against https://oauth.reddit.com.
- Search: GET /search?q=<query>&sort=new&t=month&limit=100, or /r/<sub>/search?restrict_sr=1&q=...
- Always send a unique User-Agent, for example `platform:ekos-radar:v0.1 (by /u/<username>)`.
- Free-tier rate limit is about 100 queries per minute per client ID. Back off on HTTP 429.
- Check each subreddit's rules (GET /r/<sub>/about/rules) before suggesting a reply that mentions a product.
