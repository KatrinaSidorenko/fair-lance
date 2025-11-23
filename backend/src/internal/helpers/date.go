package helpers

import "time"

const (
	ISO8601Layout = "2006-01-02T15:04:05.000Z07:00"
)

func ParseISO8601Date(dateStr string) (time.Time, error) {
	return time.Parse(ISO8601Layout, dateStr)
}

func FormatISO8601Date(t time.Time) string {
	return t.Format(ISO8601Layout)
}

func GetCurrentTimeUTC() time.Time {
	return time.Now().UTC()
}
