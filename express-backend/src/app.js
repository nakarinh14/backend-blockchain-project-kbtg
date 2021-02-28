import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './api/routes/index';
import authRouter from './api/routes/auth';
import donorRouter from './api/routes/donor';
import doneeRouter from './api/routes/donee'
import requestValidator from "./api/middlewares/requestValidator"
import { isAuthenticated, isAuthorized } from "./api/middlewares/auth";

const app = express();
const validatorMiddleware = requestValidator();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', validatorMiddleware, authRouter);
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
app.use('/api/activity', validatorMiddleware)

export default app;
