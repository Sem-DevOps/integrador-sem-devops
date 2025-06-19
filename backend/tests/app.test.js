const request = require('supertest');
const app = require('../src/app');

// Mock de la base de datos para testing
jest.mock('mysql2/promise', () => ({
    createConnection: jest.fn(() => Promise.resolve({
        execute: jest.fn(() => Promise.resolve([{ insertId: 1 }])),
        end: jest.fn(() => Promise.resolve())
    }))
}));

describe('API Tienda de Mate', () => {
    describe('GET /', () => {
        it('debería retornar información de la API', async () => {
            const response = await request(app).get('/');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('version');
            expect(response.body).toHaveProperty('endpoints');
        });
    });

    describe('POST /api/contacto', () => {
        it('debería crear un nuevo contacto con datos válidos', async () => {
            const contactoData = {
                nombre: 'Juan Test',
                email: 'juan@test.com',
                asunto: 'Consulta de test',
                mensaje: 'Este es un mensaje de prueba'
            };

            const response = await request(app)
                .post('/api/contacto')
                .send(contactoData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Mensaje enviado correctamente');
            expect(response.body).toHaveProperty('id');
        });

        it('debería retornar error 400 si faltan campos obligatorios', async () => {
            const contactoIncompleto = {
                nombre: 'Juan Test',
                email: 'juan@test.com'
                // Faltan asunto y mensaje
            };

            const response = await request(app)
                .post('/api/contacto')
                .send(contactoIncompleto);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Todos los campos son obligatorios');
        });
    });

    describe('POST /api/trabajo', () => {
        it('debería crear una nueva solicitud de trabajo', async () => {
            const trabajoData = {
                nombre: 'María',
                apellido: 'García',
                email: 'maria@test.com',
                telefono: '123456789',
                puesto: 'Barista',
                mensaje: 'Tengo experiencia en café'
            };

            const response = await request(app)
                .post('/api/trabajo')
                .send(trabajoData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Solicitud enviada correctamente');
        });
    });

    describe('POST /api/franquicias', () => {
        it('debería crear una nueva solicitud de franquicia', async () => {
            const franquiciaData = {
                nombre: 'Carlos',
                apellido: 'López',
                email: 'carlos@test.com',
                telefono: '987654321',
                comoLlegaste: 'Internet',
                zona: 'Capital Federal'
            };

            const response = await request(app)
                .post('/api/franquicias')
                .send(franquiciaData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Solicitud de franquicia enviada correctamente');
        });
    });

    describe('POST /api/newsletter', () => {
        it('debería suscribir un email al newsletter', async () => {
            const newsletterData = {
                email: 'newsletter@test.com'
            };

            const response = await request(app)
                .post('/api/newsletter')
                .send(newsletterData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Suscripción exitosa');
        });

        it('debería retornar error si no se proporciona email', async () => {
            const response = await request(app)
                .post('/api/newsletter')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Email es obligatorio');
        });
    });

    describe('Rutas no encontradas', () => {
        it('debería retornar 404 para rutas que no existen', async () => {
            const response = await request(app).get('/ruta-que-no-existe');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Ruta no encontrada');
        });
    });
});