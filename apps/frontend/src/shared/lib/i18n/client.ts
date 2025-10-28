"use client";

import i18next from "i18next";

import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";

export const languages = [
  { code: "pl", name: "Polski" },
  { code: "en", name: "English" },
] as const;

const supportedLngs = languages.map((lang) => lang.code);

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@repo/i18n/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    supportedLngs,
    fallbackLng: "en",
    load: "languageOnly",
    defaultNS: "common",
    fallbackNS: ["validation", "common"],
    ns: ["common", "validation"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18next;
