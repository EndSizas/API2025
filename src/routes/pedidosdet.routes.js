import { Router } from "express";
import { postMultiplePedidosdet } from './controladores/pedidodetCtrl.js';
import {  getPedidosdet, getpedidosdetxid, patchPedidosdet, postPedidosdet, putPedidosdet, deletePedidosdet } from '../controladores/pedidosdetCtrl.js'
const router=Router();

router.get('/pedidosdet',getPedidosdet )
router.get('/pedidosdet/:id', getpedidosdetxid)
router.post('/pedidosdet', postPedidosdet)
router.put('/pedidosdet/:id', putPedidosdet)
router.patch('/pedidosdet/:id', patchPedidosdet)
router.delete('/pedidosdet/:id', deletePedidosdet)
router.post('/pedidosdetalles', postMultiplePedidosdet);


export default router;