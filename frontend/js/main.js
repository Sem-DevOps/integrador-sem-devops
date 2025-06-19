// URL del backend API
const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.whb-header');
    if (header) {
        let lastScroll = 0;
        
        function handleScroll() {
            const currentScroll = window.scrollY;

            if (currentScroll <= 0) {
                header.classList.remove('whb-sticked');
                return;
            }

            if (currentScroll > 50) {
                header.classList.add('whb-sticked');
            } else {
                header.classList.remove('whb-sticked');
            }

            lastScroll = currentScroll;
        }

        window.addEventListener('scroll', handleScroll);
    }

    const initSlider = () => {
        const slides = document.querySelectorAll('.hero-slide');
        const prevBtn = document.querySelector('.hero-nav-prev');
        const nextBtn = document.querySelector('.hero-nav-next');

        if (slides.length && prevBtn && nextBtn) {
            let currentSlide = 0;
            let isTransitioning = false;

            function showSlide(index) {
                if (isTransitioning) return;
                isTransitioning = true;

                slides[currentSlide].classList.remove('active');

                if (index >= slides.length) {
                    currentSlide = 0;
                } else if (index < 0) {
                    currentSlide = slides.length - 1;
                } else {
                    currentSlide = index;
                }

                slides[currentSlide].classList.add('active');

                setTimeout(() => {
                    isTransitioning = false;
                }, 500); 
            }

            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
            });

            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
            });

        }
    };

    const initProductsCarousel = () => {
        const productsGrid = document.querySelector('.products-grid');
        const productsSection = document.querySelector('.products .container');
        
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
        }
    };

    const initMobileMenu = () => {
        const burgerIcon = document.querySelector('.woodmart-burger-icon');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (burgerIcon && mobileNav) {
            burgerIcon.addEventListener('click', function() {
                burgerIcon.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });

            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    burgerIcon.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    };

    // Función para mostrar mensajes al usuario
    const showMessage = (message, type = 'success') => {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            transition: opacity 0.3s ease;
            ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    };

    // Función para enviar formularios
    const submitForm = async (endpoint, formData, successMessage) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(successMessage, 'success');
                return true;
            } else {
                showMessage(result.error || 'Error al enviar el formulario', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
            return false;
        }
    };

    // Manejar formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nombre: contactForm.nombre.value,
                email: contactForm.email.value,
                asunto: contactForm.asunto.value,
                mensaje: contactForm.mensaje.value
            };

            const success = await submitForm('/contacto', formData, '¡Mensaje enviado correctamente!');
            if (success) {
                contactForm.reset();
            }
        });
    }

    // Manejar formulario de trabajo
    const trabajoForm = document.querySelector('.trabajo-form');
    if (trabajoForm) {
        trabajoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                nombre: trabajoForm.nombre.value,
                apellido: trabajoForm.apellido.value,
                email: trabajoForm.email.value,
                telefono: trabajoForm.telefono.value,
                puesto: trabajoForm.puesto.value,
                mensaje: trabajoForm.mensaje ? trabajoForm.mensaje.value : ''
            };

            const success = await submitForm('/trabajo', formData, '¡Solicitud enviada correctamente!');
            if (success) {
                trabajoForm.reset();
            }
        });
    }

    // Manejar formularios de newsletter
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const formData = {
                email: emailInput.value
            };

            const success = await submitForm('/newsletter', formData, '¡Suscripción exitosa!');
            if (success) {
                emailInput.value = '';
            }
        });
    });

    initMobileMenu();
    initSlider();
    initProductsCarousel();
});