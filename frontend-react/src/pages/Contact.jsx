import { useState } from 'react';
import { showMessage } from '../utils/toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showMessage('¡Mensaje enviado correctamente!', 'success');
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });
      } else {
        const result = await response.json();
        showMessage(result.error || 'Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión. Inténtalo de nuevo.', 'error');
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-grid">
          {/* Contact form column */}
          <div className="contact-form-col">
            <div className="section-title">
              <h2>COMUNICATE CON NOSOTROS</h2>
              <span className="title-separator"></span>
            </div>
            <p className="contact-desc">
              Ante cualquier consulta no dudes en comunicarte. Dejá tus datos y
              consulta utilizando el formulario a continuación y nos
              contactaremos a la brevedad.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto</label>
                <input 
                  type="text" 
                  id="asunto" 
                  name="asunto" 
                  value={formData.asunto}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="6"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-enviar">ENVIAR</button>
            </form>
          </div>

          <div className="vertical-separator"></div>

          {/* Social media column */}
          <div className="social-col">
            <div className="section-title">
              <h2>NUESTRAS REDES SOCIALES</h2>
              <span className="title-separator"></span>
            </div>
            <div className="social-icons-vertical">
              <a href="#" className="social-icon-large">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon-large">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;