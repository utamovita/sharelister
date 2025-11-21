import { useLogout } from "@/features/auth/hooks/use-logout.hook";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useTranslation } from "react-i18next";
import { Switch } from "@/shared/ui/switch";
import { useTheme } from "next-themes";
import { LanguageSwitcher } from "@/features/settings/subfeatures/lang-switcher/lang-switcher.component";
import { UpdateProfileForm } from "@/features/settings/subfeatures/update-username/update-username-form.component";
import { DeleteAccountButton } from "@/features/settings/subfeatures/delete-account/delete-account-button.component";

type SettingsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { t } = useTranslation("common");
  const { handleLogout } = useLogout();
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>{t("settings.title")}</SheetTitle>
          <SheetDescription>{t("settings.app.description")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <SheetItem title={t("settings.account.title")}>
            <UpdateProfileForm />
          </SheetItem>
          <SheetItem title={t("settings.app.title")}>
            <LanguageSwitcher />

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label
                htmlFor="dark-mode"
                className="flex flex-col space-y-1 items-start"
              >
                <span>{t("settings.app.theme")}</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  {t("settings.app.themeDescription")}
                </span>
              </Label>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>
          </SheetItem>

          <SheetItem title={t("settings.notifications.title")}>
            <Select disabled>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("settings.notifications.immediately")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">
                  {t("settings.notifications.immediately")}
                </SelectItem>
                <SelectItem value="hourly">
                  {t("settings.notifications.hourly")}
                </SelectItem>
                <SelectItem value="daily">
                  {t("settings.notifications.daily")}
                </SelectItem>
              </SelectContent>
            </Select>
          </SheetItem>

          <SheetItem title={t("settings.dangerZone.title")}>
            <DeleteAccountButton />
          </SheetItem>
        </div>

        <SheetFooter className="p-6 pt-4 mt-auto border-t">
          <div className="w-full space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              {t("auth.logout")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SheetItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{title}</h4>
      {children}
    </div>
  );
}
