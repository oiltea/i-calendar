import dayjs from "dayjs"
import { createICSResponse, createICSHeader, createICSEvent, getCurrentDateTime, fetchAPI } from "./utils"
import { API_BASE_URL, CACHE_TIMES, MAX_WEATHER_DAYS } from "./config"
import type { WeatherData } from "./types"

export default async function weather(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const query = url.searchParams.get("query")
  const days = Math.min(parseInt(url.searchParams.get("days") || "3", 10), MAX_WEATHER_DAYS)

  const api = `${API_BASE_URL}/weather/forecast?query=${encodeURIComponent(query || "")}&days=${days}`
  const data = await fetchAPI<WeatherData>(api)
  const daily = data.daily_forecast

  const { dtstamp } = getCurrentDateTime()
  const ics = createICSHeader(`天气预报（${query}）`)

  for (const d of daily) {
    const dtstart = dayjs(d.date).format("YYYYMMDD")
    const dtend = dayjs(d.date).add(1, "day").format("YYYYMMDD")

    const descLines = [
      `🌡 温度：${d.min_temperature}℃~${d.max_temperature}℃`,
      `☀ 白天天气：${d.day_condition}`,
      `🌙 夜间天气：${d.night_condition}`,
      `😷 空气质量：${d.air_quality}`,
      `📆 日期：${d.date}`,
    ]

    ics.push(...createICSEvent({
      uid: `${dtstart}-${query}@weather`,
      dtstamp,
      dtstart,
      dtend,
      summary: `${query} ${d.day_condition} ${d.min_temperature}℃~${d.max_temperature}℃`,
      description: descLines.join("\\n\\n"),
    }))
  }

  ics.push("END:VCALENDAR")
  return createICSResponse(ics.join("\n"), CACHE_TIMES.WEATHER)
}
