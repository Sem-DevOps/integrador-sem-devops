
const ChooseSection = () => {
  const mateTypes = {
    left: [
      {
        name: "IMPERIAL",
        description: "Nuestro tradicional mate de calabaza, el favorito de la casa. Con virola de alpaca y detalles artesanales, este mate te brindará una experiencia única y tradicional. Ideal para los amantes del mate tradicional."
      },
      {
        name: "CAMIONERO",
        description: "Robusto y confiable, este mate de calabaza forrado en cuero es el compañero perfecto para tus viajes. Su diseño resistente y práctico lo hace ideal para el día a día."
      },
      {
        name: "TORPEDO",
        description: "Con su forma característica y elegante, este mate de calabaza es perfecto para quienes buscan un mate con personalidad. Su diseño alargado permite una mayor capacidad."
      }
    ],
    right: [
      {
        name: "MATHIENZO",
        description: "Nuestro mate premium, elaborado con las mejores calabazas seleccionadas y trabajado artesanalmente. Cada pieza es única, con detalles en alpaca y cuero de primera calidad."
      },
      {
        name: "ARTESANAL",
        description: "Si buscás un mate con historia, nuestros mates artesanales son creados por artesanos locales, cada uno con su propio estilo y personalidad. Perfectos para quienes valoran lo auténtico."
      },
      {
        name: "MODERNO",
        description: "Para los amantes del diseño contemporáneo, nuestra línea moderna combina materiales innovadores con la tradición del mate. Prácticos y elegantes."
      }
    ]
  };

  return (
    <section className="choose-section">
      <div className="container">
        <div className="section-header">
          <span className="subtitle">NUESTRO MATE</span>
          <h2 className="title">¿CUÁL VAS A ELEGIR HOY?</h2>
        </div>

        <div className="mate-types-grid">
          {/* Left column */}
          <div className="left-column">
            {mateTypes.left.map((mate, index) => (
              <div key={index} className="mate-type">
                <h3>{mate.name}</h3>
                <p>{mate.description}</p>
              </div>
            ))}
          </div>

          {/* Center image */}
          <div className="center-image">
            <img
              src="/img/productos/mate-imperial-playa.png"
              alt="Mate cebado tradicional"
            />
          </div>

          {/* Right column */}
          <div className="right-column">
            {mateTypes.right.map((mate, index) => (
              <div key={index} className="mate-type">
                <h3>{mate.name}</h3>
                <p>{mate.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseSection;