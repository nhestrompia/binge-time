// import dynamic from "next/dynamic"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  // const ThemeToggle = dynamic(() => import("/components/theme-toggle"))

  return (
    <header className="top-0 z-40 w-full bg-transparent ">
      <div className="container flex items-center h-16 space-x-4 sm:space-x-0">
        {/* <div className="flex justify-center w-screen mt-10 ml-10">
          <div className="flex items-center justify-center px-4 py-2 mb-5 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100">
            <div className="flex flex-row space-x-4">
              <p>Project</p>
              <Link href={"https://github.com/nhestrompia/binge-time"}>
                <Icons.gitHub className="w-4 h-4 mt-0.5  dark:text-[#3F0071]" />
              </Link>
              <p>made by</p>
              <Link href={"https://twitter.com/nhestrompia"}>
                <Icons.twitter className="w-4 h-4 mt-0.5 dark:text-[#3F0071]" />
              </Link>
            </div>
          </div>
        </div> */}
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
