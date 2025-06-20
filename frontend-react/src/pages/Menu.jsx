const Menu = () => {
  return (
    <div>
      <section className="menu-grid-section">
        <div className="container">
          <div className="section-title">
            <h2>NUESTRO MENÚ</h2>
          </div>

          {/* Dulzuras Grid */}
          <div className="menu-grid-dulzuras">
            <div className="left-column">
              <div className="menu-item large">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">DULCES</span>
                  <h2>NUESTRAS<br />DULZURAS</h2>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="menu-item">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">ESPECIALIDAD</span>
                  <h2>ALFAJORES<br />ARTESANALES</h2>
                </div>
              </div>
              <div className="menu-item">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">CASERO</span>
                  <h2>TORTAS Y<br />POSTRES</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Salados Grid */}
          <div className="menu-grid-salados">
            <div className="left-column">
              <div className="menu-item large">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">SALADOS</span>
                  <h2>OPCIONES<br />SALADAS</h2>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="menu-item">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">FRESCO</span>
                  <h2>SÁNDWICHES<br />Y TOSTADOS</h2>
                </div>
              </div>
              <div className="menu-item">
                <img src="" alt="" />
                <div className="menu-item-title">
                  <span className="subtitle">CASERO</span>
                  <h2>EMPANADAS<br />ARTESANALES</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Wide Grid */}
          <div className="menu-grid-wide">
            <div className="menu-item">
              <img src="" alt="" />
              <div className="menu-item-title">
                <span className="subtitle">BEBIDAS</span>
                <h2>BEBIDAS CALIENTES Y FRÍAS</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Menu;