import express from 'express';

import { auth } from "../middlewares/auth";
import login from "./login";
import registration from  './registration';
import user from './user';

const router = express.Router();

router.use(registration);

router.use(login);
router.use(auth);
router.use(user);



export = router;
