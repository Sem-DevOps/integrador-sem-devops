import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      title: "Tu mate favorito",
      subtitle: "SIEMPRE CERCA",
      description: "Yerbas selectas, mates artesanales y accesorios.\nEncontrá tu Tienda mas cercana y descubrí nuestros productos.",
      buttonText: "",
      buttonLink: "",
      showButton: false
    },
    {
      title: "Descubrí nuestra selección",
      subtitle: "MATES ARTESANALES",
      description: "Cada pieza cuenta una historia única.\nElegí el mate que más se adapte a tu estilo.",
      buttonText: "VER MÁS",
      buttonLink: "/tienda",
      showButton: true
    },
    {
      title: "Expertos en yerba mate",
      subtitle: "TRADICIÓN Y CALIDAD",
      description: "Las mejores yerbas seleccionadas.\nDescubrí el verdadero sabor del mate.",
      buttonText: "EXPLORAR",
      buttonLink: "/menu-tienda",
      showButton: true
    }
  ];

  const showSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    let newIndex;
    if (index >= slides.length) {
      newIndex = 0;
    } else if (index < 0) {
      newIndex = slides.length - 1;
    } else {
      newIndex = index;
    }

    setCurrentSlide(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1);
  };

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div
              className="hero-slide-bg"
              style={{ backgroundImage: "url('/img/mate-portada.png')" }}
            ></div>
            <div className="hero-content">
              <h2>{slide.title}</h2>
              <h1>{slide.subtitle}</h1>
              <p>
                {slide.description.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < slide.description.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
              {slide.showButton && (
                <Link to={slide.buttonLink} className="btn-primary">
                  {slide.buttonText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hero-nav">
        <button className="hero-nav-prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="hero-nav-next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;