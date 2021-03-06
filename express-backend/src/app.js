import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors'
// Import routers and middleware
import indexRouter from './api/routes/index';
import authRouter from './api/routes/auth';
import donorRouter from './api/routes/donor';
import doneeRouter from './api/routes/donee';
import balanceRouter from './api/routes/balance';
import activityRouter from './api/routes/activity';
import requestValidator from "./api/middlewares/requestValidator"
import { isAuthenticated, isAuthorized } from "./api/middlewares/auth";

// Initialize fabric admin
import FabricService from "./services/fabric";
FabricService.Initialize()


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
    isAuthenticated,
    validatorMiddleware,
    authRouter
);
app.use(
    '/api/donor',
    isAuthenticated,
    isAuthorized({ hasRole: ['donor'] }),
    validatorMiddleware,
    donorRouter
);
// Temporary disable middlewares for demo
app.use(
    '/api/donee',
    validatorMiddleware,
    doneeRouter
);
app.use('/api/activity', activityRouter);
app.use('/api/balance', isAuthenticated, balanceRouter);

export default app;
