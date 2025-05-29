import { conmysql } from "../db.js"
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';


// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dqxjdfncz',  // Reemplaza con tu Cloud Name
    api_key: '972776657996249',        // Reemplaza con tu API Key
    api_secret: '5F2PB9yT5_xycNG_vKyegoOoMc8'   // Reemplaza con tu API Secret
});
// Configuración de Multer para subir imágenes
const storage = multer.memoryStorage();  // Para almacenar en memoria antes de enviar a Cloudinary
const upload = multer({ storage: storage }).array('imagenes[]'); // 'imagenes[]' es la clave de los campos
export { upload };


export const getProductos = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos');
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error al consultar productos" });
  }
}

export const getproductosxid = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [req.params.id]);
    if (result.length <= 0) return res.status(404).json({
      cli_id: 0,
      message: "Producto no encontrado"
    });
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: 'error del lado del servidor' });
  }
}

export const postProducto = async (req, res) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

    const [existente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_codigo = ?', [prod_codigo]);
    if (existente.length > 0) {
      return res.status(400).json({ message: "El código de producto ya existe" });
    }

    let prod_imagen = null;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload_stream({
          folder: CLOUDINARY_FOLDER,
          resource_type: "image",
        }, async (error, result) => {
          if (error) throw new Error("Error al subir imagen a Cloudinary");
          return result.secure_url;
        })
      );

      // Subimos la primera imagen, podrías adaptarlo para múltiples si lo deseas
      prod_imagen = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
          folder: 'productos', // Guardar en carpeta general usuarios_perfiles
          resource_type: 'auto',
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });

        stream.end(req.files[0].buffer);
      });
    }

    const [imagenExistente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_imagen = ?', [prod_imagen]);
    if (prod_imagen && imagenExistente.length > 0) {
      return res.status(400).json({ message: "El nombre de la imagen ya está en uso" });
    }

    const [rows] = await conmysql.query(
      'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES (?, ?, ?, ?, ?, ?)',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );

    res.send({
      id: rows.insertId,
      prod_imagen,
      message: "Producto creado"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del lado del servidor' });
  }
};


export const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    const [existente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_codigo = ? AND prod_id != ?', [prod_codigo, id]);
    if (existente.length > 0) {
      return res.status(400).json({ message: "El código de producto ya existe en otro producto" });
    }

    if (prod_imagen) {
      const [imagenExistente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_imagen = ? AND prod_id != ?', [prod_imagen, id]);
      if (imagenExistente.length > 0) {
        return res.status(400).json({ message: "El nombre de la imagen ya está en uso por otro producto" });
      }
    }

    const [result] = await conmysql.query(
      'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    if (result.affectedRows <= 0) return res.status(404).json({ message: "Producto no encontrado" });

    const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "error del lado del servidor" });
  }
};

export const patchProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;

    if (prod_codigo) {
      const [existente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_codigo = ? AND prod_id != ?', [prod_codigo, id]);
      if (existente.length > 0) {
        return res.status(400).json({ message: "El código de producto ya existe en otro producto" });
      }
    }

    if (prod_imagen) {
      const [imagenExistente] = await conmysql.query('SELECT prod_id FROM productos WHERE prod_imagen = ? AND prod_id != ?', [prod_imagen, id]);
      if (imagenExistente.length > 0) {
        return res.status(400).json({ message: "El nombre de la imagen ya está en uso por otro producto" });
      }
    }

    const [result] = await conmysql.query(
      'UPDATE productos SET prod_codigo = IFNULL(?, prod_codigo), prod_nombre = IFNULL(?, prod_nombre), prod_stock = IFNULL(?, prod_stock), prod_precio = IFNULL(?, prod_precio), prod_activo = IFNULL(?, prod_activo), prod_imagen = IFNULL(?, prod_imagen) WHERE prod_id = ?',
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
    );

    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Producto no encontrado' });

    const [rows] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'error del lado del servidor' });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const [rows] = await conmysql.query('DELETE FROM productos WHERE prod_id = ?', [req.params.id]);
    if (rows.affectedRows <= 0) return res.status(404).json({
      id: 0,
      message: "No pudo eliminar el producto"
    });
    res.sendStatus(202);
  } catch (error) {
    return res.status(500).json({
      message: "Error del lado del servidor"
    });
  }
};
