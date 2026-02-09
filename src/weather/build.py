from common.ics import ICS

def build_weather_ics(city, daily_data):
    ics = ICS("-//Weather 60s API//CN")

    for d in daily_data:
        date = d["date"].replace("-", "")
        ics.add_event(
            uid=f"{date}-{city}@weather",
            start=date,
            end=str(int(date) + 1),
            summary=f"{city} {d['day_condition']} {d['min_temperature']}~{d['max_temperature']}℃",
            desc=f"夜间：{d['night_condition']}"
        )

    return ics.build()
