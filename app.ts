import express from "express";
import { Server } from 'http';
import dotenv from "dotenv";
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import { I18n } from 'i18n';
import path from 'path';
import mountRoutes from './routes';
import Database from './config/Database';


const app: express.Application=express()
let server: Server;
dotenv.config()
app.use(express.json({ limit: '10kb' }))
// security
app.use(cors({
  origin: ['http://localhost:4200', 'https://dramcode.top'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(compression());
app.use(mongoSanitize());
app.use(hpp({ whitelist: ['price', 'category', 'subcategory', 'ratingAverage', 'sold'] }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
////

app.use(express.static('upload'))
Database()
mountRoutes(app);

//localization
const i18n = new I18n({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, 'localization'),
  defaultLocale: 'en',
  queryParameter: 'lang'
})
app.use(i18n.init)
////////////

server= app.listen(process.env.port,()=> {
    console.log(`listen on port ${process.env.port}`)
})
process.on('unhandledRejection', (err: Error) => {
    console.error(`unhandledRejection ${err.name} | ${err.message}`);
    server.close(() => {
      console.error('shutting the application down');
      process.exit(1);
    });
  });


  ////to run the projct :
  //npm run start:development