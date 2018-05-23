import React from 'react'
import Head from 'next/head'

export default ({
  pageTitle = 'Next-express boilerplate',
  themeColor = '#AA244A',
  pageDescription = 'An amazingly default meta description',
  openGraph = 'static/images/opengraph.png',
  canonical = '/'
}) => (
  <Head>
    <meta httpEquiv='Content-Type' content='text/html; charSet=utf-8' />
    <meta
      name='viewport'
      content='initial-scale=1.0, width=device-width, shrink-to-fit=no'
    />
    <title>{pageTitle} | Example Company</title>
    <meta name='description' content={pageDescription} />
    <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
    <link
      rel='canonical'
      href={`https://www.example.com${canonical}`}
    />
    <link rel='author' href='/static/humans.txt' />
    <link
      href='https://plus.google.com/GOOGLE_PLUS_ACCOUNT_NUMBER'
      rel='publisher'
    />

    <link rel='dns-prefetch' href='https://example.com/' />
    <link rel='preconnect' href='https://www.example.com/' />
    <link rel='prefetch' href='https://www.example.com/' />
    <link rel='prerender' href='https://www.example.com/' />

    <meta name='robots' content='index,follow,noodp' />
    <meta name='googlebot' content='index,follow' />
    <meta name='url' content='https://www.example.com/' />
    <meta name='coverage' content='Worldwide' />
    <meta name='rating' content='General' />
    <meta name='copyright' content='Example Company' />

    <meta
      name='google-site-verification'
      content='GOOGLE_VERIFICATION_KEY'
    />
    <meta name='msvalidate.01' content='MS_VALIDATE_KEY' />

    <meta
      property='og:url'
      content={`https://www.example.com/${openGraph}`}
    />
    <meta property='og:type' content='website' />
    <meta property='og:title' content={pageTitle} />
    <meta
      property='og:image'
      content={`https://www.example.com/${openGraph}`}
    />
    <meta property='og:image:width' content='1200' />
    <meta property='og:image:height' content='630' />
    <meta property='og:image:alt' content='Example Company' />
    <meta property='og:description' content={pageDescription} />
    <meta property='og:site_name' content='Example Company' />
    <meta property='og:locale' content='en_US' />

    <meta
      name='twitter:card'
      content='The most amazing description, only the best.'
    />
    <meta name='twitter:site' content='@EmergencyU' />
    <meta name='twitter:url' content='https://www.example.com/' />
    <meta name='twitter:title' content='Example Company' />
    <meta name='twitter:description' content={pageDescription} />
    <meta
      name='twitter:image'
      content={`https://www.example.com/${openGraph}`}
    />

    {/* <link
      rel='apple-touch-icon'
      sizes='57x57'
      href='/static/images/icons/apple-icon-57x57.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='60x60'
      href='/static/images/icons/apple-icon-60x60.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='72x72'
      href='/static/images/icons/apple-icon-72x72.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='76x76'
      href='/static/images/icons/apple-icon-76x76.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='114x114'
      href='/static/images/icons/apple-icon-114x114.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='120x120'
      href='/static/images/icons/apple-icon-120x120.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='144x144'
      href='/static/images/icons/apple-icon-144x144.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='152x152'
      href='/static/images/icons/apple-icon-152x152.png'
    />
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href='/static/images/icons/apple-icon-180x180.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='192x192'
      href='/static/images/icons/android-icon-192x192.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='32x32'
      href='/static/images/icons/favicon-32x32.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='96x96'
      href='/static/images/icons/favicon-96x96.png'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='16x16'
      href='/static/images/icons/favicon-16x16.png'
    /> */}
    <link rel='manifest' href='/static/images/icons/manifest.json' />
    <meta name='msapplication-TileColor' content={themeColor} />
    {/* <meta
      name='msapplication-TileImage'
      content='/static/images/icons/ms-icon-144x144.png'
    /> */}
    <meta name='theme-color' content={themeColor} />
    {/* <link rel='shortcut icon' href='/static/images/icons/favicon.ico' /> */}
  </Head>
)
