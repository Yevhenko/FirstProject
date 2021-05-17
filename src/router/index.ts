import express from 'express';

import login from "./login";
import registration from  './registration';

const router = express.Router();

router.use(login);
router.use(registration);

export = router;