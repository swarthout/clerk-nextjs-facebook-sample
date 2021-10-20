import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import Link from 'next/link'

/**
 * List pages you want to be publicly accessible, or leave empty if
 * every page requires authentication. Use this naming strategy:
 *  "/"              for pages/index.js
 *  "/foo"           for pages/foo/index.js
 *  "/foo/bar"       for pages/foo/bar.js
 *  "/foo/[...bar]"  for pages/foo/[...bar].js
 */
const publicPages = ['/', '/sign-in/[[...index]]', '/sign-up/[[...index]]']

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()

  /**
   * If the current route is listed as public, render it directly.
   * Otherwise, use Clerk to require authentication.
   */
  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/prismjs@1/themes/prism.css"
          rel="stylesheet"
        />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
      <main>
        {publicPages.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : (
          <>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <main>
                <p>
                  Please{' '}
                  <Link href="/sign-in">
                    <a>sign in</a>
                  </Link>{' '}
                  to access this page.
                </p>
              </main>
            </SignedOut>
          </>
        )}
      </main>
    </ClerkProvider>
  )
}

export default MyApp
