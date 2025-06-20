import  { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isDarkHeader = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll <= 0) {
        setIsSticky(false);
        return;
      }

      if (currentScroll > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <header className={`whb-header ${isDarkHeader ? 'whb-header-dark' : ''} whb-sticky-shadow whb-scroll-slide whb-sticky-real ${isSticky ? 'whb-sticked' : ''}`}>
        <div className="whb-main-header">
          <div className="whb-row whb-general-header whb-sticky-row">
            <div className="container">
              <div className="whb-flex-row whb-general-header-inner">
                {/* Logo */}
                <div className="site-logo">
                  <div className="woodmart-logo-wrap">
                    <Link
                      to="/"
                      className="woodmart-logo woodmart-main-logo"
                      rel="home"
                    >
                      <img
                        src="/img/logo.svg"
                        alt="Tienda de Mate"
                        className="header-logo"
                      />
                    </Link>
                  </div>
                </div>

                {/* Desktop Navigation */}
                <div className="whb-column whb-col-center whb-visible-lg">
                  <div className="whb-navigation whb-primary-menu">
                    <nav className="main-nav site-navigation woodmart-navigation menu-center">
                      <ul className="menu">
                        <li>
                          <Link to="/tienda"><span>NUESTRO MATE</span></Link>
                        </li>
                        <li>
                          <Link to="/tutoriales"><span>TUTORIALES</span></Link>
                        </li>
                        <li>
                          <Link to="/menu-tienda"><span>NUESTRO MENÚ</span></Link>
                        </li>
                        <li>
                          <Link to="/trabaja"><span>TRABAJÁ CON NOSOTROS</span></Link>
                        </li>
                        <li>
                          <Link to="/franquicias"><span>FRANQUICIAS</span></Link>
                        </li>
                        <li>
                          <Link to="/contacto"><span>CONTACTO</span></Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Right column (empty on desktop) */}
                <div className="whb-column whb-col-right whb-visible-lg whb-empty-column"></div>

                {/* Mobile menu button */}
                <div className="whb-column whb-mobile-left whb-hidden-lg">
                  <div className="woodmart-burger-icon" onClick={toggleMobileMenu}>
                    <span className="woodmart-burger"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul className="menu">
          <li>
            <Link to="/tienda" onClick={closeMobileMenu}><span>NUESTRO MATE</span></Link>
          </li>
          <li>
            <Link to="/tutoriales" onClick={closeMobileMenu}><span>TUTORIALES</span></Link>
          </li>
          <li>
            <Link to="/menu-tienda" onClick={closeMobileMenu}><span>NUESTRO MENÚ</span></Link>
          </li>
          <li>
            <Link to="/trabaja" onClick={closeMobileMenu}><span>TRABAJÁ CON NOSOTROS</span></Link>
          </li>
          <li>
            <Link to="/franquicias" onClick={closeMobileMenu}><span>FRANQUICIAS</span></Link>
          </li>
          <li>
            <Link to="/contacto" onClick={closeMobileMenu}><span>CONTACTO</span></Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;