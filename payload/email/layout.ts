// Shared HTML shell for QL Ledger transactional email.
// Dependency-free on purpose: templates render before Payload is installed (DEV-82).

const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://quarterlylearnings.com').replace(/\/$/, '')

const COLOR_TEXT = '#14281D' // --color-tertiary
const COLOR_MUTED = '#6E633D' // --color-neutral
const COLOR_BUTTON = '#FFDB00' // --color-accent; fill only, text on it stays tertiary

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:24px;color:${COLOR_TEXT};">${html}</p>`
}

export function link(url: string, label = url): string {
  return `<a href="${escapeHtml(url)}" style="color:${COLOR_TEXT};text-decoration:underline;word-break:break-all;">${escapeHtml(label)}</a>`
}

export function button(url: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
  <tr>
    <td style="background:${COLOR_BUTTON};border-radius:6px;">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 24px;font-size:16px;font-weight:600;color:${COLOR_TEXT};text-decoration:none;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`
}

export function greeting(name?: string): string {
  return name ? `Hi ${name},` : 'Hello,'
}

/** Customer-facing layout: logo header, body, QL footer. */
export function layout({ title, body }: { title: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Red Hat Display',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td style="padding-bottom:24px;">
            <img src="${SITE_URL}/quarterly-learnings-logo@3x.png" width="64" height="64" alt="Quarterly Learnings" style="display:block;border:0;">
          </td>
        </tr>
        <tr>
          <td>${body}</td>
        </tr>
        <tr>
          <td style="padding-top:24px;border-top:1px solid #e5e5e5;font-size:13px;line-height:20px;color:${COLOR_MUTED};">
            Quarterly Learnings · <a href="${SITE_URL}" style="color:${COLOR_MUTED};">quarterlylearnings.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

/** Internal layout for alerts to Brandon: no branding. */
export function plainLayout({ title, body }: { title: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px;font-family:Helvetica,Arial,sans-serif;">${body}</body>
</html>`
}

export const TEXT_FOOTER = '\n\n--\nQuarterly Learnings · quarterlylearnings.com'
