"use client";

import { MoonStarIcon, MonitorCogIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  { value: "light", label: "Light", icon: SunMediumIcon },
  { value: "dark", label: "Dark", icon: MoonStarIcon },
  { value: "system", label: "System", icon: MonitorCogIcon },
] as const;

function getThemeIcon(theme: string | undefined) {
  if (theme === "light") {
    return <SunMediumIcon className="size-4" />;
  }

  if (theme === "dark") {
    return <MoonStarIcon className="size-4" />;
  }

  return <MonitorCogIcon className="size-4" />;
}

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Thema kiezen">
        {getThemeIcon(theme)}
        Theme
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Weergave</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;

            return (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                closeOnClick
              >
                <OptionIcon className="size-4" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
