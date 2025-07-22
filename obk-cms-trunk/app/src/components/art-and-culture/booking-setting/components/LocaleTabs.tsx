import { Tab, TabList, Tabs } from '@chakra-ui/react'
import clsx from 'clsx'

export enum TABS_LOCALE {
  Th = 'Th',
  En = 'En',
  Cn = 'Cn',
}

export const LocaleTabsLabelMapper = {
  [TABS_LOCALE.En]: 'English',
  [TABS_LOCALE.Th]: 'Thai (ไทย)',
  [TABS_LOCALE.Cn]: 'Simplify Chinese (简体中文)',
}

interface Props {
  locale: TABS_LOCALE
  onLocaleChange: (locale: TABS_LOCALE) => void
}

export function LocaleTabs({ locale, onLocaleChange }: Props) {
  const handleFormLocaleChange = (tabLocale: TABS_LOCALE) => {
    onLocaleChange(tabLocale)
  }

  return (
    <Tabs className='locale-tabs'>
      <TabList className='tabs-list'>
        {Object.keys(LocaleTabsLabelMapper).map((key) => (
          <Tab
            key={key}
            className={clsx(['tab', locale === key && 'active'])}
            onClick={() =>
              handleFormLocaleChange(key as keyof typeof LocaleTabsLabelMapper)
            }
          >
            {LocaleTabsLabelMapper[key as keyof typeof LocaleTabsLabelMapper]}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
