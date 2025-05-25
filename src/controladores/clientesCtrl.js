import { conmysql } from "../db.js";

export const getobetenerClientes = async (req, res) => {
  try {
    const [result] = await conmysql.query("SELECT * FROM clientes WHERE cli_estado = 'A'");
    res.json({ cant: result.length, data: result });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener los clientes",
      error: error.message,
    });
  }
}


export const getClientesxId  = async (req, res)=>{
    try{
        const [result]= await conmysql.query('select * from clientes where cli_id=?', [req.params.id])
        if(result.length <= 0) return res.status(404).json({
            cli_id: 0,
            message: "cliente no encontrado",
        });
        res.json(result[0])
    }catch (error) {
        return res.status(500).json({
            message: "Error al obtener los clientes",
            error: error.message,
        });
    }
}

export const postClientes = async (req, res) => {
  try {
    const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado } = req.body;
    
    const [result] = await conmysql.query(
      `INSERT INTO clientes (cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado]
    );
    
    res.send({ cli_id: result.insertId });
  } catch (error) {
    return res.status(500).json({
      message: "Error al registrar el cliente",
      error: error.message
    });
  }
};



export const putClientes = async (req, res) => {
  try {
    const { id } = req.params;
    const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado } = req.body;

    const [result] = await conmysql.query(
      `UPDATE clientes 
       SET cli_identificacion = ?, cli_nombre = ?, cli_telefono = ?, cli_correo = ?, cli_direccion = ?, cli_pais = ?, cli_ciudad = ?, cli_estado = ? 
       WHERE cli_id = ?`,
      [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "cliente no encontrado" });

    const [row] = await conmysql.query('SELECT * FROM clientes WHERE cli_id = ?', [id]);
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error del lado del servidor' });
  }
};



export const patchClientes = async (req, res) => {
    try {
        const { id } = req.params;
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado } = req.body;
        console.log(req.body);

        const [result] = await conmysql.query(
            `UPDATE clientes SET 
                cli_identificacion = IFNULL(?, cli_identificacion),
                cli_nombre = IFNULL(?, cli_nombre),
                cli_telefono = IFNULL(?, cli_telefono),
                cli_correo = IFNULL(?, cli_correo),
                cli_direccion = IFNULL(?, cli_direccion),
                cli_pais = IFNULL(?, cli_pais),
                cli_ciudad = IFNULL(?, cli_ciudad),
                cli_estado = IFNULL(?, cli_estado)
             WHERE cli_id = ?`,
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, cli_estado, id]
        );

        if(result.affectedRows === 0) return res.status(404).json({
            message: "cliente no encontrado"
        });

        const [row] = await conmysql.query('select * from clientes where cli_id = ?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: 'error del lado del servidor', error: error.message });
    }
}

export const patchEstadoCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { cli_estado } = req.body;

    if (!['A', 'N'].includes(cli_estado)) {
      return res.status(400).json({ message: 'Estado inválido. Use "A" o "N".' });
    }
    const [result] = await conmysql.query(
      "UPDATE clientes SET cli_estado = ? WHERE cli_id = ?",
      [cli_estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: `Estado del cliente actualizado a "${cli_estado}"` });
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el estado del cliente",
      error: error.message,
    });
  }
};


export const deleteClientes = async (req, res) => {
    try {
        const [result] = await conmysql.query("DELETE FROM clientes WHERE cli_id = ?", [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No se encontró el cliente",
            });
        }
        res.sendStatus(204); 
    } catch (error) {
        return res.status(500).json({
            message: "Error al eliminar el cliente",
            error: error.message
        });
    }
};