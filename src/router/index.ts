import express from 'express';

import { auth } from "../middlewares/auth";
import login from "./login";
import registration from  './registration';

const router = express.Router();

router.use(registration);

router.use(login);
router.use(auth);



export = router;
