import { Languages, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useT } from "@/lib/i18n";

/** Compact globe button used inside the app header. */
export const LanguageSwitcher = () => {
  const { lang, setLang, t } = useT();
  const current = LANGS.find(l => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="p-2 rounded-full hover:bg-accent/15 text-maroon inline-flex items-center gap-1"
        aria-label={t("common.language")}
      >
        <Languages className="w-5 h-5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">
          {current.code}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("common.language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGS.map(l => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="flex flex-col">
              <span className="text-sm font-medium text-maroon">{l.native}</span>
              <span className="text-[10px] text-muted-foreground">{l.label}</span>
            </span>
            {l.code === lang && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
