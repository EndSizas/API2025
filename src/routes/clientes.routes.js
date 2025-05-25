import { Router } from "express";
import { getobetenerClientes, getClientesxId, postClientes, putClientes, patchClientes, patchEstadoCliente, deleteClientes } from "../controladores/clientesCtrl.js";

const router=Router();
//armar las rutas "URL"

router.get('/clientes', getobetenerClientes)
router.get('/clientes/:id',getClientesxId)
router.post('/clientes', postClientes)
router.put('/clientes/:id', putClientes)
router.patch('clientes/:id', patchClientes)
router.patch('/clientes/:id/estado', patchEstadoCliente);
router.delete('/clientes/:id', deleteClientes)

export default router;