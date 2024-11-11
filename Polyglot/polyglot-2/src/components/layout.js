import Navigation from './Navigation'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

export default function Layout({ children }) {
    return (
        <>
            <Navigation />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}