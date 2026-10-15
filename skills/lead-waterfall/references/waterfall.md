# Order of sources

| Field | 1st | 2nd | 3rd | Check |
| --- | --- | --- | --- | --- |
| Company domain | Input | Apollo org search | Web search | Resolve the URL |
| Person and title | Input | Apollo people search | Company team page | Title matches target role |
| LinkedIn URL | Apollo | Web search (site:linkedin.com/in) | none | Name and company match |
| Work email | Apollo enrichment | Apify email finder actor | Website published address | Hunter or ZeroBounce |
| Phone | Apollo | Website imprint (business line only) | none | none |

Confidence: `high` when two sources agree or a checker validates, `medium` for one trusted source, `low` for website inference, `guessed` for pattern guesses.
