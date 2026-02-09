export default async function history() {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const date = `${mm}-${dd}`

  const api = `https://60s.viki.moe/v2/today-in-history`
  const resp = await fetch(api)
  const json = await resp.json()
  const items = json?.data?.items

  if (!items) {
    return new Response("History Today API error", { status: 502 })
  }

  now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//History Today Calendar//CN",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:历史上的今天",
    "X-WR-CALDESC:数据来自 60s API",
    "X-WR-TIMEZONE:Asia/Shanghai",
  ]

  for (const i of items) {
    const descLines = []
    descLines.push(`📌 标题：${i.title}`)
    descLines.push(`📆 年份：${i.year}`)
    descLines.push(`📝 描述：${i.description}`)
    descLines.push(`🔗 数据来源：${i.link}`)

    ics.push(
      "BEGIN:VEVENT",
      `UID:${date}-${i.year}-${encodeURIComponent(i.title)}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${mm}${dd}`,
      `SUMMARY:${i.title}`,
      `DESCRIPTION:${descLines.join("\\n")}`,
      "END:VEVENT"
    )
  }

  ics.push("END:VCALENDAR")

  return new Response(ics.join("\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "max-age=86400",
    },
  })
}
