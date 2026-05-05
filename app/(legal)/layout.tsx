import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSiteSettings } from "@/lib/actions/settings"

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary hover:prose-a:opacity-80">
            {children}
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
