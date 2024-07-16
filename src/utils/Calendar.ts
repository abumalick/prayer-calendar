/*
https://icalendar.org/iCalendar-RFC-5545/3-1-content-lines.html
Lines of text SHOULD NOT be longer than 75 octets, excluding the line break. Long content lines SHOULD be split into a multiple line representations using a line "folding" technique. That is, a long line can be split between any two characters by inserting a CRLF immediately followed by a single linear white-space character (i.e., SPACE or HTAB). Any sequence of CRLF followed immediately by a single linear white-space character is ignored (i.e., removed) when processing the content type.
*/
function foldLine(line: string) {
  const maxLineLength = 75
  const lines = []
  while (line.length > maxLineLength) {
    lines.push(line.slice(0, maxLineLength))
    line = ' ' + line.slice(maxLineLength)
  }
  lines.push(line)
  return lines.join('\r\n')
}

export interface CalendarEvent {
  uid: string
  summary: string
  timestamp: Date
  dateStart: Date
  dateEnd?: Date
  durationMinutes?: number
}

export default class Calendar {
  private events: CalendarEvent[] = []
  constructor(
    private prodId: string, // ie: -//ZContent.net//Zap Calendar 1.0//EN
    private uid: string,
    private name: string,
    private sourceUri: string,
  ) {}

  toString() {
    return [
      `BEGIN:VCALENDAR`,
      `VERSION:2.0`,
      `PRODID:${this.prodId}`,
      foldLine(`NAME:${this.name}`),
      foldLine(`X-WR-CALNAME:${this.name}`),
      this.sourceUri ? foldLine(`SOURCE;VALUE=URI:${this.sourceUri}`) : null,
      `UID:${this.uid}`,
      `CALSCALE:GREGORIAN`,
      `METHOD:PUBLISH`,
    ]
      .concat(
        ...this.events.map((event) => [
          `BEGIN:VEVENT`,
          `UID:${event.uid}`,
          foldLine(`SUMMARY:${event.summary}`),
          `DTSTAMP:${this.formatDate(event.timestamp)}`,
          `DTSTART:${this.formatDate(event.dateStart)}`,
          event.dateEnd ? `DTEND:${this.formatDate(event.dateEnd)}` : null,
          event.durationMinutes ? `DURATION:PT${event.durationMinutes}M` : null,
          `END:VEVENT`,
        ]),
      )
      .concat(`END:VCALENDAR`)
      .filter((item) => !!item)
      .join('\r\n')
  }
  private formatDate(date: Date) {
    const pad = (n: number) => (n < 10 ? '0' + n : n)

    const year = date.getUTCFullYear()
    const month = pad(date.getUTCMonth() + 1)
    const day = pad(date.getUTCDate())
    const hours = pad(date.getUTCHours())
    const minutes = pad(date.getUTCMinutes())
    const seconds = pad(date.getUTCSeconds())

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }
  addEvent(event: CalendarEvent) {
    this.events.push(event)
  }
}
