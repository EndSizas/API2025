    import { Router } from "express";
    import multer from 'multer'
    import {
        getProductos, 
        getproductosxid,
        postProducto,
        putProducto,
        patchProducto,
        deleteProducto
    } from '../controladores/productosCtrl.js'

    //configurar multer para almacenar las imagenes
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,'uploads'); //carpeta donde se guardan las imagenes
        },
        filename:(req,file,cb)=>{
            cb(null,`${Date.now()}-${file.originalname}`);
        }
    });

    const uploads=multer({storage});

    const router=Router()
    //armar nuestras rutas

    router.get('/productos',getProductos)  //select
    router.get('/productos/:id',getproductosxid)  //select x id
    router.post('/productos',uploads.single('prod_imagen'), postProducto)  //insert
    router.put('/productos/:id',putProducto)  //update
    router.patch('/productos/:id', patchProducto)  //update
    router.delete('/productos/:id',deleteProducto)  //delete

    export default router