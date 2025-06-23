import React from 'react'
import Hed from '../header/Header'
import Fot from '../footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header >
        <Hed/>
      </header>
      <main >
        <Outlet />
      </main>
      <footer>
        {/* <Fot/> */}
      </footer>
    </div>
  )
}

export default Layout



