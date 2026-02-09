from weather.fetch import fetch_weather
from weather.build import build_weather_ics

data = fetch_weather("北京", 7)
ics_text = build_weather_ics("北京", data)

with open("public/weather.ics", "w", encoding="utf-8") as f:
    f.write(ics_text)
