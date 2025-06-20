import  { useRef, useEffect } from 'react';

const ProductsSection = () => {
  const productsGridRef = useRef(null);

  const products = [
    {
      name: "Mate Imperial",
      image: "/img/productos/mate-imperial.png",
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
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
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
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
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
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
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Artesanal",
      image: "/img/productos/mate-mathienzo.png",
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Moderno",
      image: "/img/productos/mate-torpedo.png",
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Imperial",
      image: "/img/productos/mate-camionero.png",
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    },
    {
      name: "Mate Vidrio",
      image: "/img/productos/mate-imperial.png",
      description: "DISFRUTÁ LA EXPERIENCIA TIENDA EN TU CASA.",
      characteristics: [
        { label: "TRADICIONAL", sublabel: "(Sabor clásico)", width: "80%" },
        { label: "SUAVIDAD", sublabel: "(Amargor bajo)", width: "40%" },
        { label: "CUERPO", sublabel: "(Consistencia)", width: "60%" },
        { label: "DURABILIDAD", sublabel: "(Resistencia)", width: "70%" }
      ]
    }
  ];

  useEffect(() => {
    const productsGrid = productsGridRef.current;
    const productsSection = productsGrid?.parentElement;
    
    if (productsGrid && productsSection) {
      const prevButton = document.createElement('button');
      prevButton.className = 'products-nav-prev';
      prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
      
      const nextButton = document.createElement('button');
      nextButton.className = 'products-nav-next';
      nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
      
      productsSection.appendChild(prevButton);
      productsSection.appendChild(nextButton);
      
      const nav = document.createElement('div');
      nav.className = 'products-nav';
      
      const totalDots = Math.ceil(productsGrid.children.length / 5);
      
      for(let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => scrollToSection(i));
        nav.appendChild(dot);
      }
      
      productsSection.appendChild(nav);
      
      function scrollToSection(index) {
        const cardWidth = productsGrid.children[0].offsetWidth;
        const gap = 2; 
        const scrollPosition = index * (cardWidth + gap) * 5;
        productsGrid.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
      
      prevButton.addEventListener('click', () => {
        const cardWidth = productsGrid.children[0].offsetWidth;
        productsGrid.scrollBy({
          left: -((cardWidth + 2) * 5),
          behavior: 'smooth'
        });
      });
      
      nextButton.addEventListener('click', () => {
        const cardWidth = productsGrid.children[0].offsetWidth;
        const containerWidth = productsGrid.offsetWidth;
        const maxScroll = productsGrid.scrollWidth - containerWidth;
        
        const nextScroll = Math.min(productsGrid.scrollLeft + (cardWidth + 2) * 4, maxScroll);
        
        productsGrid.scrollTo({
          left: nextScroll,
          behavior: 'smooth'
        });
      });
      
      productsGrid.addEventListener('scroll', () => {
        const cardWidth = productsGrid.children[0].offsetWidth;
        const gap = 2;
        const scrollPosition = productsGrid.scrollLeft;
        const activeIndex = Math.round(scrollPosition / ((cardWidth + gap) * 5));
        
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === activeIndex);
        });
      });

      return () => {
        prevButton.remove();
        nextButton.remove();
        nav.remove();
      };
    }
  }, []);

  return (
    <section className="products">
      <div className="container">
        <div className="section-title">
          <h2>NUESTROS PRODUCTOS</h2>
        </div>
        <div className="products-grid" ref={productsGridRef}>
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
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

export default ProductsSection;