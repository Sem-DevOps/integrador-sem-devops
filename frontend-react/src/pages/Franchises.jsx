const Franchises = () => {
  return (
    <section className="trabajo-section">
      <div className="container">
        <div className="trabajo-header">
          <span className="trabajo-subtitle">EXPANDÍ CON NOSOTROS</span>
          <h2 className="trabajo-title">FRANQUICIAS</h2>
          <p className="trabajo-desc">
            Sumate a nuestra red de franquicias y llevá la tradición del mate a tu ciudad. 
            Ofrecemos un modelo de negocio probado, capacitación completa y soporte continuo 
            para que tu emprendimiento sea exitoso.
          </p>
        </div>

        <div className="promo-grid">
          <div className="promo-card">
            <img src="/img/mate-experto.png" alt="Franquicia de mate" />
            <div className="promo-content">
              <span>Oportunidad de inversión</span>
              <h3>MODELO DE NEGOCIO PROBADO</h3>
              <p>
                Nuestro sistema de franquicias está diseñado para maximizar tus posibilidades de éxito. 
                Te brindamos toda la experiencia y el conocimiento acumulado en años de trabajo en el sector.
              </p>
            </div>
          </div>
          <div className="promo-card">
            <img src="/img/productos/nuestras-yerbas.png" alt="Soporte franquicia" />
            <div className="promo-content">
              <span>Acompañamiento total</span>
              <h3>SOPORTE Y CAPACITACIÓN</h3>
              <p>
                Desde la apertura hasta el crecimiento de tu negocio, te acompañamos en cada paso. 
                Capacitación inicial, marketing, proveedores y asesoramiento continuo.
              </p>
            </div>
          </div>
        </div>

        <div className="tutorial-intro" style={{ paddingTop: '60px' }}>
          <div className="tutorial-text">
            <strong>¿Por qué elegir nuestra franquicia?</strong>
            <br /><br />
            • Marca reconocida en el mercado del mate<br />
            • Productos de alta calidad y diferenciados<br />
            • Sistema de gestión probado<br />
            • Capacitación integral<br />
            • Soporte de marketing y publicidad<br />
            • Exclusividad territorial<br />
            • ROI atractivo y rápida recuperación de inversión
          </div>

          <div className="tutorial-cta">
            ¿Estás listo para formar parte de nuestra familia?
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a href="/contacto" className="btn-dark">CONSULTAR INFORMACIÓN</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Franchises;