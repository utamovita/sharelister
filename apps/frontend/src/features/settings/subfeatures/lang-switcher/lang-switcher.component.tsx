"use client";

import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { languages } from "@/shared/lib/i18n/client";
import { useUpdateLanguage } from "./use-update-language.hook";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation("common");
  const { mutate: updateLanguage } = useUpdateLanguage();

  const handleChangeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    updateLanguage({ lang: langCode as "pl" | "en" });
  };

  const currentLanguage = i18n.language?.split("-")[0];

  console.log("Current language:", i18n.language);
  return (
    <div className="space-y-2">
      <Label>{t("settings.app.language")}</Label>
      <Select value={currentLanguage} onValueChange={handleChangeLanguage}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("settings.app.language")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
