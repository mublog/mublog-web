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

export default function translateMarkDown(text: string): string {
  text = buildLists(text)
  text = buildHeaders(text)
  text = text.replace(IMG, `<img loading="lazy" src="$2" alt="$1">`)
  text = text.replace(A, `<a target="_blank" href="$2">$1</a>`)
  text = buildFontStyles(text)
  text = text.replace(PRE0, `<pre class="$2">`)
  text = text.replace(PRE1, "</pre>\n\n")
  text = text.replace(CODE0, "<code>$1</code>")
  text = text.replace(P0, m => P1.test(m) ? m : `<p>${m}</p>`)
  text = text.replace(PRE2, "$1$2")
  return text
}

function buildHeaders(t: string): string {
  t = t.replace(H6, "<h6>$1</h6>")
  t = t.replace(H5, "<h5>$1</h5>")
  t = t.replace(H4, "<h4>$1</h4>")
  t = t.replace(H3, "<h3>$1</h3>")
  t = t.replace(H2, "<h2>$1</h2>")
  t = t.replace(H1, "<h1>$1</h1>")
  return t
}

function buildFontStyles(t: string): string {
  t = t.replace(B, "<b>$1</b>") // **bold**, __bold__
  t = t.replace(I, "<i>$1</i>") // *italic*, _italic_
  t = t.replace(DEL, "<del>$1</del>") // ~~delete~~
  return t
}

function buildLists(t: string): string {
  t = t.replace(UL0, "<ul>\n*")
  t = t.replace(UL1, "$1\n</ul>\n\n$2")
  t = t.replace(UL2, "<li>$1</li>")
  //ol
  t = t.replace(OL0, "<ol>\n1.")
  t = t.replace(OL1, "$1\n</ol>\n\n$2")
  t = t.replace(OL2, "<li>$1</li>")
  return t
}