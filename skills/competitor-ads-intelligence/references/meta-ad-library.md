# Meta Ad Library: access and scope

Checked against [Meta's Ad Library API documentation](https://www.facebook.com/ads/library/api/) and the [public Ad Library](https://www.facebook.com/ads/library/) on 2026-10-10. Recheck before changing API calls or making a geographic coverage claim.

- The API supports ads about social issues, elections, or politics delivered worldwide in the past seven years. For **ordinary commercial ads**, it supports ads delivered to the EU or UK during the past year. Meta directs worldwide active-ad searches to the public Ad Library UI.
- API access requires a Facebook account, identity/location confirmation, a Meta for Developers account, an app, and an access token. The customer supplies and pays for any account access; Ekos does not bundle a token.
- The API endpoint is `https://graph.facebook.com/<API_VERSION>/ads_archive`. For commercial research, use `ad_type=ALL`, a required EU/UK `ad_reached_countries`, and either verified `search_page_ids` or a `search_terms` query. `ad_active_status=ACTIVE` narrows to active ads. The bundled script only accepts EU member states or `GB` for this mode so it does not silently return a misleading non-EU sample.
- Available creative fields include `ad_creative_bodies`, link titles/descriptions, `page_id`, `page_name`, delivery dates, platforms, and `ad_snapshot_url`. An API snapshot URL may contain an access token; do not publish or log it. The bundled script omits it. For visual review, inspect the ad through an authorized session or the public Library.
- Ordinary commercial ads do **not** have Meta's political-ad spend and impression ranges. EU/UK reach fields may exist, but are not a conversion or ROAS measure. Do not rank ads as “winners” from longevity or repeated variants alone.
- Meta's data, media, and storage terms apply. Use the ad creative for analysis and cite the original ad; do not bulk-download or redistribute a competitor's creative assets in a paid pack.

If the user has no API token, research can still be useful with manually inspected active ads. Report the mode, date, geography, and sample size so the brief remains honest.
