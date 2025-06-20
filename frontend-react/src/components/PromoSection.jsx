import { Link } from 'react-router-dom';

const PromoSection = () => {
  return (
    <section className="promo-section">
      <div className="container">
        <div className="promo-grid">
          <div className="promo-card">
            <img src="/img/mate-experto.png" alt="Aprende a cebar mate" />
            <div className="promo-content">
              <span>Aprendé a preparar tu mate como un experto</span>
              <h3>SECRETOS DEL MATERO</h3>
              <Link to="/tutoriales" className="btn-dark">VER</Link>
            </div>
          </div>
          <div className="promo-card">
            <img src="/img/productos/nuestras-yerbas.png" alt="Nuestros productos" />
            <div className="promo-content">
              <span>Conocé todo lo que podés encontrar en nuestros locales</span>
              <h3>NUESTRAS YERBAS</h3>
              <Link to="/menu-tienda" className="btn-dark">VER</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;