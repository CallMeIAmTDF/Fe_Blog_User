"use client"

import { useEffect, useState } from "react"
import i18next from "i18next"
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import LanguageDetector from "i18next-browser-languagedetector"
import { getOptions } from "./settings"

// Initialize i18next for client-side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    },
  })

export function useTranslation(ns = "common") {
  const [mounted, setMounted] = useState(false)
  const ret = useTranslationOrg(ns)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return { t: (key: string) => key, i18n: ret.i18n }

  return ret
}
