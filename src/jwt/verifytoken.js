import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next)=>{
     console.log('Authorization header:', req.headers['authorization']);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({message: 'Token requerido'});

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({message: 'Token inválido o expirado'});
    req.user = user;  //Almacena el usuario en la solicitud
    next();
  });
}