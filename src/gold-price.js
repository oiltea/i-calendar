export default async function goldPrice(request) {
    const api = `https://60s.viki.moe/v2/gold-price`
    const resp = await fetch(api)
    const json = await resp.json()
    const data = json?.data || []

    if (!data) {
        return new Response("Gold Price API error", { status: 502 })
    }

    const now = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z"
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "")

    let ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Fuel Price Calendar//CN",
        "CALSCALE:GREGORIAN",
        `X-WR-CALNAME:今日金价`,
        `X-WR-CALDESC:数据来自 60s API`,
        "X-WR-TIMEZONE:Asia/Shanghai",
    ]

    const metal = data?.metals[0]

    let summary = `今日金价 ${metal?.today_price} ${metal?.unit}`

    ics.push(
        "BEGIN:VEVENT",
        `UID:${dateStr}-goldprice@fuelprice`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${summary}`,
        "END:VEVENT"
    )

    ics.push("END:VCALENDAR")

    return new Response(ics.join("\n"), {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Cache-Control": "max-age=3600"
        }
    })
}