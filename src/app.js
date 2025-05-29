import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
//importar las rutas
import clientesRoutes from './routes/clientes.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import pedidosdetRoutes from './routes/pedidosdet.routes.js'
import productosRoutes from './routes/productos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.Routes.js'
import { authenticateToken } from './jwt/verifytoken.js'

//definir los modulos de entrada
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//definir los permisos
const corsOptions={
    origin:'http://localhost:8100', //la direccion del dominio del servidor
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials:true
}


const app=express();
app.use(cors(corsOptions));
app.use(express.json()) //interpretar objetos json
app.use(express.urlencoded({extended:true})) //se añade para poder receptar por unidad
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));



app.use('/api/auth',authRoutes)
//Nuestras rutas protegidas
app.use('/api/', /*authenticateToken,*/ clientesRoutes)
app.use('/api', /*authenticateToken,*/ usuariosRoutes)
app.use('/api',/*authenticateToken,*/ productosRoutes)
app.use('/api', /*authenticateToken,*/ pedidosdetRoutes)
app.use('/api', /*authenticateToken,*/ pedidosRoutes)


app.use((req,resp,next)=>{
    resp.status(404).json({
        message:' Endponit not fount'
    })
})

export default app;