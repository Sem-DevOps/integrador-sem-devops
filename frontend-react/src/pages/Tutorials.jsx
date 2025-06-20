const Tutorials = () => {
  return (
    <div>
      <section className="tutorial-intro">
        <div className="container">
          <div className="section-title">
            <h2>TUTORIALES</h2>
          </div>
          
          <div className="tutorial-text">
            El mate es mucho más que una simple infusión; es una tradición que nos conecta con nuestras raíces, 
            un ritual que une familias y amigos. Preparar un buen mate es un arte que se transmite de generación en generación.
          </div>

          <div className="tips-section">
            <div className="tips-title">Consejos para el mate perfecto:</div>
            <div className="tip-text">• Usar agua a temperatura adecuada (70-80°C)</div>
            <div className="tip-text">• No mojar toda la yerba de una vez</div>
            <div className="tip-text">• Mantener la bombilla en el mismo lugar</div>
            <div className="tip-text">• Cebar siempre del mismo lado</div>
          </div>

          <div className="tutorial-cta">
            Descubrí los secretos para preparar el mate perfecto
          </div>

          <div className="tutorials-grid">
            <div className="tutorial-promo-card">
              <img src="" alt="" />
              <div className="tutorial-content">
                <h2>CÓMO PREPARAR<br />EL MATE PERFECTO</h2>
                <a href="#" className="btn-tutorial">VER TUTORIAL</a>
              </div>
            </div>
            
            <div className="tutorial-promo-card">
              <img src="" alt="" />
              <div className="tutorial-content">
                <h2>CURADO Y CUIDADO<br />DE TU MATE</h2>
                <a href="#" className="btn-tutorial">VER TUTORIAL</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tutorials;