// Content for every skill preview film. Each entry picks a scene template in
// SkillReel.tsx and fills it with that skill's finished deliverable. Every company,
// person and number here is fictional; the photos are free Unsplash images.

const P = {
 laptopCafe: '1484788984921-03950022c9ef', cafeBar: '1508766917616-d22f3f1eea14', teamTable: '1521737604893-d14cc237f11d',
 teamCorner: '1521737711867-e3b97375f902', teamHeadphones: '1521737852567-6949f3f9f2b5', teamLaptops: '1522071820081-009f0129c71c',
 libraryLaugh: '1523240795612-9a054b0db644', plantShop: '1531058240690-006c446962d8', womanTablet: '1543269664-56d93c1b41a6',
 twoWomen: '1556740758-90de374c12ad', officeMeet: '1556761175-b413da4baf72', whiteboard: '1557804506-669a67965ba0',
 salon: '1562322140-8baeececf3df', groupMac: '1572021335469-31706a17aaef', huddle: '1603201667141-5a2d4c673378',
 agency: '1621856625680-282ec3a17db8', darkDesk: '1635830625698-3b9bd74671ca', creatorDesk: '1636971828014-0f3493cba88a',
 financeDesk: '1664575602276-acd073f104c1', creatorStudio: '1673767298248-b128f17f89af', bigTeam: '1681164315990-b2a1e375eb69',
 officeRoom: '1681949103006-70066fb25dfe', womanCounter: '1687293233211-6b0cc3beba70', butcher: '1687422808248-f807f4ea2a2e',
 youngTeam: '1690378820474-b468b8ee64d3', phoneShop: '1726066012749-f81bf4422d4e', shopOwner: '1764173039192-2bbd508d5211',
 deskNight: '1768219565623-501f93ae384b', manStudio: '1772442088907-463f166cf1f2', manDesk: '1773332611612-ffdaa753afb1',
 editDesk: '1777019075773-a231fa4e4534', gearDesk: '1787839322261-4caf24adb081',
};

type Card = {photo: string; lines: string[]; cta?: string; tag?: string; corner?: string};
type Post = {avatar: string; name: string; handle: string; label: string; text: string; image?: string};
type Email = {to: string; when: string; subject: string; body: string};

export type Reel =
 | {kind: 'report'; bg?: string; photo: string; kicker: string; title: string; subtitle: string;
    stat: {kicker: string; value: string; label: string; minis: [string, string, string][]; source: string};
    bars: {kicker: string; title: string; items: [string, number][]; noteLead: string; note: string}}
 | {kind: 'sheet'; bg?: string; title: string; subtitle: string; meta: string; columns: string[]; widths: number[]; rows: string[][];
    avatars?: boolean; scoreColumn?: number; tagColumn?: number; monoColumn?: number}
 | {kind: 'slides'; bg?: string; kicker: string; title: string; cards: Card[]; wide?: boolean}
 | {kind: 'posts'; bg?: string; kicker: string; title: string; posts: Post[]}
 | {kind: 'emails'; bg?: string; kicker: string; title: string; steps: [string, string][]; emails: Email[]; status?: string}
 | {kind: 'phone'; bg?: string; photo: string; onScreen: string; handle: string; caption: string; kicker: string; title: string;
    beats: [string, string, string][]; stats: [string, string][]}
 | {kind: 'web'; bg?: string; url: string; kicker: string; headline: string; sub: string; cta: string; photo: string; points: [string, string][]}
 | {kind: 'score'; bg?: string; photo: string; subjectKicker: string; subject: string; kicker: string; title: string;
    verdict: string; verdictTone: 'good' | 'bad' | 'warn'; checks: [string, 'pass' | 'fail' | 'check', string][]; footer?: string}
 | {kind: 'doc'; bg?: string; photo: string; kicker: string; title: string; subtitle?: string; sections: [string, string | string[]][]};

export const REELS: Record<string, Reel> = {
 // ---------------- Strategy
 'product-context': {kind: 'doc', photo: P.teamLaptops, kicker: 'product-context.md · Fernway', title: 'Fernway, in one page', subtitle: 'what every skill reads first',
  sections: [
   ['Product', 'Client reporting software for marketing agencies. Builds the monthly report from ad and analytics accounts in minutes.'],
   ['Buyer', 'Agency owners and ops leads, 5 to 50 staff, UK and US. Pain: two days a month lost to reports.'],
   ['Offer', '14-day trial, then $79 per month for 10 clients. Setup call included.'],
   ['Proof we can show', ['Live demo report with sample data', '31 agencies on the beta (owner-stated)', 'Integrations: Google Ads, Meta, GA4']],
   ['Unknown, ask next', 'Churn after month three. Which clients get the report first.'],
  ]},
 'ai-cmo-router': {kind: 'doc', photo: P.whiteboard, kicker: 'Next marketing move · Fernway', title: 'Constraint: too few qualified demos', subtitle: 'confidence medium',
  sections: [
   ['Evidence', 'Trial to paid is 22% (healthy). Only 9 trials a month, all from founder posts.'],
   ['Run next, in order', ['Customer Map: find the agencies with the sharpest reporting pain', 'Positioning Fix: rewrite the homepage for agency owners', 'ICP to Lead List: 100 ops leads, then a 2-week outbound test']],
   ['Continue if', 'Outbound books 6+ demos from 100 contacts in two weeks.'],
   ['Not now', 'Paid social. Not enough proof on the page to convert cold clicks yet.'],
  ]},
 'distribution-report': {kind: 'report', photo: P.teamLaptops, kicker: 'Distribution report · October 2026', title: 'Fernway', subtitle: 'how to reach agencies',
  stat: {kicker: '02 · Market', value: '$4.2B', label: 'Agency analytics and reporting software, global', minis: [['SAM', '$610M', 'English-speaking agencies, 5 to 50 staff'], ['SOM', '$18M', 'Reachable in 3 years at current pace']], source: 'Sources: two published industry reports, 2025 and 2026. Shares derived by stated percentages.'},
  bars: {kicker: '04 · Channels', title: 'Where Fernway should show up first', items: [['Founder posts on LinkedIn', 92], ['Cold email to agencies', 80], ['Agency communities', 66], ['Partner integrations', 48], ['Paid social', 24]], noteLead: 'First move.', note: 'Three reporting teardowns a week from the founder, each ending with one question.'}},
 'positioning-fix': {kind: 'posts', bg: 'linear-gradient(160deg, #f1ede6, #e6dfd3)', kicker: 'Positioning fix · homepage hero', title: 'Same product. Clear in five seconds.',
  posts: [
   {avatar: P.agency, name: 'fernway.io', handle: 'Hero today', label: 'Before', text: 'The all-in-one data platform\nfor modern teams.\n\nUnlock insights. Streamline workflows.'},
   {avatar: P.agency, name: 'fernway.io', handle: 'Hero, option 1', label: 'After', text: 'Client reports, done in 10 minutes.\n\nFernway pulls Google Ads, Meta and GA4 into the report your clients actually read. Built for agencies.', image: P.groupMac},
   {avatar: P.agency, name: 'Why it works', handle: 'Reasoning', label: 'Note', text: 'Names the buyer (agencies), the job (client reports) and the result (10 minutes).\n\nCut: "all-in-one", "unlock", "streamline". No agency would search for them.'},
  ]},

 // ---------------- Research
 'customer-map': {kind: 'doc', photo: P.officeMeet, kicker: 'Customer map · 34 sourced quotes', title: 'The job: look competent to clients', subtitle: 'without losing two days a month',
  sections: [
   ['In their words', '"I spend the first week of every month screenshotting dashboards." (r/agency, 2026)'],
   ['What they use today', 'Google Slides, Looker Studio templates, a junior account manager.'],
   ['Segments to test, ranked', ['Paid media agencies, 5 to 20 staff: the most quotes, the most urgency', 'SEO agencies with retainer clients: monthly report is the product', 'Freelancers going agency: price sensitive, easy to reach']],
   ['Ask in interviews', 'Who on the client side reads the report, and what do they do next?'],
  ]},
 'competitor-dossier': {kind: 'sheet', title: 'Competitor dossier', subtitle: 'agency reporting', meta: '6 tools buyers compare · public pages, Oct 2026',
  columns: ['Tool', 'Promise', 'Proof shown', 'Price from', 'Gap'], widths: [1.1, 2, 1.5, .9, 1.8],
  rows: [
   ['Reportly', 'Automated client dashboards', '2,000 agencies', '$49 / mo', 'Dashboards, not narrative'],
   ['Tallyhouse', 'White-label reports', 'G2 badges', '$99 / mo', 'Setup takes days'],
   ['Brightlane', 'All-in-one agency OS', '3 case studies', '$199 / mo', 'Reporting is an add-on'],
   ['Kitebird', 'AI report summaries', 'None yet', '$29 / mo', 'No ad integrations'],
   ['Looker templates', 'Free and flexible', 'Google brand', 'Free', 'Someone has to build it'],
   ['Doing it by hand', 'Full control', 'Habit', '2 days / mo', 'The real competitor'],
  ], tagColumn: undefined},
 'competitor-ads-intelligence': {kind: 'slides', kicker: 'Competitor ad scan · Meta Ad Library · 41 active ads', title: 'What rivals run, and what to test instead', wide: true,
  cards: [
   {photo: P.groupMac, lines: ['Stop screenshotting', 'dashboards'], tag: 'Observed · 14 ads', cta: 'Start free trial'},
   {photo: P.financeDesk, lines: ['Reports in', '5 minutes'], tag: 'Observed · 9 ads', cta: 'Book a demo'},
   {photo: P.officeRoom, lines: ['Your client reads', 'one line'], tag: 'Original angle', cta: 'See a sample'},
   {photo: P.womanTablet, lines: ['Show the decision,', 'not the data'], tag: 'Original angle', cta: 'Try it free'},
  ]},
 'reddit-buyer-radar': {kind: 'sheet', title: 'Reddit buyer radar', subtitle: 'client reporting pain', meta: '17 live threads · last 14 days',
  columns: ['Fit', 'Thread', 'Subreddit', 'Age', 'Helpful angle'], widths: [.5, 2.6, 1, .5, 2.2],
  rows: [
   ['94', 'How do you make monthly reports less painful?', 'r/agency', '2d', 'Share the one-page format you use'],
   ['88', 'Clients never read our 20-page reports', 'r/PPC', '4d', 'Lead with the decision, not charts'],
   ['81', 'Looker Studio keeps breaking, alternatives?', 'r/bigseo', '5d', 'Compare options honestly'],
   ['76', 'Hiring a junior just for reporting?', 'r/agency', '6d', 'Show the hours math'],
   ['70', 'What do you automate first at 10 clients?', 'r/marketing', '9d', 'List what to automate first'],
   ['63', 'Best way to explain ROAS to clients', 'r/PPC', '11d', 'A plain-words template'],
  ], scoreColumn: 0},
 'buying-signal-scan': {kind: 'sheet', title: 'Buying signals', subtitle: 'this week', meta: '60 accounts checked · 14 with a signal',
  columns: ['Company', 'Score', 'Signal', 'Date', 'Reason to reach out'], widths: [1.3, .6, 1.8, .8, 2.3],
  rows: [
   ['Northwind Studio', '91', 'Hiring Head of Client Services', 'Oct 3', 'New owner for client reporting'],
   ['Parcel & Co', '86', 'Raised seed round', 'Sep 28', 'Budget to fix ops before scaling'],
   ['Halden Digital', '78', 'Dropped a reporting tool', 'Sep 22', 'Switching moment'],
   ['Studio Kite', '72', 'Opened a US office', 'Sep 15', 'New clients, same team'],
   ['Lumen Agency', '64', 'Hiring 2 account managers', 'Sep 9', 'Client load is growing'],
   ['Brightfold', '58', 'New COO', 'Aug 30', 'Reviews tools in first 90 days'],
  ], scoreColumn: 1},
 'pre-call-brief': {kind: 'doc', photo: P.twoWomen, kicker: 'Pre-call brief · Thu 14:00', title: 'Maya Patel, Head of Ops', subtitle: 'Northwind Studio, 34 staff',
  sections: [
   ['What just changed', 'Hired a Head of Client Services (Oct 3). Launched a paid social offer (Sep). Two new retainers announced.'],
   ['Likely pains', ['Reporting time grows with every new retainer', 'New hire will want one reporting standard']],
   ['Likely objection', '"We just built Looker templates." Answer: keep them; Fernway writes the summary on top.'],
   ['Ask her', ['How long does the monthly report take now?', 'Who reads it on the client side?', 'What happens if a report is late?']],
  ]},

 // ---------------- Leads
 'icp-lead-list-apollo': {kind: 'sheet', title: 'Agency ops leads', subtitle: 'United Kingdom', meta: '25 approved · emails verified',
  columns: ['Name', 'Title', 'Company', 'City', 'Email'], widths: [1.5, 1.4, 1.3, .9, 1.6], avatars: true, monoColumn: 4,
  rows: [
   ['Maya Patel', 'Head of Operations', 'Northwind Studio', 'London', 'maya@northwind.studio'],
   ['Tom Reyes', 'Operations Director', 'Brightlane', 'Manchester', 'tom@brightlane.co'],
   ['Ines Novak', 'COO', 'Studio Kite', 'Bristol', 'ines@studiokite.com'],
   ['Sam Okafor', 'Head of Client Ops', 'Fernway', 'Leeds', 'sam@fernway.agency'],
   ['Lena Brandt', 'Operations Lead', 'Kiteworks', 'London', 'lena@kiteworks.io'],
   ['Omar Haddad', 'Director of Ops', 'Parcel & Co', 'Edinburgh', 'omar@parcelco.uk'],
   ['Jo Lindqvist', 'COO', 'Halden Digital', 'London', 'jo@halden.digital'],
   ['Priya Shah', 'Head of Operations', 'Lumen Agency', 'Birmingham', 'priya@lumen.agency'],
  ]},
 'local-business-leads-apify': {kind: 'sheet', title: 'Dental clinics', subtitle: 'Munich and Augsburg', meta: '128 found · 74 after cleaning · cost $0.52',
  columns: ['Clinic', 'City', 'Rating', 'Reviews', 'Website', 'Contact page'], widths: [1.7, .9, .6, .7, 1.4, 1.2],
  rows: [
   ['Zahnwerk Mitte', 'Munich', '4.9', '412', 'zahnwerk-mitte.de', '/kontakt'],
   ['Praxis am Lech', 'Augsburg', '4.8', '233', 'praxis-lech.de', '/impressum'],
   ['Smile Studio Schwabing', 'Munich', '4.7', '389', 'smile-schwabing.de', '/kontakt'],
   ['Dental Loft', 'Munich', '4.9', '156', 'dentalloft.de', '/termin'],
   ['Zahnarzt Königsplatz', 'Augsburg', '4.6', '98', 'zahn-koenigsplatz.de', '/kontakt'],
   ['Praxis Weißgerber', 'Munich', '4.8', '271', 'praxis-weiss.de', '/impressum'],
  ], monoColumn: 4},
 'lead-waterfall': {kind: 'sheet', title: 'Enriched leads', subtitle: 'one list, many sources', meta: '200 rows · 91% emails found · 84% verified',
  columns: ['Name', 'Company', 'Email', 'Source', 'Status'], widths: [1.3, 1.2, 1.9, 1.2, .8], avatars: true, monoColumn: 2, tagColumn: 4,
  rows: [
   ['Ana Ruiz', 'Northwind Studio', 'ana@northwind.studio', 'Apollo', 'valid'],
   ['Ben Clarke', 'Kiteworks', 'ben@kiteworks.io', 'Apify finder', 'valid'],
   ['Chloé Martin', 'Halden Digital', 'chloe@halden.digital', 'Website', 'risky'],
   ['Dev Mehta', 'Parcel & Co', 'dev@parcelco.uk', 'Apollo', 'valid'],
   ['Eli Brooks', 'Studio Kite', 'eli@studiokite.com', 'Apollo + check', 'valid'],
   ['Fatima Noor', 'Lumen Agency', 'fatima@lumen.agency', 'Apify finder', 'valid'],
   ['Gus Taylor', 'Brightfold', 'hello@brightfold.co', 'Website', 'check'],
  ]},
 'lead-scoring': {kind: 'sheet', title: 'Scored leads', subtitle: 'who to email first', meta: '312 leads · A 41 · B 118 · C 153',
  columns: ['Lead', 'Score', 'Bucket', 'Reason'], widths: [1.6, .6, .6, 3.2], avatars: true, scoreColumn: 1, tagColumn: 2,
  rows: [
   ['Maya Patel · Northwind', '94', 'A', 'Ops lead, 34 staff agency, hiring client services'],
   ['Tom Reyes · Brightlane', '87', 'A', 'Director of Ops, paid media agency, UK'],
   ['Ines Novak · Studio Kite', '79', 'A', 'COO, new US office this month'],
   ['Leo Grant · Fernhill', '66', 'B', 'Right role, company smaller than ICP'],
   ['Ola Berg · Nordlys', '54', 'B', 'Agency fits, title is junior'],
   ['Ray Cole · Brightcast', '31', 'C', 'In-house team, not an agency'],
  ]},

 // ---------------- Outreach
 'outreach-sequence-writer': {kind: 'emails', kicker: 'Sequence · Maya Patel, Northwind Studio', title: 'Written from one real fact',
  steps: [['Day 0', 'First email'], ['Day 3', 'New angle'], ['Day 7', 'Short bump'], ['LI', 'Connection note']],
  emails: [
   {to: 'Maya Patel', when: 'Day 0 · draft', subject: 'your new client services hire', body: 'Hi Maya, saw Northwind is hiring a Head of Client Services. The first thing most new hires inherit is the monthly report.\n\nWould a one-page format your clients actually read be useful before they start?'},
   {to: 'Maya Patel', when: 'Day 3 · draft', subject: 'the report clients read', body: 'One example: we cut a 22-page report to one page with three decisions. Happy to send it over.'},
   {to: 'Maya Patel', when: 'Day 7 · draft', subject: 'close the loop?', body: 'Is reporting on the list for the new hire, or later in the year?'},
  ]},
 'outreach-launcher': {kind: 'emails', kicker: 'lemlist · campaign created', title: 'Q4 agency ops, ready to review', status: 'Paused · you press start',
  steps: [['25', 'Leads added'], ['3', 'Email steps'], ['1', 'LinkedIn step'], ['0', 'Sent']],
  emails: [
   {to: '{{firstName}} · 25 leads', when: 'Step 1 · Day 0', subject: '{{personalSubject}}', body: '{{personalOpener}}\n\nWould a one-page report format be useful before the new quarter?'},
   {to: '{{firstName}}', when: 'Step 2 · Day 3', subject: 'the report clients read', body: 'One example: a 22-page report cut to one page with three decisions.'},
   {to: '{{firstName}}', when: 'Step 3 · Day 7', subject: 'close the loop?', body: 'Is reporting on your list this quarter, or later?'},
  ]},
 'deliverability-check': {kind: 'score', photo: P.deskNight, subjectKicker: 'SENDING DOMAIN', subject: 'outreach.fernway.io · Google Workspace', kicker: 'Deliverability check', title: 'Two fixes before sending', verdict: 'Fix 2', verdictTone: 'warn',
  checks: [['SPF', 'pass', 'One record, includes Google, ends in ~all'], ['DKIM', 'pass', 'google._domainkey key found'], ['DMARC', 'fail', 'No record at _dmarc'], ['MX', 'pass', 'Replies will arrive'], ['Separate domain', 'pass', 'Main domain is protected'], ['Draft links', 'check', 'Two links in the first email'], ['Tracking', 'pass', 'Open tracking off'], ['Daily cap', 'pass', '25 a day per mailbox to start']],
  footer: 'Add a DMARC record with p=none and a report address, and keep one link in the first email.'},

 // ---------------- Content
 'founder-content-engine': {kind: 'posts', kicker: 'Content month · 3 themes · 12 posts', title: 'From your notes to posts',
  posts: [
   {avatar: P.manStudio, name: 'Jonas Weber', handle: 'Founder, Fernway', label: 'LinkedIn', text: 'Our best customer churned last month.\n\nNot because of a bug. Because their client never opened the report.\n\nWe rebuilt it around one question: what should the client do next?'},
   {avatar: P.manStudio, name: 'Jonas Weber', handle: '@jonasbuilds', label: 'X', text: 'Agencies don\'t sell reports.\nThey sell the decision the report makes obvious.\n\nEverything else is decoration.'},
   {avatar: P.manStudio, name: 'Jonas Weber', handle: 'Founder, Fernway', label: 'LinkedIn', text: '3 things we cut from client reports this year:', image: P.teamHeadphones},
  ]},
 'long-form-article-writer': {kind: 'doc', photo: P.creatorDesk, kicker: 'X article · 1,640 words', title: 'Our first 100 customers came from one Slack group', subtitle: 'and why we stopped posting everywhere else',
  sections: [
   ['Opening', 'In March we were posting on five platforms. 91 of our first 100 customers came from one place, and it was not any of them.'],
   ['Sections', ['The numbers: where signups actually came from', 'Why a private community beat public reach', 'What we posted (and what flopped)', 'How we would start again tomorrow']],
   ['Short version for a post', '91 of our first 100 customers came from one Slack group. Here is what we did there, and what we stopped doing everywhere else.'],
  ]},
 'short-form-script-studio': {kind: 'phone', photo: P.creatorStudio, onScreen: 'Your client report is too long', handle: '@fernway', caption: 'One page. Three decisions.', kicker: 'Reel script · 32 s · modelled on 3 references', title: 'Stop sending 20-page reports',
  beats: [['0:00', 'Your client read one line of your report.', 'Hook'], ['0:03', 'The one under the big number.', 'Payoff'], ['0:07', 'So write that line first.', 'Point 1'], ['0:14', 'Cut every chart they skip.', 'Point 2'], ['0:21', 'End with one decision.', 'Point 3'], ['0:28', 'Save this for your next report.', 'Ending']],
  stats: [['Words', '74'], ['Pace', '2.3 w/s'], ['Cuts', '9']]},
 'reel-analyzer': {kind: 'phone', photo: P.phoneShop, onScreen: 'I stopped doing this in my store', handle: '@kitchenkinfolk', caption: 'Small change, more sales', kicker: 'Reel breakdown · 41 s · 1.2M views', title: 'Why the first 2 seconds work',
  beats: [['0:00', 'I stopped doing this in my store.', 'Hook'], ['0:02', 'Cut to the empty shelf.', 'Pattern break'], ['0:06', 'Here is what I do instead.', 'Payoff'], ['0:15', 'Three quick before and afters.', 'Proof'], ['0:33', 'Sales that week, on screen.', 'Result'], ['0:39', 'Comment SHELF for the list.', 'CTA']],
  stats: [['Hook type', 'Confession'], ['First payoff', '6 s'], ['Cuts / 10 s', '4.1']]},
 'idea-gate': {kind: 'score', photo: P.laptopCafe, subjectKicker: 'IDEA · LINKEDIN', subject: '"Why our best customer churned, and what it taught us about reports"', kicker: 'Idea Gate', title: '10 gates, no partial credit', verdict: 'YES', verdictTone: 'good',
  checks: [['Relevance', 'pass', 'Agency owners feel this every month'], ['Specificity', 'pass', 'One customer, one cause'], ['Ownership', 'pass', 'Only you have this story'], ['Hook', 'pass', 'Loss in the first line'], ['Proof', 'pass', 'Churn date and the fix'], ['Tension', 'pass', 'Not a bug, a report'], ['One idea', 'pass', 'Reports serve decisions'], ['Usefulness', 'pass', 'Reader can copy the fix'], ['Boundaries', 'pass', 'Customer not named'], ['Timing', 'pass', 'Month-end reporting week']]},
 'voice-match': {kind: 'posts', bg: 'linear-gradient(160deg, #f1ede6, #e6dfd3)', kicker: 'Voice match · profile from 5 posts', title: 'Same draft, in your voice',
  posts: [
   {avatar: P.manStudio, name: 'AI draft', handle: 'generic', label: 'Before', text: 'In today\'s fast-paced world, agencies must leverage data to unlock insights. Here\'s the thing: reporting is a game-changer.'},
   {avatar: P.manStudio, name: 'Jonas Weber', handle: 'rewritten', label: 'After', text: 'Clients don\'t want data.\nThey want to know what to do on Monday.\n\nThat\'s the whole report.'},
   {avatar: P.manStudio, name: 'Voice profile', handle: 'voice-profile.md', label: 'Note', text: 'Short lines. One idea per post. Opens with a flat claim, never a question. Never says "leverage", "unlock" or "game-changer". Ends without a call to comment.'},
  ]},

 // ---------------- Creative
 'carousel-studio': {kind: 'slides', kicker: 'Carousel · 8 slides · 1080 × 1350', title: 'Fix your client reports',
  cards: [
   {photo: P.laptopCafe, lines: ['Your client reads', 'one line.']},
   {photo: P.groupMac, lines: ['Write that line', 'first.']},
   {photo: P.huddle, lines: ['Cut every chart', 'they skip.']},
   {photo: P.deskNight, lines: ['End with one', 'decision.']},
  ]},
 'campaign-image-studio': {kind: 'slides', kicker: 'Autumn launch · art direction: warm, calm, real work', title: 'One campaign, every channel size', wide: true,
  cards: [
   {photo: P.plantShop, lines: [], tag: 'Website hero · 1920×1080', corner: 'v1'},
   {photo: P.womanCounter, lines: [], tag: 'Instagram · 1080×1350', corner: 'v1'},
   {photo: P.salon, lines: [], tag: 'LinkedIn · 1200×627', corner: 'v2'},
   {photo: P.cafeBar, lines: [], tag: 'Story · 1080×1920', corner: 'v1'},
  ]},
 'ad-creative-variants': {kind: 'slides', kicker: 'Ad variants · Meta and LinkedIn · 4 angles', title: 'Test two angles first', wide: true,
  cards: [
   {photo: P.financeDesk, lines: ['Two days a month', 'on reports?'], tag: 'Angle: pain', cta: 'Start free trial'},
   {photo: P.teamCorner, lines: ['Reports clients', 'actually read'], tag: 'Angle: outcome', cta: 'See a sample'},
   {photo: P.youngTeam, lines: ['Keep Looker.', 'Add the summary.'], tag: 'Angle: objection', cta: 'Book a demo'},
   {photo: P.libraryLaugh, lines: ['31 agencies', 'switched this month'], tag: 'Angle: proof', cta: 'Try it free'},
  ]},
 'launch-film-builder': {kind: 'phone', photo: P.editDesk, onScreen: 'Reports, in 10 minutes', handle: 'Fernway 2.0', caption: 'Launch film · 45 s', kicker: 'Launch film · script and storyboard', title: 'Fernway 2.0, from hook to end card',
  beats: [['0:00', 'A 22-page report lands in an inbox. Nobody opens it.', 'Hook'], ['0:04', 'Hard cut to black: "One page."', 'Turn'], ['0:08', 'Real UI: accounts connect, report builds.', 'Proof 1'], ['0:20', 'The summary writes itself, line by line.', 'Proof 2'], ['0:32', 'A client replies: "Clear. Let\'s do it."', 'Proof 3'], ['0:40', 'Fernway 2.0. Try it free.', 'End card']],
  stats: [['Format', '16:9 + 9:16'], ['Voiceover', 'ElevenLabs'], ['Render', 'Remotion']]},

 // ---------------- Web and SEO
 'landing-page-builder': {kind: 'web', url: 'fernway.io/audit', kicker: 'Free report audit', headline: 'Your client report, rebuilt in a week.', sub: 'Send us one report. We send back a one-page version your client will read, and the template to keep.', cta: 'Book the free audit', photo: P.officeMeet,
  points: [['Send one report', 'Any format: PDF, Slides or Looker link.'], ['Get one page back', 'Three decisions, one chart, plain words.'], ['Keep the template', 'Use it for every client from next month.']]},
 'ai-search-visibility': {kind: 'sheet', title: 'AI search visibility', subtitle: 'agency reporting', meta: '18 buyer questions · 4 assistants · run twice',
  columns: ['Question', 'ChatGPT', 'Perplexity', 'Gemini', 'Claude'], widths: [3, .9, .9, .9, .9], tagColumn: undefined,
  rows: [
   ['best client reporting tool for agencies', 'Not cited', '#4', 'Not cited', '#3'],
   ['how to automate monthly client reports', '#2', '#1', 'Not cited', '#2'],
   ['Looker Studio alternatives for agencies', 'Not cited', '#5', '#6', 'Not cited'],
   ['fernway pricing', 'Wrong price', 'Correct', 'Wrong price', 'Correct'],
   ['reportly vs fernway', '#2', '#1', '#2', '#2'],
   ['one page client report template', 'Not cited', 'Not cited', 'Not cited', '#4'],
  ]},
 'seo-content-refresh': {kind: 'sheet', title: 'SEO refresh plan', subtitle: 'pages losing clicks', meta: 'Search Console · last 3 months vs previous',
  columns: ['Page', 'Clicks lost', 'Cause', 'Fix', 'Effort'], widths: [2, .8, 1.4, 2.2, .6], monoColumn: 0,
  rows: [
   ['/blog/client-report-template', '-412', 'Lower CTR at #3', 'New title with the year and "one page"', 'S'],
   ['/blog/looker-studio-alternatives', '-268', 'Outdated list', 'Update tools and prices, add a table', 'M'],
   ['/blog/agency-kpis', '-190', 'Two pages compete', 'Merge into /blog/agency-metrics', 'M'],
   ['/features/automation', '-121', 'Intent mismatch', 'Add how-it-works and a demo video', 'L'],
   ['/blog/roas-explained', '-88', 'Fell to #9', 'Add worked example and FAQ', 'S'],
  ]},

 // ---------------- Analytics
 'conversion-review': {kind: 'report', bg: '#e6e9ef', photo: P.financeDesk, kicker: 'Conversion review · GA4 · 30 days', title: 'Fernway', subtitle: 'where trials leak',
  stat: {kicker: '01 · Biggest leak', value: '71%', label: 'of mobile visitors leave the pricing page without scrolling', minis: [['Desktop', '3.4%', 'visit to trial'], ['Mobile', '0.9%', 'visit to trial']], source: 'Aggregated GA4 export, 18,402 sessions. Goal event checked: fires once per trial.'},
  bars: {kicker: '03 · Fixes, ranked', title: 'What to test first', items: [['Trial button above the fold on mobile', 90], ['Show price before the feature grid', 74], ['Cut the signup form to 2 fields', 68], ['Add a sample report link', 52], ['Remove the chat pop-up', 35]], noteLead: 'Experiment 1.', note: 'Ship the mobile button, compare trial rate for two weeks. Too little traffic for an A/B test yet.'}},
};
