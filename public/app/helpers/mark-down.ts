const IMG = /\![\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g
const A = /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g
const PRE0 = /^\s*\n\`\`\`(([^\s]+))?/gm
const PRE1 = /^\`\`\`\s*\n/gm
const PRE2 = /(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm
const CODE0 = /[\`]{1}([^\`]+)[\`]{1}/g
const P0 = /^\s*(\n)?(.+)/gm
const P1 = /\<(\/)?(h\d|ul|ol|li|img|pre)/
const B = /[\*\_]{2}([^\*\_]+)[\*\_]{2}/g
const I = /[\*\_]{1}([^\*\_]+)[\*\_]{1}/g
const DEL = /[\~]{2}([^\~]+)[\~]{2}/g
const UL0 = /^\s*\n\*/gm
const UL1 = /^(\*.+)\s*\n([^\*])/gm
const UL2 = /^\* (.+)/gm
const OL0 = /^\s*\n\d\./gm
const OL1 = /^(\d\..+)\s*\n([^\d\.])/gm
const OL2 = /^\d\. (.+)/gm
const H1 = /[\\#]{1} (.+)/g
const H2 = /[\\#]{2} (.+)/g
const H3 = /[\\#]{3} (.+)/g
const H4 = /[\\#]{4} (.+)/g
const H5 = /[\\#]{5} (.+)/g
const H6 = /[\\#]{6} (.+)/g
const ALIAS = /(@([a-z0-9]+))/gmi

function replace(text: string, find: string | RegExp, value: any) {
  return text.replace(find, value)
}

export default function translateMarkDown(text: string): string {
  text = buildLists(text)
  text = buildHeaders(text)
  text = replace(text, IMG, `<img loading="lazy" src="$2" alt="$1">`)
  text = replace(text, A, `<a target="_blank" href="$2">$1</a>`)
  text = buildFontStyles(text)
  text = replace(text, PRE0, `<pre class="$2">`)
  text = replace(text, PRE1, "</pre>\n\n")
  text = replace(text, CODE0, "<code>$1</code>")
  text = replace(text, P0, m => P1.test(m) ? m : `<p>${m}</p>`)
  text = replace(text, PRE2, "$1$2")
  text = replace(text, ALIAS, `<a class="profile-link" href="/user/$2">$1</a>`)
  return text
}

function buildHeaders(t: string): string {
  t = replace(t, H6, "<h6>$1</h6>")
  t = replace(t, H5, "<h5>$1</h5>")
  t = replace(t, H4, "<h4>$1</h4>")
  t = replace(t, H3, "<h3>$1</h3>")
  t = replace(t, H2, "<h2>$1</h2>")
  t = replace(t, H1, "<h1>$1</h1>")
  return t
}

function buildFontStyles(t: string): string {
  t = replace(t, B, "<b>$1</b>")
  t = replace(t, I, "<i>$1</i>")
  t = replace(t, DEL, "<del>$1</del>")
  return t
}

function buildLists(t: string): string {
  t = replace(t, UL0, "<ul>\n*")
  t = replace(t, UL1, "$1\n</ul>\n\n$2")
  t = replace(t, UL2, "<li>$1</li>")
  t = replace(t, OL0, "<ol>\n1.")
  t = replace(t, OL1, "$1\n</ol>\n\n$2")
  t = replace(t, OL2, "<li>$1</li>")
  return t
}