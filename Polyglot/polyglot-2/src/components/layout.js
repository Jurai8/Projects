import Navigation from './Navigation'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {

    const location = useLocation();
    const hideOnPaths = ['/signin', '/signup']; // add more routes here

    const shouldHideLayout = hideOnPaths.includes(location.pathname);

    //TODO: only display a link to the about us page when on the home page and the user hasn't signed in.
    return (
        <>
            <Navigation />
            
            <main id='main-container'>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}