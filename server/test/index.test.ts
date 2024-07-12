import request from 'supertest';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { ServerSocket } from '../socket';
import session from 'express-session';
import cors from 'cors';
import { cardsRouter } from '../src/routes/cardsRouter';
import dotenv from 'dotenv';
dotenv.config();

// Configurazione del server
const app = express();
const PORT = 3000;
const httpServer = http.createServer(app);
new ServerSocket(httpServer);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/unoProgetto";


/*mongoose.connect("mongodb://localhost:27017/unoProgetto")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));*/

app.use(cors());
app.use(session({
  secret: 'keyboard',
  cookie: { maxAge: 3600000 },
  resave: false,
  saveUninitialized: false
}));
app.use(express.json());
app.use(cardsRouter);
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

describe('Express Server', () => {
  let server: http.Server;

  beforeAll((done) => {
    mongoose.connect(mongoUri);
    mongoose.connection.once('open', () => {
      server = httpServer.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
        done();
      });
    });
  });

  afterAll((done) => {
    mongoose.disconnect();
    server.close(done);
  });

  it('should connect to the database', async () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 significa connesso
  });

  it('should return 404 for an unknown route', async () => {
    const res = await request(server).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.url).toBe('/unknown-route not found');
  });

  it('should respond to /cards with 200', async () => {
    const res = await request(server).get('/cards');
    expect(res.status).toBe(200);
  });
});
