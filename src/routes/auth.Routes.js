import express from 'express';
import { login } from '../controladores/authCtrl.js';

const router = express.Router();
router.post('/login', login);

export default router;