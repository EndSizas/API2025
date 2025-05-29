import { conmysql } from "../db.js"

export const getPedidos=
    async (req,res)=>{
        try {
            const [result]=await conmysql.query('select * from pedidos')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error al consultar Pedidos"})
         }
    }

export const getpedidosxid= async(req, res)=>{
    try {
        const [result]=await conmysql.query('Select * from pedidos where ped_id=?',[req.params.id])
        if(result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Pedido no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const postPedidos=
async (req,res)=>{
 try {
   const {usr_id, ped_fecha,cli_id, ped_estado }=req.body
   const[rows]=await conmysql.query('insert into pedidos (usr_id,ped_fecha,cli_id, ped_estado ) values(?,?,?,?)',
    [usr_id, ped_fecha,cli_id, ped_estado])
    res.send({
        id:rows.insertId
    })
 } catch (error) {
    return res.status(500).json({message:"error del lado del servidor"})
 }
}

export const postPedidosdet = async (req, res) => {
  try {
    const { prod_id, ped_id, det_cantidad, det_precio } = req.body;
    const [rows] = await conmysql.query(
      'insert into pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio ) values(?,?,?,?)',
      [prod_id, ped_id, det_cantidad, det_precio]
    );
    res.send({ id: rows.insertId });
  } catch (error) {
    return res.status(500).json({ message: "error del lado del servidor" });
  }
};


export const putPedidos=
async (req,res)=>{
 try {
    const {id}=req.params
   const {usr_id, ped_fecha,cli_id, ped_estado}=req.body
   const[result]=await conmysql.query('update pedidos set usr_id=?, ped_fecha=?, cli_id=?, ped_estado=? where ped_id=?',
    [usr_id, ped_fecha,cli_id, ped_estado,id])
    if(result.affectedRows<=0)return res.status(404).json({
        message:"Pedido no encontrado"
    })
    const [rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
    res.json(rows[0])
 } catch (error) {
    return res.status(500).json({message:"error del lado del servidor"})
 }
}

export const patchPedidos=
async (req,res)=>{
 try {
    const {id}=req.params
   const {usr_id, ped_fecha,cli_id, ped_estado}=req.body
   const[result]=await conmysql.query('update pedidos set  usr_id=IFNULL(?,usr_id),ped_fecha=IFNULL(?,ped_fecha), cli_id=IFNULL(?,cli_id), ped_estado=IFNULL(?,ped_estado) where ped_id=?',
    [usr_id, ped_fecha,cli_id, ped_estado,id])
    if(result.affectedRows<=0)return res.status(404).json({
        message:"Pedido no encontrado"
    })
    const [rows]=await conmysql.query('select * from pedidos where ped_id=?',[id])
    res.json(rows[0])
 } catch (error) {
    return res.status(500).json({message:"error del lado del servidor"})
 }
}

export const deletePedidos=
async(req, res)=>{
    try {
        const [rows]=await conmysql.query('delete from pedidos where ped_id=?',[req.params.id])
        if (rows.affectedRows<=0)return res.status(404).json({
            id:0,
            message:"No pudo eliminar el pedido"
        })
        res.sendStatus(202)
    } catch (error) {
        return res.status(500).json({
            message:"Error del lado del servidor"
        })
    }
}