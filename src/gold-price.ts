import { createICSResponse, createICSHeader, createICSEvent, getCurrentDateTime, fetchAPI } from "./utils"
import { API_BASE_URL, CACHE_TIMES } from "./config"
import type { GoldPriceData } from "./types"

export default async function goldPrice(request: Request): Promise<Response> {
    const api = `${API_BASE_URL}/gold-price`
    const data = await fetchAPI<GoldPriceData>(api)
    const metal = data.metals[0]

    const { dtstamp, dateStr } = getCurrentDateTime()
    const ics = createICSHeader("今日金价")

    const summary = `今日金价 ${metal.today_price} ${metal.unit}`

    ics.push(...createICSEvent({
        uid: `${dateStr}-goldprice@goldprice`,
        dtstamp,
        dtstart: dateStr,
        dtend: dateStr,
        summary,
        description: summary,
    }))

    ics.push("END:VCALENDAR")
    return createICSResponse(ics.join("\n"), CACHE_TIMES.GOLD_PRICE)
}
