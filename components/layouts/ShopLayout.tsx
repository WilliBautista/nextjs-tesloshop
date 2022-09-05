import Head from 'next/head'
import { FC } from 'react'
import { Navbar, SideMenu } from '../ui'

interface Props {
  children: JSX.Element | JSX.Element[];
  metatitle: string;
  metadescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<Props> = ({ children, metatitle, metadescription, imageFullUrl }) => {
  return (
    <>
      <Head>
        <title>{ metatitle }</title>
        <meta name='description' content={ metadescription } />
        <meta name='og:title' content={ metatitle } />
        <meta name='og:description' content={ metadescription } />

        {
          imageFullUrl && (
            <meta name='og:image' content={ imageFullUrl } />
          )
        }
      </Head>

      <header>
        <nav>
          <Navbar />
        </nav>
      </header>

      <SideMenu />

      <main style={{
        margin: '80px auto',
        maxWidth: '1440px',
        padding: '0 30px'
      }}>
        { children }
      </main>

      <footer>
        {/* Footer */}
      </footer>
    </>
  )
}

export default ShopLayout
