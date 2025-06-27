import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { showMessage } from '../utils/toast';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        mode: 'cors',
        credentials: 'omit'
      });

      if (response.ok) {
        showMessage('¡Suscripción exitosa!', 'success');
        setEmail('');
      } else {
        const result = await response.json();
        showMessage(result.error || 'Error al suscribirse. Inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
    }
  };

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <img src="/img/logo.svg" alt="Tienda de Mate" className="footer-logo" />
          </div>
          <div className="footer-col">
            <h4>Contenidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/tienda">Nuestro Mate</Link></li>
              <li><Link to="/menu-tienda">Nuestro menú</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Necesitás Ayuda</h4>
            <ul>
              <li><Link to="/tutoriales">Tutoriales</Link></li>
              <li><Link to="/trabaja">Trabajá con nosotros</Link></li>
              <li><Link to="/franquicias">Franquicias</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Tu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Suscribirme</button>
            </form>
            <h4 className="conectate">CONECTATE CON NOSOTROS</h4>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <p>© 2025 Tienda de Mate - Todos los derechos reservados -  Ailín Ojeda Pytel - Ciro Villasanti </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;