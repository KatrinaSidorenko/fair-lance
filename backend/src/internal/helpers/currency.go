package helpers

import "fmt"

var SupportedCurrencies = map[string]bool{
	"ETH": true,
	"wei": true,
}

const DefaultCurrency = "wei"
const DefaultCurrencyDisplay = "ETH"

func IsCurrencySupported(currency string) bool {
	_, exists := SupportedCurrencies[currency]
	return exists
}

func ToWei(amount float64, currency string) (float64, error) {
	switch currency {
	case "wei":
		return amount, nil
	case "ETH":
		return amount * 1e18, nil
	}

	return 0, fmt.Errorf("unsupported currency: %s", currency)
}

func FromWei(amount float64, currency string) (float64, error) {
	switch currency {
	case "wei":
		return amount, nil
	case "ETH":
		return amount / 1e18, nil
	}
	return 0, fmt.Errorf("unsupported currency: %s", currency)
}
