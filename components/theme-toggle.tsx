import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div>
      {theme === "light" ? (
        <Button
          onClick={() => setTheme("dark")}
          className="outline-none focus:ring-0"
          variant="ghost"
          size="sm"
        >
          <Icons.sun className="w-6 h-6 " />
          <span className="sr-only">Toggle theme</span>
        </Button>
      ) : (
        <Button onClick={() => setTheme("light")} variant="ghost" size="sm">
          <Icons.moon className="w-6 h-6 dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </div>
  )
}
