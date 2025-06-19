const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_mate',
    port: process.env.DB_PORT || 3306
};

// Función para conectar a la base de datos
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado a MySQL');
        return connection;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        process.exit(1);
    }
}

// Rutas básicas
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Tienda de Mate funcionando!',
        version: '1.0.0',
        endpoints: {
            contacto: 'POST /api/contacto',
            trabajo: 'POST /api/trabajo',
            franquicias: 'POST /api/franquicias',
            newsletter: 'POST /api/newsletter'
        }
    });
});

// Ruta para el formulario de contacto
app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;
        
        // Validaciones básicas
        if (!nombre || !email || !asunto || !mensaje) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        const connection = await connectDB();
        
        const query = `
            INSERT INTO contactos (nombre, email, asunto, mensaje, fecha_creacion) 
            VALUES (?, ?, ?, ?, NOW())
        `;
        
        const [result] = await connection.execute(query, [nombre, email, asunto, mensaje]);
        await connection.end();
        
        res.status(201).json({ 
            message: 'Mensaje enviado correctamente',
            id: result.insertId 
        });
        
    } catch (error) {
        console.error('Error en /api/contacto:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Ruta para el formulario de trabajo
app.post('/api/trabajo', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, puesto, mensaje } = req.body;
        
        if (!nombre || !apellido || !email || !telefono || !puesto) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        const connection = await connectDB();
        
        const query = `
            INSERT INTO solicitudes_trabajo (nombre, apellido, email, telefono, puesto, mensaje, fecha_creacion) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await connection.execute(query, [nombre, apellido, email, telefono, puesto, mensaje]);
        await connection.end();
        
        res.status(201).json({ 
            message: 'Solicitud enviada correctamente',
            id: result.insertId 
        });
        
    } catch (error) {
        console.error('Error en /api/trabajo:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Ruta para el formulario de franquicias
app.post('/api/franquicias', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, comoLlegaste, zona } = req.body;
        
        if (!nombre || !apellido || !email || !telefono || !zona) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        const connection = await connectDB();
        
        const query = `
            INSERT INTO solicitudes_franquicias (nombre, apellido, email, telefono, como_llegaste, zona, fecha_creacion) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        
        const [result] = await connection.execute(query, [nombre, apellido, email, telefono, comoLlegaste, zona]);
        await connection.end();
        
        res.status(201).json({ 
            message: 'Solicitud de franquicia enviada correctamente',
            id: result.insertId 
        });
        
    } catch (error) {
        console.error('Error en /api/franquicias:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Ruta para newsletter
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: 'Email es obligatorio' 
            });
        }

        const connection = await connectDB();
        
        // Verificar si ya está suscrito
        const [existing] = await connection.execute(
            'SELECT id FROM newsletter WHERE email = ?', 
            [email]
        );
        
        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({ 
                error: 'Este email ya está suscrito' 
            });
        }
        
        const query = `
            INSERT INTO newsletter (email, fecha_suscripcion) 
            VALUES (?, NOW())
        `;
        
        const [result] = await connection.execute(query, [email]);
        await connection.end();
        
        res.status(201).json({ 
            message: 'Suscripción exitosa',
            id: result.insertId 
        });
        
    } catch (error) {
        console.error('Error en /api/newsletter:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor' 
        });
    }
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
}

module.exports = app;