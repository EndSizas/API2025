import {conmysql} from '../db.js'
//import bcrypt from 'bcryptjs';

export const getUsuarios=
async (req,res)=>{
    try {
        const [result] = await conmysql.query(' select * from usuarios ')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error al consultar usuarios"})
    }
}

export const getUsuariosxid=
async (req,res)=>{
    try {
        const[result]=await conmysql.query('select * from usuarios where usr_id=?',[req.params.id])
        if (result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Usuario no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'error de lado del servidor'})        
    }
}

export const postUsuario=
async (req,res)=>{
    try {
    //console.log(req.body)
    const {usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo}=req.body
    //console.log(cli_nombre) Se paracion la parte del cliente que queramos
    const saltRounds = 10;
    //const hashedPassword = await bcrypt.hash(usr_clave, saltRounds); 
    const [rows] = await conmysql.query('insert into usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) values(?,?,?,?,?,?)',
        [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo])
        // const [rows]=await conmysql2.query('insert into tabla(cam1,cam2)values(?,?)', [cli_nombre, cli_correo]) Eso es un ejemplo una estructura que si deseas nomas querer
    res.send({
        id:rows.insertId
    })
    } catch(error){
            return res.status(500).json({message:'error del lado del servidor'})
    }
    
}

export const putUsuario=
async (req,res)=>{
    try {
        const {id}=req.params
        const {usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo}=req.body
        const [result]=await conmysql.query('update usuarios set usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? where usr_id=?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id])
        if(result.affectedRows<=0)return res.status(404).json({
            message:'Usuario no encontrado'
        })
        const[rows]=await conmysql.query('select * from usuarios where usr_id=?',[id])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

