import { useState, useRef } from "react";
import { showMessage } from "../utils/toast";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Jobs = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    puesto: "",
    mensaje: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const messageSpan = document.querySelector(".file-input-message");
    if (messageSpan) {
      messageSpan.textContent = file
        ? file.name
        : "Ningún archivo seleccionado";
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          // Only append non-empty values
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        formDataToSend.append("cv", selectedFile);
        console.log(
          "File selected:",
          selectedFile.name,
          selectedFile.size,
          "bytes"
        );
      }

      for (let [key, value] of formDataToSend.entries()) {
        console.log(
          key,
          ":",
          value instanceof File ? `File: ${value.name}` : value
        );
      }
      console.log(formDataToSend);
      const response = await fetch(`${API_URL}/api/trabajo`, {
        method: "POST",
        body: formDataToSend, 
      });

      if (response.ok) {
        showMessage("¡Solicitud enviada correctamente!", "success");
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          puesto: "",
          mensaje: "",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        const messageSpan = document.querySelector(".file-input-message");
        if (messageSpan) {
          messageSpan.textContent = "Ningún archivo seleccionado";
        }
      } else {
        const result = await response.json();
        showMessage(
          result.error || "Error al enviar la solicitud. Inténtalo de nuevo.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Error de conexión. Inténtalo de nuevo.", "error");
    }
  };

  return (
    <section className="trabajo-section">
      <div className="container">
        <div className="trabajo-header">
          <span className="trabajo-subtitle">SUMATE A NUESTRO EQUIPO</span>
          <h2 className="trabajo-title">TRABAJÁ CON NOSOTROS</h2>
          <p className="trabajo-desc">
            Formá parte de nuestra familia. Buscamos personas apasionadas por el
            mate y la atención al cliente. Completá el formulario y nos
            contactaremos contigo.
          </p>
        </div>

        <form className="trabajo-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
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
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
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
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="puesto">Puesto de interés *</label>
              <input
                type="text"
                id="puesto"
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="mensaje">Mensaje adicional</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                value={formData.mensaje}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="cv">Adjuntar CV</label>
              <div className="file-input-wrapper">
                <span
                  className="file-input-text"
                  onClick={handleFileButtonClick}
                  style={{ cursor: "pointer" }}
                >
                  Elegir archivo
                </span>
                <span className="file-input-message">
                  {selectedFile
                    ? selectedFile.name
                    : "Ningún archivo seleccionado"}
                </span>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-enviar">
            ENVIAR SOLICITUD
          </button>
        </form>
      </div>
    </section>
  );
};

export default Jobs;
