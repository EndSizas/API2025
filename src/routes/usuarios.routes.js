import { Router } from "express";
import {getUsuarios, getUsuariosxid, postUsuario, putUsuario } from '../controladores/usuariosCtrl.js'
const router=Router()
//armar nuestras rutas

router.get('/usuarios',getUsuarios)//select 
router.get('/usuarios/:id', getUsuariosxid)//select con id
router.post('/usuarios', postUsuario)//insert
router.put('/usuarios/:id',putUsuario) //update


export default router