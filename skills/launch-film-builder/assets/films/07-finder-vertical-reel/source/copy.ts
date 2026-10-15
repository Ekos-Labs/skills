import type {LogoId} from './ui';

/* Every word on screen. Lifted from the live product where the product already has words for
   it: find/src/app/page.tsx (intake and hero), find/src/components/report-system.tsx
   (Understand / Detect / Act), find/src/app/report/[reportId]/page.tsx (section labels,
   audience simulation) and find/src/lib/typesafe.ts (the JEV audit, 200 modelled buyers and
   its disclaimer). Report figures are an example output, labelled as one on every panel.
   House style: no em dashes. */

export const PRODUCT={name:'Finder',by:'by Ekos Labs',url:'ekoslabs.com/find',price:'Free of cost'};

/* Hook. Fragmented market signals, the kind the report actually reads. Qualitative on
   purpose: no invented metrics in the noise. */
export const SIGNALS=[
 'hiring a growth lead','comparing GTM tools','asking in r/SaaS','competitor changed pricing',
 'founder posts weekly','demand gen role open','review site mentions','newsletter sponsor ask',
 'cold reply rates falling','webinar signups','search demand rising','buyer intent thread',
 'pricing page rewritten','switching from a tool','budget approved','category page traffic',
 'partner intro request','waitlist opened','case study request','integration asked for',
];

/* Input */
export const INPUT={
 label:'Step one',
 title:'Add your website.',
 placeholder:'Add your website',
 cta:'Generate free report',
 note:'No sales call to get the report.',
 read:['Reading your homepage copy','Working out what you sell, and to whom','Finding the language your buyers use'],
};

/* Engine. Three real inputs, one judgment layer. */
export const ENGINE:{key:string;name:string;detail:string;chips:string[];logo?:LogoId}[]=[
 {key:'jev',name:'JEV',detail:'Judgment model. Scores the report before you see it.',chips:['Channel priority','Evidence quality','Buyer reaction']},
 {key:'ai',name:'AI',detail:'Reads your site, then maps the market around it.',chips:['Homepage evidence','Positioning','Competitors'],logo:'claude'},
 {key:'data',name:'GTM data',detail:'Years of engines we have built for real companies.',chips:['Channel library','ICP patterns','What failed before']},
];
export const CORE={label:'Finder',title:'One report.',line:'Every meaningful claim links back to evidence.'};

/* Result. Five panels, in the order the report reads. */
export const MARKET={
 sheet:'Your report · Market',label:'Market sizing',title:'What to do in your market.',
 bars:[['Total market',.92,'Mapped'],['Serviceable market',.64,'Mapped'],['Reachable ICP',.36,'Priority']] as [string,number,string][],
 move:['The first move','Go narrow on the reachable slice. One segment, one message, for the first month.'] as [string,string],
};
export const SIM={
 sheet:'Your report · Audience simulation',label:'Audience simulation',title:'What 200 simulated buyers might think.',
 buckets:[['Dismiss',46],['Curious',62],['Interested',58],['Ready to act',34]] as [string,number][],
 stats:[['Message clarity',64],['Likely action intent',48]] as [string,number][],
 friction:['Main friction','unclear value'] as [string,string],
 segment:['Strongest segment','Founders still running sales themselves'] as [string,string],
 disclaimer:'AI-modeled buyer reactions based on the supplied evidence. This is not a survey of real people.',
};
export const ICP={
 sheet:'Your report · ICP map',label:'Who this is for',title:'Prioritize this buyer first.',
 profile:'Seed to Series A B2B software teams where the founder is still the one selling.',
 firmographics:['10 to 80 employees','Seed to Series A','Founder still selling','DACH and UK','No growth team yet'],
 later:['Series B teams with a growth lead','Agencies reselling the motion'],
};
export const DMS={
 sheet:'Your report · Decision makers',label:'Who can say yes',title:'Who to reach, and how.',
 people:[['VP','VP Growth','Owns the number','Best entry'],['HC','Head of Content','Champion',''],['RO','Revenue Ops','Influencer','']] as [string,string,string,string][],
 how:[
  {logo:'linkedin' as LogoId,text:'Filter by title and headcount, then read their last 3 posts.'},
  {logo:'google' as LogoId,text:'Open growth roles on the careers page mean budget exists.'},
  {logo:'email' as LogoId,text:'Verify the pattern before the first send.'},
 ],
};
export const CHANNELS={
 sheet:'Your report · Where they are',label:'Focus channels',title:'The communities and channels that fit.',
 communities:['r/SaaS','r/startups','r/Entrepreneur','r/GrowthHacking'],
 communityNote:'Answer questions where your buyer already asks them.',
 rows:[
  {logo:'linkedin' as LogoId,name:'LinkedIn',fit:'Strong fit',reason:'Your buyer posts and reads here weekly.'},
  {logo:'google' as LogoId,name:'Search',fit:'High intent',reason:'Comparison queries already exist in your category.'},
  {logo:'reddit' as LogoId,name:'Reddit',fit:'Buyer research',reason:'Founders compare tools in the open here.'},
 ],
};
export const REPORT_BADGE='Example output';

/* Payoff */
export const PLAN={
 label:'What to do first',title:'A focused first month.',
 weeks:[
  ['Week 1','Rewrite the homepage around the reachable segment.'],
  ['Week 2','Publish one comparison page and one proof post.'],
  ['Week 3','Twenty LinkedIn conversations with VPs of Growth.'],
 ] as [string,string][],
 rule:'One channel. One message. One proof point.',
};
export const CLOSE={line1:'Find the signal.',line2:'Move first.'};
