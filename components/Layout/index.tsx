import React, { Fragment, useCallback, useState } from 'react'

import Navbar from '../Navbar'
import Cart from '../Cart'
import Header from '../Header'

interface LayoutProp {
  children: JSX.Element
}

const Layout = ({ children }: LayoutProp) => {
  const [cartOpen, setCartOpen] = useState(false)

  const handleOpenCart = useCallback(() => setCartOpen(true), [])

  const handleCloseCart = useCallback(() => setCartOpen(false), [])

  return (
    <Fragment>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Header />
        <Navbar showCart={handleOpenCart} />
        <Cart show={cartOpen} onClose={handleCloseCart} />
        <main
        // className="flex w-full flex-1 flex-col items-center justify-center text-center"
        >
          {children}
        </main>

        {/* <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer> */}
      </div>
    </Fragment>
  )
}

export default Layout
