
const Store = () => {
  const products = [
    {
      name: "Mate Imperial",
      image: "/img/productos/mate-imperial.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Camionero",
      image: "/img/productos/mate-camionero.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Mathienzo",
      image: "/img/productos/mate-mathienzo.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Torpedo",
      image: "/img/productos/mate-torpedo.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Camionero",
      image: "/img/productos/mate-camionero.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Camionero",
      image: "/img/productos/mate-camionero.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Torpedo",
      image: "/img/productos/mate-torpedo.png",
      description: "DISFRUTÁ LA EXPERIENCIA DEL MATE TRADICIONAL EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    }
  ];

  return (
    <section className="store-products">
      <div className="container">
        <div className="products-store-grid">
          {products.map((product, index) => (
            <div key={index} className="product-card store-variant">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <div className="product-overlay">
                <div className="overlay-content">
                  <p className="overlay-desc">{product.description}</p>
                  <div className="intensity-section">
                    <h4>CARACTERÍSTICAS</h4>
                    <div className="intensity-bars">
                      {product.characteristics.map((char, charIndex) => (
                        <div key={charIndex} className="intensity-item">
                          <span className="intensity-label">{char.label}</span>
                          <span className="intensity-sublabel">{char.sublabel}</span>
                          <div className="intensity-bar" style={{ width: char.width }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Store;