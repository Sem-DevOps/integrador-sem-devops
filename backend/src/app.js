// Application Insights debe ser importado PRIMERO
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    const appInsights = require('applicationinsights');
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(false)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI);
    appInsights.start();
    console.log('✅ Application Insights habilitado');
}

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Crear directorio de archivos subidos
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generar nombre único con timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Solo acepta tipos específicos de archivo
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen y documentos (PDF, DOC, DOCX)'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite 5MB
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos subidos
app.use('/uploads', express.static(uploadsDir));

// Configuración de base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_mate',
    port: process.env.DB_PORT || 3306
};

// Conexión a base de datos
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


// Rutas
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

// Contacto
app.post('/api/contacto', async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body;
        
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

// Trabajo
app.post('/api/trabajo', upload.single('cv'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        
        const { nombre, apellido, email, telefono, puesto, mensaje } = req.body;
        
        if (!nombre || !apellido || !email || !telefono || !puesto) {
            return res.status(400).json({ 
                error: 'Todos los campos obligatorios deben ser completados' 
            });
        }

        const connection = await connectDB();
        
        // Guardar archivo si se subió
        const cvPath = req.file ? req.file.filename : null;
        const cvOriginalName = req.file ? req.file.originalname : null;
        
        console.log('CV Path:', cvPath);
        console.log('CV Original Name:', cvOriginalName);
        
        const query = `
            INSERT INTO solicitudes_trabajo (nombre, apellido, email, telefono, puesto, mensaje, cv_path, cv_filename, fecha_creacion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        console.log('Query params:', [nombre, apellido, email, telefono, puesto, mensaje || '', cvPath, cvOriginalName]);
        
        const [result] = await connection.execute(query, [nombre, apellido, email, telefono, puesto, mensaje || '', cvPath, cvOriginalName]);
        await connection.end();
        
        res.status(201).json({ 
            message: 'Solicitud enviada correctamente',
            id: result.insertId,
            cvUploaded: !!req.file
        });
        
    } catch (error) {
        console.error('Error en /api/trabajo:', error);
        
        // Errores de archivos
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    error: 'El archivo es demasiado grande. Máximo 5MB permitido.' 
                });
            }
        }
        
        res.status(500).json({ 
            error: error.message || 'Error interno del servidor' 
        });
    }
});

// Franquicias
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

// Newsletter
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                error: 'Email es obligatorio' 
            });
        }

        const connection = await connectDB();
        
        // Verificar suscripción existente
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

// Error 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Errores globales
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📊 Base de datos: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
        console.log(`🌐 Endpoints disponibles: /api/contacto, /api/trabajo, /api/franquicias, /api/newsletter`);
    });
}

module.exports = app;