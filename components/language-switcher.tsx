"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/app/i18n/client"
import { languages } from "@/app/i18n/settings"

const languageNames: Record<string, string> = {
  en: "English",
  vi: "Tiếng Việt",
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentLanguage = i18n.language || "en"

  const handleLanguageChange = (language: string) => {
    // Close the popover
    setOpen(false)

    // Change the language
    startTransition(() => {
      i18n.changeLanguage(language)

      // Update URL to reflect language change
      // This is a simplified approach - in a real app you'd handle this more robustly
      const newPathname = pathname.startsWith(`/${currentLanguage}/`)
        ? pathname.replace(`/${currentLanguage}/`, `/${language}/`)
        : `/${language}${pathname}`

      router.push(newPathname)
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-1"
          aria-label={t("language")}
        >
          <Globe className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:ml-2">{languageNames[currentLanguage]}</span>
          <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No language found</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language}
                  value={language}
                  onSelect={() => handleLanguageChange(language)}
                  disabled={isPending}
                >
                  <Check className={cn("mr-2 h-4 w-4", currentLanguage === language ? "opacity-100" : "opacity-0")} />
                  {languageNames[language]}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
