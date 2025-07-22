package utils

func PickTranslation[T any](translations []T, locale string, getLocale func(T) string, setLocale func(*T, string)) []T {
	var selected, fallback *T

	for i, t := range translations {
		if getLocale(t) == locale {
			selected = &translations[i]
			break
		} else if getLocale(t) == "en" {
			fallback = &translations[i]
		}
	}

	if selected != nil {
		s := *selected
		setLocale(&s, locale)
		return []T{s}
	} else if fallback != nil {
		f := *fallback
		setLocale(&f, locale)
		return []T{f}
	}

	return []T{}
}