import { createICSResponse, createICSHeader, createICSEvent, getCurrentDateTime, fetchAPI } from "./utils"
import { API_BASE_URL, CACHE_TIMES } from "./config"
import type { HistoryData } from "./types"

export default async function todayInHistory(): Promise<Response> {
  const { now, dtstamp, dateStr } = getCurrentDateTime()
  const date = now.format("MM-DD")

  const api = `${API_BASE_URL}/today-in-history`
  const data = await fetchAPI<HistoryData>(api)

  const ics = createICSHeader("历史上的今天")

  for (const i of data.items) {
    const descLines = [
      `📌 标题：${i.title}`,
      `📆 年份：${i.year}`,
      `📝 描述：${i.description}`,
      `🔗 数据来源：${i.link}`,
    ]

    ics.push(...createICSEvent({
      uid: `${date}-${i.year}-${encodeURIComponent(i.title)}@history`,
      dtstamp,
      dtstart: dateStr,
      summary: i.title,
      description: descLines.join("\\n"),
    }))
  }

  ics.push("END:VCALENDAR")
  return createICSResponse(ics.join("\n"), CACHE_TIMES.HISTORY)
}
