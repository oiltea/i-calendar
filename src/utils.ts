import dayjs, { Dayjs } from "dayjs"
import type { ICSEventParams } from "./types"

/**
 * 创建 ICS 日历响应
 */
export function createICSResponse(content: string, maxAge: number = 3600): Response {
  return new Response(content, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": `max-age=${maxAge}`,
    },
  })
}

/**
 * 创建 ICS 日历头部
 */
export function createICSHeader(calName: string, calDesc: string = "数据来自 60s API"): string[] {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//i-calendar//CN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${calName}`,
    `X-WR-CALDESC:${calDesc}`,
    "X-WR-TIMEZONE:Asia/Shanghai",
  ]
}

/**
 * 创建 ICS 事件
 */
export function createICSEvent({ uid, dtstamp, dtstart, dtend, summary, description }: ICSEventParams): string[] {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
  ]

  if (dtend) {
    lines.push(`DTEND;VALUE=DATE:${dtend}`)
  }

  lines.push(
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT"
  )

  return lines
}

/**
 * 获取当前时间戳和日期字符串
 */
export function getCurrentDateTime(): { now: Dayjs; dtstamp: string; dateStr: string } {
  const now = dayjs()
  return {
    now,
    dtstamp: now.format("YYYYMMDDTHHmmss"),
    dateStr: now.format("YYYYMMDD"),
  }
}

/**
 * 从 API 获取数据（带超时）
 */
export async function fetchAPI<T>(url: string, timeout: number = 5000): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const resp = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    const json = await resp.json() as { data: T }
    return json.data
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API request timeout')
    }
    throw error
  }
}
