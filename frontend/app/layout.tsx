import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Lora, Nunito, Plus_Jakarta_Sans, Playfair_Display, Inter} from 'next/font/google'

// Hearthstone fonts
const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Prairie Modern fonts
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Farmstead Blue fonts
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import ThemeToggle from '@/app/components/dev/ThemeToggle'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, servicesNavQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import Script from 'next/script'
import {handleError} from '@/app/client-utils'

function buildLocalBusinessJsonLd(settings: any) {
  const lb = settings?.localBusiness
  if (!lb?.businessName) return null

  const sameAs = [
    settings?.socialLinks?.facebook,
    settings?.socialLinks?.instagram,
    settings?.socialLinks?.google,
  ].filter(Boolean)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': lb.businessType || 'LocalBusiness',
    name: lb.businessName,
    telephone: lb.phone,
    priceRange: lb.priceRange,
    ...(sameAs.length > 0 && {sameAs}),
  }

  if (lb.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: lb.address.street,
      addressLocality: lb.address.city,
      addressRegion: lb.address.state,
      postalCode: lb.address.zip,
      addressCountry: lb.address.country || 'US',
    }
  }

  if (lb.geoCoordinates?.latitude && lb.geoCoordinates?.longitude) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: lb.geoCoordinates.latitude,
      longitude: lb.geoCoordinates.longitude,
    }
  }

  if (lb.businessHours?.length) {
    jsonLd.openingHoursSpecification = lb.businessHours.map(
      (h: {days?: string; open?: string; close?: string}) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.open,
        closes: h.close,
      }),
    )
  }

  if (settings?.ogImage?.asset?._ref) {
    const logoUrl = settings?.logo?.asset?._ref
    if (logoUrl) {
      jsonLd.image = logoUrl
    }
  }

  return jsonLd
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const title = settings?.title || 'Home Away From Home'
  const description = settings?.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description ? toPlainText(description) : '',
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    ...(settings?.faviconUrl && {
      icons: {
        icon: settings.faviconUrl,
        apple: settings.faviconUrl,
      },
    }),
    ...(settings?.googleSiteVerification && {
      verification: {
        google: settings.googleSiteVerification,
      },
    }),
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const [{data: settings}, {data: services}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: servicesNavQuery}),
  ])

  const localBusinessJsonLd = buildLocalBusinessJsonLd(settings)
  const ga4Id = settings?.ga4MeasurementId
  const gtmId = settings?.gtmContainerId

  // Inject services as dropdown children into the "Services" nav item
  const navItems = settings?.navItems?.map((item: any) => {
    if (item.label === 'Services' && services && services.length > 0) {
      return {
        ...item,
        children: services.map((service: any) => ({
          _key: service._id,
          label: service.title,
          link: {linkType: 'href', href: `/services/${service.slug}`},
        })),
      }
    }
    return item
  })

  return (
    <html lang="en" data-theme="hearthstone" className={`${lora.variable} ${nunito.variable} ${jakarta.variable} ${playfair.variable} ${inter.variable} bg-cream text-forest`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />
        {localBusinessJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(localBusinessJsonLd)}}
          />
        )}
        {settings?.title && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: settings.title,
                url: settings?.ogImage?.metadataBase || undefined,
                ...(settings?.logo?.asset?._ref && {
                  logo: settings.logo.asset._ref,
                }),
                sameAs: [
                  settings?.socialLinks?.facebook,
                  settings?.socialLinks?.instagram,
                  settings?.socialLinks?.google,
                ].filter(Boolean),
              }),
            }}
          />
        )}
        {settings?.title && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: settings.title,
                url: settings?.ogImage?.metadataBase || undefined,
              }),
            }}
          />
        )}
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {ga4Id && !gtmId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>
        )}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header navItems={navItems as any} ctaButton={settings?.ctaButton as any} logo={settings?.logo as any} />
        <main>{children}</main>
        <Footer
          tagline={settings?.footerTagline ?? undefined}
          columns={settings?.footerColumns as any}
          contactInfo={settings?.contactInfo as any}
          footerText={settings?.footerText ?? undefined}
          footerTextLink={settings?.footerTextLink as any}
          bottomLinks={settings?.footerBottomLinks as any}
          logo={settings?.logo as any}
          socialLinks={settings?.socialLinks as any}
          footerSticker={settings?.footerSticker as any}
        />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE === 'true' && <ThemeToggle />}
      </body>
    </html>
  )
}
