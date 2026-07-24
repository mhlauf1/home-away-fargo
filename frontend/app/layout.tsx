import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Bricolage_Grotesque, Geist} from 'next/font/google'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import TrackingRouteEvents from '@/app/components/TrackingRouteEvents'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, servicesNavQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, urlForImage} from '@/sanity/lib/utils'
import {SITE_URL} from '@/app/lib/constants'
import Script from 'next/script'
import {GoogleTagManager} from '@next/third-parties/google'
import {handleError} from '@/app/client-utils'

// Expand abbreviated day ranges ("Mo-Fr", "Sa") into schema.org day names
const DAY_NAMES: Record<string, string> = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
}

function expandDayOfWeek(days?: string): string | string[] | undefined {
  if (!days) return undefined
  const order = Object.keys(DAY_NAMES)
  const range = days.match(/^(\w{2})-(\w{2})$/)
  if (range && DAY_NAMES[range[1]] && DAY_NAMES[range[2]]) {
    const start = order.indexOf(range[1])
    const end = order.indexOf(range[2])
    if (start !== -1 && end !== -1 && start <= end) {
      return order.slice(start, end + 1).map((d) => DAY_NAMES[d])
    }
  }
  if (DAY_NAMES[days]) return DAY_NAMES[days]
  return days
}

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
    url: SITE_URL,
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
        dayOfWeek: expandDayOfWeek(h.days),
        opens: h.open,
        closes: h.close,
      }),
    )
  }

  const image = settings?.ogImage?.asset?._ref
    ? urlForImage(settings.ogImage).width(1200).url()
    : settings?.logo?.asset?._ref
      ? urlForImage(settings.logo).url()
      : null
  if (image) {
    jsonLd.image = image
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
  let metadataBase = new URL(SITE_URL)
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : metadataBase
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
  const ctmScriptUrl = settings?.ctmScriptUrl

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
    <html lang="en" className={`${bricolage.variable} ${geist.variable} bg-cream text-forest`}>
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
                url: SITE_URL,
                ...(settings?.logo?.asset?._ref && {
                  logo: urlForImage(settings.logo).url(),
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
                url: SITE_URL,
              }),
            }}
          />
        )}
        {ctmScriptUrl && <Script async src={ctmScriptUrl} strategy="afterInteractive" />}
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
        <Suspense fallback={null}>
          <TrackingRouteEvents />
        </Suspense>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
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
      </body>
    </html>
  )
}
