import { config } from "dotenv"
config()


export const BD_HOST=process.env.BD_HOST || 'bdzva31ini3ues2xhet6-mysql.services.clever-cloud.com'
export const BD_DATABASE=process.env.BD_DATABASE || 'bdzva31ini3ues2xhet6'
export const BD_USER=process.env.BD_USER || 'ubw4o4usrxe7lglv'
export const BD_PASSWORD=process.env.BD_PASSWORD || 'aX8tfGELNwGurbNDqPyY'
export const BD_PORT=process.env.BD_PORT || 3306
export const PORT=process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET || "proyecto123";