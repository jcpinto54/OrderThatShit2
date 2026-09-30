/**
 * Where the joke stops. The site's whole premise is "my life is bad, so order that shit", so
 * some people will type things that aren't jokes. Those get a straight answer, not a verdict,
 * and nothing shareable. See docs/research/02-humor-and-satire.md (the tragedy test).
 */

/** Someone may be in danger: say so plainly and point at people who can help. */
export const crisis =
  /\b(kill(ing)? myself|suicid\w*|end it all|end my life|want to die|wanna die|self[- ]?harm|hurt(ing)? myself|can'?t go on|no reason to live)\b/i;

/** Real grief or serious illness: too close for a joke website. */
export const grief =
  /\b(funeral|passed away|miscarriage|stillbirth|grieving|cancer|chemo\w*|terminally ill|(my|our) (mom|mum|mother|dad|father|wife|husband|partner|son|daughter|child|baby|brother|sister|grandma|grandpa|grandmother|grandfather|best friend|friend|dog|cat) (died|passed|is dying))\b/i;

/** An international directory of free, confidential helplines. */
export const HELPLINE_URL = "https://findahelpline.com";
