import { createICSResponse, createICSHeader, createICSEvent, getCurrentDateTime, fetchAPI } from "./utils"
import { API_BASE_URL, CACHE_TIMES } from "./config"
import type { FuelPriceData } from "./types"

export default async function fuelPrice(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const region = url.searchParams.get("region")
  const primary = url.searchParams.get("primary")

  const api = `${API_BASE_URL}/fuel-price?region=${encodeURIComponent(region || "")}`
  const data = await fetchAPI<FuelPriceData>(api)

  const item = primary ? data.items.find(i => i.name.includes(primary)) : data.items[0]

  const { dtstamp, dateStr } = getCurrentDateTime()
  const ics = createICSHeader(`燃油价格 (${region})`)

  const descLines = data.items.map(i => `${i.name}：${i.price_desc}`)
  descLines.push(`更新时间：${data.updated}`)

  ics.push(...createICSEvent({
    uid: `${dateStr}-${region}-${primary || "default"}@fuelprice`,
    dtstamp,
    dtstart: dateStr,
    dtend: dateStr,
    summary: `${region} ${item?.name} ${item?.price_desc}`,
    description: descLines.join("\\n\\n"),
  }))

  ics.push("END:VCALENDAR")
  return createICSResponse(ics.join("\n"), CACHE_TIMES.FUEL_PRICE)
}
