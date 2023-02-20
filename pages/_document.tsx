import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-[#F7FFF7] font-sans  text-slate-900 antialiased dark:bg-[#3c1053] dark:text-slate-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
