import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '@/styles/globals.css'
import './layout.css'

/**
 * Root layout component for the entire site
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <div className="site-wrapper">
          <header className="site-header">
            <div className="container">
              <nav className="nav">
                <a href="/" className="logo">
                  <span className="badge badge-accent">Zero-JS components</span>
                  <span className="logo-text">CSS-Only</span>
                </a>
                <ul className="nav-links">
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/features/view-transitions">Features</a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/YehudaMenahem/css-only"
                      target="_blank"
                      rel="noopener"
                    >
                      Source
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="site-main">{children}</main>

          <footer className="site-footer">
            <div className="container">
              <p className="footer-text">
                Built by{' '}
                <a href="https://github.com" target="_blank" rel="noopener">
                  Yehuda Menahem
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

export const metadata = {
  title: 'CSS-Only Showcase',
  description:
    'Modern CSS replacing JavaScript in React components: measured trade-offs and CSS-only React components',
}
