// What each skill's demo shows: the command, the agent's steps, and the finished result.
// All content is illustrative and uses a fictional company, "Acme", a client-reporting tool for agencies.

export type Art =
 | {kind: 'profile'; label: string; headline: string; boxes: [string, string][]; rowsLabel: string; rows: [string, number][]; chips: string[]}
 | {kind: 'table'; rowLabel: string; cols: string[]; rows: [string, ...boolean[]][]; highlight?: number; callout: [string, string]}
 | {kind: 'beforeAfter'; beforeLabel?: string; afterLabel?: string; before: string; after: string; sub: string; chips: string[]}
 | {kind: 'images'; label: string; chip: string; sizes: string[]}
 | {kind: 'film'; headline: string; beats: string[]; caption: string}
 | {kind: 'posts'; author?: string; chips: string[]; posts: [string, string][]}
 | {kind: 'bars'; label: string; rows: [string, number, string?][]; listLabel: string; list: string[]}
 | {kind: 'page'; headline: string; sub: string; cta: string}
 | {kind: 'funnel'; label: string; steps: [string, number][]; drop: number; callout: string; fixes: string[]}
 | {kind: 'leads'; label: string; file: string; cols: {h: string; w: string}[]; rows: string[][]; highlight?: number; lastIsChip?: boolean; footer: string[]}
 | {kind: 'checklist'; label: string; items: [string, boolean, string?][]; verdict: string}
 | {kind: 'doc'; file: string; title: string; badge?: string; sections: [string, string][]}
 | {kind: 'threads'; label: string; items: [string, string, string, string][]}
 | {kind: 'plan'; constraint: string; why: string; next: string[]; ignore: string[]}
 | {kind: 'sequence'; steps: [string, string, string, string][]; note: string}
 | {kind: 'script'; label: string; length: string; lines: [string, string][]}
 | {kind: 'reel'; hook: string; rows: [string, string][]}
 | {kind: 'carousel'; label: string; slides: string[]}
 | {kind: 'ads'; label: string; ads: [string, string][]; testFirst: string};

export type Demo = {
 /** what the user types in the chat style */
 ask: string;
 command: string;
 agent: 'claude' | 'codex';
 steps: [string, string, string];
 done: string;
 art: Art;
};

const leadCols = [{h: 'Name', w: '1.1fr'}, {h: 'Company', w: '1fr'}, {h: 'Title', w: '1fr'}, {h: 'Source', w: '.9fr'}];

export const DEMOS: Record<string, Demo> = {
 'product-context': {
  ask: 'Learn my business so every skill knows it.', command: '/product-context acme.io', agent: 'claude',
  steps: ['Reading acme.io and your docs', 'Finding what is still missing', 'Asking you 3 quick questions'], done: 'context.md saved',
  art: {kind: 'doc', file: 'context.md', title: 'Acme, in one page', badge: 'Read by every skill', sections: [
   ['Product', 'Client reporting for agencies, built from live data.'], ['Buyer', 'Ops leads at 10 to 50 person agencies.'], ['Offer', 'Client reports in ten minutes, not a week.'], ['Proof', 'Three agency case studies, 4.8 on G2.'], ['Voice', 'Plain, direct, no jargon.']]},
 },
 'ai-cmo-router': {
  ask: 'What should I fix first to grow?', command: '/ai-cmo', agent: 'codex',
  steps: ['Reading your context and numbers', 'Finding the real constraint', 'Choosing the next skills'], done: 'plan.md saved',
  art: {kind: 'plan', constraint: 'The message, not the channel.', why: 'Traffic is fine. Visitors do not understand what Acme does in five seconds.', next: ['Positioning Fix', 'Landing Page Builder', 'Outreach Sequence Writer'], ignore: ['Paid social', 'SEO for now']},
 },
 'distribution-report': {
  ask: 'Build the full distribution report for acme.io.', command: '/distribution-report acme.io', agent: 'claude',
  steps: ['Sizing the market from published sources', 'Matching channels to your buyer', 'Simulating 400 buyer reactions'], done: 'report.pdf saved, 10 pages',
  art: {kind: 'bars', label: 'Channel fit for Acme', rows: [['Founder posts on LinkedIn', 92], ['Cold email to agencies', 80], ['Agency communities', 66], ['Partner integrations', 48], ['Paid social', 24]], listLabel: 'First moves', list: ['Post 3 reporting teardowns a week', 'Email 20 agency ops leads', 'Join two agency owner communities']},
 },
 'positioning-fix': {
  ask: 'My homepage is not landing. Fix the positioning.', command: '/positioning-fix acme.io', agent: 'codex',
  steps: ['Reading your homepage', 'Matching it to your best buyer', 'Rewriting the hierarchy'], done: 'positioning.md saved',
  art: {kind: 'beforeAfter', before: 'The all in one workspace for modern teams', after: 'Client reports, done in ten minutes.', sub: 'For agencies tired of chasing data every Friday.', chips: ['Lead with the outcome', 'Proof above the fold', 'Cut 3 vague claims']},
 },
 'customer-map': {
  ask: 'Who is my real buyer?', command: '/customer-map acme.io', agent: 'claude',
  steps: ['Reading acme.io', 'Scanning reviews and threads', 'Clustering buyer jobs'], done: 'customer-map.md saved',
  art: {kind: 'profile', label: 'Primary buyer', headline: 'Ops lead at a 10 to 50 person agency', boxes: [['Job to be done', 'Ship client reports without chasing data'], ['Uses today', 'Spreadsheets and late nights']], rowsLabel: 'Segments to test first', rows: [['Agency ops leads', 92], ['Freelance analysts', 70], ['In-house marketing', 48]], chips: ['source: G2 review', 'source: Reddit thread']},
 },
 'competitor-dossier': {
  ask: 'How do we compare to our competitors?', command: '/competitor-dossier acme.io', agent: 'codex',
  steps: ['Finding who buyers compare you with', 'Reading pricing and proof pages', 'Mapping open positions'], done: 'dossier.md saved',
  art: {kind: 'table', rowLabel: 'Compared on', cols: ['Acme', 'Rival A', 'Rival B'], rows: [['Free trial', true, true, false], ['Case studies', false, true, true], ['Pricing on site', true, false, true], ['Done-for-you setup', false, false, false]], highlight: 3, callout: ['Open position', 'Nobody offers done-for-you setup. Own it.']},
 },
 'reddit-buyer-radar': {
  ask: 'Find people on Reddit who need what we sell.', command: '/reddit-radar', agent: 'claude',
  steps: ['Searching 14 subreddits', 'Filtering out noise and promos', 'Ranking threads by fit'], done: '12 live threads found',
  art: {kind: 'threads', label: 'Live threads, ranked by fit', items: [['r/agency', 'How do you handle client reporting without losing every Friday?', '2h · 48 comments', 'Strong fit'], ['r/marketing', 'Any tool that pulls GA4 and Meta into one client report?', '5h · 31 comments', 'Strong fit'], ['r/smallbusiness', 'Our agency spends a full day a week on reports. Normal?', '1d · 22 comments', 'Good fit']]},
 },
 'buying-signal-scan': {
  ask: 'Which accounts should I contact this week?', command: '/buying-signals accounts.csv', agent: 'codex',
  steps: ['Checking funding and hiring', 'Reading job posts and news', 'Ranking who is ready now'], done: 'signals.csv saved',
  art: {kind: 'leads', label: 'Contact this week', file: 'signals.csv', lastIsChip: true, highlight: 0, cols: [{h: 'Account', w: '1fr'}, {h: 'Signal', w: '1.6fr'}, {h: 'When', w: '.6fr'}, {h: 'Score', w: '.7fr'}], rows: [['Northwind', 'Hiring a head of client ops', '3 days', '94'], ['Brightlane', 'Raised a seed round', '1 week', '88'], ['Studio Kite', 'Switched from Looker Studio', '2 weeks', '81'], ['Fernway', 'Opened a second office', '3 weeks', '72']], footer: ['Source: PredictLeads', 'Opening line per account']},
 },
 'pre-call-brief': {
  ask: 'Prep me for my 2pm call with Northwind.', command: '/pre-call-brief northwind.studio', agent: 'claude',
  steps: ['Researching the company', 'Pulling recent changes', 'Writing your questions'], done: 'brief.md saved',
  art: {kind: 'doc', file: 'brief-northwind.md', title: 'Northwind Studio, call at 14:00', badge: 'One page', sections: [['What they do', '25 person performance agency, mostly ecommerce clients.'], ['What changed', 'Hiring a head of client ops, posted 3 days ago.'], ['Likely pain', 'Reports built by hand in Google Slides.'], ['Ask', 'How many hours a week go into reporting today?']]},
 },
 'icp-lead-list-apollo': {
  ask: 'Build me a lead list of agency ops leads in the UK.', command: '/icp-lead-list --region UK', agent: 'codex',
  steps: ['Writing Apollo filters from your ICP', 'Running the free people search', 'Enriching the 25 you approved'], done: 'leads.csv saved, 25 credits used',
  art: {kind: 'leads', label: 'Approved and enriched', file: 'leads.csv', lastIsChip: true, cols: leadCols, rows: [['Maya Patel', 'Northwind', 'Head of Ops', 'Apollo'], ['Tom Reyes', 'Brightlane', 'Ops Director', 'Apollo'], ['Ines Novak', 'Studio Kite', 'COO', 'Apollo'], ['Sam Okafor', 'Fernway', 'Ops Lead', 'Apollo']], footer: ['Search: free', 'Enrichment: 25 credits', 'Emails verified']},
 },
 'local-business-leads-apify': {
  ask: 'Get me dental clinics in Munich and Berlin.', command: '/local-leads "dental clinic" Munich,Berlin', agent: 'claude',
  steps: ['Estimating the cost first', 'Running the Google Maps scraper', 'Cleaning and deduping'], done: '184 businesses saved',
  art: {kind: 'leads', label: 'Local businesses', file: 'clinics.csv', lastIsChip: true, cols: [{h: 'Business', w: '1.3fr'}, {h: 'City', w: '.7fr'}, {h: 'Rating', w: '.6fr'}, {h: 'Contact', w: '.9fr'}], rows: [['Zahnwerk Mitte', 'Berlin', '4.8', 'Website'], ['Dental Isar', 'Munich', '4.7', 'Contact form'], ['Praxis am Park', 'Berlin', '4.6', 'Website'], ['Smile Schwabing', 'Munich', '4.9', 'Website']], footer: ['Source: Apify Google Maps', 'Cost shown before running', 'Duplicates removed']},
 },
 'lead-waterfall': {
  ask: 'Fill in this lead list from every source we have.', command: '/lead-waterfall targets.csv', agent: 'codex',
  steps: ['Apollo first, then Apify', 'Reading company websites', 'Verifying emails and merging'], done: 'enriched.csv saved',
  art: {kind: 'leads', label: 'Every field, with its source', file: 'enriched.csv', lastIsChip: true, cols: [{h: 'Name', w: '1fr'}, {h: 'Company', w: '1fr'}, {h: 'Email', w: '.8fr'}, {h: 'Filled by', w: '1fr'}], rows: [['Maya Patel', 'Northwind', 'verified', 'Apollo'], ['Lena Brandt', 'Kiteworks', 'verified', 'Website'], ['Omar Haddad', 'Fernway', 'verified', 'Apify'], ['Jo Lindqvist', 'Brightlane', 'catch-all', 'Hunter']], footer: ['4 sources merged', '31 duplicates removed', 'Source kept per field']},
 },
 'lead-scoring': {
  ask: 'Score this list so I know who to call first.', command: '/lead-scoring leads.csv', agent: 'claude',
  steps: ['Reading your ICP and signals', 'Scoring fit and timing', 'Writing a reason per lead'], done: 'scored.csv saved',
  art: {kind: 'leads', label: 'Scored, with reasons', file: 'scored.csv', lastIsChip: true, highlight: 0, cols: [{h: 'Lead', w: '.9fr'}, {h: 'Reason', w: '1.9fr'}, {h: 'Score', w: '.6fr'}], rows: [['Northwind', 'Right size, hiring ops, uses GA4', '94'], ['Brightlane', 'Just raised, small team', '86'], ['Fernway', 'Good fit, no recent signal', '64'], ['Bluemoon', 'Too large, has a data team', '31']], footer: ['Fit and timing scored', '3 bad rows flagged']},
 },
 'outreach-sequence-writer': {
  ask: 'Write the outreach for these 25 leads.', command: '/outreach-writer leads.csv', agent: 'codex',
  steps: ['Reading each lead and signal', 'Writing the first message', 'Adding follow-ups and LinkedIn'], done: '25 sequences drafted',
  art: {kind: 'sequence', note: 'LinkedIn version included', steps: [['Day 1', 'Email', 'Your head of ops hire', 'Saw you are hiring a head of client ops. Most agencies your size lose a day a week to reports. Worth a look?'], ['Day 3', 'LinkedIn', '', 'Short note, no pitch: one reporting teardown from an agency like Northwind.'], ['Day 6', 'Email', 'Quick follow-up', 'Happy to send a sample report built from your own data.']]},
 },
 'outreach-launcher': {
  ask: 'Load the approved drafts into Apollo.', command: '/outreach-launch --tool apollo', agent: 'claude',
  steps: ['Creating the sequence in Apollo', 'Adding 25 leads with drafts', 'Running final checks'], done: 'Ready in Apollo, not sent',
  art: {kind: 'checklist', label: 'Sequence: Agency ops, UK', items: [['Sequence created in Apollo', true], ['25 leads added with their drafts', true], ['Sender domain checked', true], ['Sending', false, 'Waiting for you']], verdict: 'Ready. Press send in Apollo when you are happy.'},
 },
 'deliverability-check': {
  ask: 'Will my emails land in the inbox?', command: '/deliverability acme.io', agent: 'codex',
  steps: ['Looking up DNS records', 'Scanning drafts for spam triggers', 'Writing the fixes'], done: '1 fix needed',
  art: {kind: 'checklist', label: 'acme.io sending setup', items: [['SPF record', true], ['DKIM signature', true], ['DMARC policy', false, 'Missing'], ['Links and spam words', true], ['Tracking pixel', true, 'Off, good']], verdict: 'Add a DMARC record, then you are ready to send.'},
 },
 'founder-content-engine': {
  ask: 'Turn my notes into posts for this month.', command: '/founder-content', agent: 'claude',
  steps: ['Reading your notes and work', 'Pulling opinions only you hold', 'Drafting the month'], done: '12 drafts saved',
  art: {kind: 'posts', chips: ['Theme: honest launches', 'Your voice'], posts: [['X', 'Most launch videos lose people in the first two seconds. Here is the fix.'], ['LinkedIn', 'We stopped writing feature lists. Signups went up. What we changed:'], ['X', 'Your homepage is not for you. It is for the stranger with five seconds.']]},
 },
 'long-form-article-writer': {
  ask: 'Write a long article on why agency reports fail.', command: '/article "why agency reports fail"', agent: 'codex',
  steps: ['Planning the argument', 'Pulling your real examples', 'Writing and cutting AI tells'], done: 'article.md saved, 1,800 words',
  art: {kind: 'doc', file: 'article.md', title: 'Agency reports fail for one reason, and it is not the data', badge: '1,800 words', sections: [['Hook', 'Clients do not read reports. They read the first line.'], ['Argument', 'A report is a decision tool, not a data dump.'], ['Proof', 'Two agencies that cut reports to one page.'], ['Close', 'Three questions every report should answer.']]},
 },
 'short-form-script-studio': {
  ask: 'Write me a reel script about client reporting.', command: '/reel-script "client reports"', agent: 'claude',
  steps: ['Studying reels that work in your niche', 'Picking the hook pattern', 'Writing the spoken script'], done: 'script.md saved',
  art: {kind: 'script', label: 'Reel script', length: '32 seconds', lines: [['0:00', 'Your client never reads page two.'], ['0:03', 'They read one line, then decide if you are doing a good job.'], ['0:09', 'So we write that line first.'], ['0:14', 'Everything else in the report proves it.'], ['0:22', 'Try it on your next report. Tell me what changes.']]},
 },
 'reel-analyzer': {
  ask: 'Break down this reel for me.', command: '/reel-analyzer instagram.com/reel/...', agent: 'codex',
  steps: ['Downloading the reel', 'Pulling key frames', 'Transcribing and breaking it down'], done: 'breakdown.md saved',
  art: {kind: 'reel', hook: 'I fired my best client. Here is why.', rows: [['Hook', 'Bold claim in the first 1.5 seconds'], ['Structure', 'Claim, story, lesson, question'], ['Pacing', 'Cut every 2.1 seconds on average']]},
 },
 'idea-gate': {
  ask: 'Is this idea worth making?', command: '/idea-gate "reports nobody reads"', agent: 'claude',
  steps: ['Running ten gates', 'No partial credit', 'Writing the fix'], done: 'Verdict ready',
  art: {kind: 'checklist', label: 'Idea: reports nobody reads', items: [['Specific, not general', true], ['Only you could say it', true], ['Hook lands in one line', false, 'Too soft'], ['Has a real example', true], ['Ends with an action', true]], verdict: 'Fails one gate. Sharpen the hook, then make it.'},
 },
 'voice-match': {
  ask: 'Make this draft sound like me.', command: '/voice-match draft.md', agent: 'codex',
  steps: ['Reading your writing samples', 'Building your voice profile', 'Rewriting the draft'], done: 'voice.md and draft saved',
  art: {kind: 'beforeAfter', beforeLabel: 'Generic draft', afterLabel: 'In your voice', before: 'In today\'s fast-paced landscape, reporting is crucial for agency success.', after: 'Nobody reads your reports. Fix the first line.', sub: 'Short sentences, one idea each, no buzzwords.', chips: ['AI tells removed', 'Your sentence length', 'Your words']},
 },
 'carousel-studio': {
  ask: 'Make a carousel about fixing client reports.', command: '/carousel "fix your client reports"', agent: 'claude',
  steps: ['Writing copy for 8 slides', 'Picking background photos', 'Rendering the slides'], done: '8 slides saved as PNG',
  art: {kind: 'carousel', label: 'Fix your client reports', slides: ['Your client reads one line', 'Write that line first', 'Cut every chart they skip', 'End with one decision']},
 },
 'campaign-image-studio': {
  ask: 'Make the visuals for our launch campaign.', command: '/campaign-images launch-brief.md', agent: 'codex',
  steps: ['Writing the art direction', 'Generating the image set', 'Sizing for each channel'], done: '6 images saved',
  art: {kind: 'images', label: 'Art direction: warm, bold, product first', chip: '6 images', sizes: ['1080 x 1080', '1200 x 628', '1080 x 1920', '1080 x 1080', '1200 x 628', '1080 x 1920']},
 },
 'ad-creative-variants': {
  ask: 'Give me ad variants to test on Meta.', command: '/ad-variants', agent: 'claude',
  steps: ['Picking distinct angles', 'Writing the copy', 'Generating the ads'], done: '9 ads saved',
  art: {kind: 'ads', label: 'Three angles, ready to test', ads: [['Pain', 'Still building client reports by hand?'], ['Outcome', 'Client reports in ten minutes.'], ['Proof', 'How Northwind got Fridays back.']], testFirst: 'Pain against Outcome, same audience'},
 },
 'launch-film-builder': {
  ask: 'Make a launch film from my product demo.', command: '/launch-film demo.mp4', agent: 'codex',
  steps: ['Finding the hook', 'Writing the script', 'Storyboarding and rendering'], done: 'launch-film.mp4 rendered',
  art: {kind: 'film', headline: 'Your reports used to take a week.', beats: ['Hook', 'Problem', 'Demo', 'Proof', 'CTA'], caption: '00:00 hook on screen in the first second · 00:04 cut to the demo'},
 },
 'landing-page-builder': {
  ask: 'Build a waitlist page for the new feature.', command: '/landing-page waitlist', agent: 'claude',
  steps: ['Planning the sections', 'Writing the copy', 'Building the responsive page'], done: 'Preview ready on localhost',
  art: {kind: 'page', headline: 'Client reports, done in ten minutes.', sub: 'Join the waitlist for early access.', cta: 'Get early access'},
 },
 'ai-search-visibility': {
  ask: 'Do ChatGPT and Perplexity recommend us?', command: '/ai-visibility', agent: 'codex',
  steps: ['Asking the questions buyers ask', 'Checking who gets cited', 'Listing what to fix'], done: 'visibility.md saved',
  art: {kind: 'table', rowLabel: 'Buyer question', cols: ['ChatGPT', 'Gemini', 'Perplexity'], rows: [['Best agency reporting tool', false, false, true], ['Automate client reports', true, false, true], ['Looker Studio alternative', false, false, false], ['Reporting for small agencies', true, true, true]], highlight: 2, callout: ['Fix first', 'Publish a clear Looker Studio comparison page.']},
 },
 'seo-content-refresh': {
  ask: 'Which blog posts are losing traffic?', command: '/seo-refresh gsc-export.csv', agent: 'claude',
  steps: ['Reading Search Console data', 'Finding decaying pages', 'Writing refresh briefs'], done: '6 briefs saved',
  art: {kind: 'bars', label: 'Clicks lost, last 90 days', rows: [['/blog/client-reporting-guide', 86, '-412'], ['/blog/ga4-for-agencies', 64, '-298'], ['/blog/report-templates', 48, '-221'], ['/blog/kpi-dashboard', 30, '-140']], listLabel: 'Refresh first', list: ['Update the guide with 2026 screenshots', 'Merge two posts that compete for GA4', 'New title and meta for templates']},
 },
 'conversion-review': {
  ask: 'Where does our funnel lose people?', command: '/conversion-review analytics.csv', agent: 'codex',
  steps: ['Reading the analytics export', 'Mapping the funnel', 'Ranking fixes by impact'], done: 'experiments.md saved',
  art: {kind: 'funnel', label: 'Funnel, last 30 days', steps: [['Visited site', 100], ['Viewed pricing', 46], ['Started signup', 19], ['Activated', 8]], drop: 2, callout: 'Biggest drop: pricing to signup', fixes: ['Show a free trial above the fold', 'Cut the signup form to one field']},
 },
};
