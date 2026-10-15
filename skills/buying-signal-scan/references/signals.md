# Signal guide

| Signal | Why it matters | Default weight |
| --- | --- | --- |
| Hiring for a role that owns the problem | Budget and a new owner | 3 |
| Funding round in the last 90 days | Budget and pressure to grow | 3 |
| New technology adopted that pairs with the product | Integration point | 2 |
| Competitor technology dropped | Switching moment | 3 |
| New leader in the buying function | New owner reviews tools | 2 |
| Expansion (new office, market, product) | New needs | 1 |
| Layoffs or cost cutting | Usually lowers priority, unless the product saves cost | -1 / +1 |

Recency multiplier: under 30 days x1.5, 30 to 60 days x1.0, 60 to 90 days x0.6.

PredictLeads endpoints: /companies/{domain}/job_openings, /companies/{domain}/news_events, /companies/{domain}/technology_detections. Authenticate with the `X-Api-Key` and `X-Api-Token` headers.
