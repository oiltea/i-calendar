class ICS:
    def __init__(self, prodid):
        self.lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            f"PRODID:{prodid}",
            "CALSCALE:GREGORIAN",
        ]

    def add_event(self, uid, start, end, summary, desc=""):
        self.lines.extend([
            "BEGIN:VEVENT",
            f"UID:{uid}",
            f"DTSTART;VALUE=DATE:{start}",
            f"DTEND;VALUE=DATE:{end}",
            f"SUMMARY:{summary}",
            f"DESCRIPTION:{desc}",
            "END:VEVENT",
        ])

    def build(self):
        return "\n".join(self.lines + ["END:VCALENDAR"])
