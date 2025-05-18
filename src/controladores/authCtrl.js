import jwt from 'jsonwebtoken';
export const login=(req, res)=>{
  // Generamos el token directamente
  const user = {id: 1, username: 'User'}; //Simula un usuario
  const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'});
  res.json({token});
};