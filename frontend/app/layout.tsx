import { Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/app/theme-provider';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { cn } from '@/lib/shadcn/utils';
import { getAppConfig, getStyles } from '@/lib/utils';
import '@/styles/globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const commitMono = localFont({
  display: 'swap',
  variable: '--font-commit-mono',
  src: [
    {
      path: '../fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-400-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/CommitMono-700-Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);
  const styles = getStyles(appConfig);
  const { pageTitle, pageDescription, companyName, logo, logoDark } = appConfig;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        publicSans.variable,
        commitMono.variable,
        'scroll-smooth font-sans antialiased'
      )}
    >
      <head>
        {styles && <style>{styles}</style>}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body
        className="bg-background text-foreground min-h-svh overflow-x-hidden"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="bg-background/50 fixed top-0 left-0 z-50 flex w-full items-center justify-between p-4 backdrop-blur-xs md:p-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://livekit.io"
              aria-label="LiveKit Website"
              className="scale-100 transition-transform duration-300 hover:scale-105"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={`${companyName} Logo`} className="block size-6 dark:hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoDark ?? logo}
                alt={`${companyName} Logo`}
                className="hidden size-6 dark:block"
              />
            </a>
            <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
              Built with{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.livekit.io/agents"
                aria-label="LiveKit Agents Documentation"
                className="hover:text-primary underline underline-offset-4"
              >
                LiveKit Agents
              </a>
            </span>
          </header>

          {children}

          <div className="group fixed bottom-2 left-1/2 z-50 -translate-x-1/2 sm:bottom-4">
            <ThemeToggle className="transition-transform delay-150 duration-300 sm:translate-y-20 sm:group-hover:translate-y-0" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
