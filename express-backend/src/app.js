import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'
import indexRouter from './api/routes/index';
import authRouter from './api/routes/auth';
import donorRouter from './api/routes/donor';
import doneeRouter from './api/routes/donee';
import activityRouter from './api/routes/activity';
import requestValidator from "./api/middlewares/requestValidator"
import { isAuthenticated, isAuthorized } from "./api/middlewares/auth";
import CertificateService from './services/pdf'
// CertificateService.generateCertificate("YEe haw", "ASD ASD", "500", "Aug 20, 2021")

// Initialize fabric admin
import FabricService from "./services/fabric";
FabricService.RegisterAdmin()


const app = express();
const validatorMiddleware = requestValidator();

app.use(cors())
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(
    '/auth',
    validatorMiddleware,
    isAuthenticated,
    authRouter
);
app.use(
    '/api/donor',
    validatorMiddleware,
    isAuthenticated,
    isAuthorized({ hasRole: ['donor'] }),
    donorRouter
);
app.use(
    '/api/donee',
    validatorMiddleware,
    isAuthenticated,
    isAuthorized({ hasRole: ['donee', 'beneficiary'] }),
    doneeRouter
);
app.use('/api/activity', activityRouter);
app.use('/api/balance', isAuthenticated);

export default app;
