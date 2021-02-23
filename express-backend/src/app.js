import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './api/routes/index';
import authRouter from './api/routes/auth';
import transactionRouter from './api/routes/transaction';

import requestValidator from "./api/middlewares/requestValidator"
import { isAuth } from "./api/middlewares/isAuth";

const app = express();
const validatorMiddleware = requestValidator();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', validatorMiddleware, authRouter);
app.use('/api/transaction', isAuth, validatorMiddleware, transactionRouter);

export default app;
