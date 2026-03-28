import { computed, ref } from 'vue'
import en from './locales/en'
import zh from './locales/zh'

export type Locale = 'en' | 'zh'

export interface LocaleInfo {
  code: Locale
  name: string
  nativeName: string
}

export const locales: LocaleInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
]

export const messages = {
  en,
  zh,
}

export function getDeviceLocale(): Locale {
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh'))
    return 'zh'
  return 'en'
}

const currentLocale = ref<Locale>(getDeviceLocale())

export function useI18n() {
  const locale = computed({
    get: () => currentLocale.value,
    set: (val: Locale) => {
      currentLocale.value = val
    },
  })

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let result: any = messages[currentLocale.value]
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      }
      else {
        return key
      }
    }
    let text = typeof result === 'string' ? result : key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      }
    }
    return text
  }

  return {
    locale,
    t,
    locales,
    setLocale: (locale: Locale) => {
      currentLocale.value = locale
    },
  }
}

export const i18n = {
  locale: currentLocale,
  t: (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.')
    let result: any = messages[currentLocale.value]
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k]
      }
      else {
        return key
      }
    }
    let text = typeof result === 'string' ? result : key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
      }
    }
    return text
  },
}
