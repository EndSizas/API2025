import { config } from "dotenv"
config()


export const BD_HOST=process.env.BD_HOST || 'bf66hsthyzwoicyebvfb-mysql.services.clever-cloud.com'
export const BD_DATABASE=process.env.BD_DATABASE || 'bf66hsthyzwoicyebvfb'
export const BD_USER=process.env.BD_USER || 'uxxmbvzxwrzmo0mh'
export const BD_PASSWORD=process.env.BD_PASSWORD || 'D0aj8UthVZsK76gqbC0M'
export const BD_PORT=process.env.BD_PORT || 3306
export const PORT=process.env.PORT || 3000
export const JWT_SECRET = process.env.JWT_SECRET || "proyecto123";