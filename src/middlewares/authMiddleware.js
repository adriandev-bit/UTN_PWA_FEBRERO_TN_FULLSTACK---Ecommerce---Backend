import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../utils/errors.utils.js";
import jwt from 'jsonwebtoken'
export const authMiddleware = (request, response, next) => {
    try {
        console.log("📌 Headers recibidos:", request.headers); // 🔍 Ver qué headers llegan

        const authorization_header = request.headers['authorization'];

        if (!authorization_header) {
            console.log("❌ No se recibió header de autorización");
            throw new ServerError('No has proporcionado un header de autorización', 401);
        }

        console.log("✅ Header de autorización recibido:", authorization_header);

        const authorization_token = authorization_header.split(' ')[1];

        if (!authorization_token) {
            console.log("❌ No se encontró un token en el header");
            throw new ServerError('No has proporcionado un token de autorización', 401);
        }

        console.log("🔑 Token extraído:", authorization_token);

        try {
            const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT);
            console.log("✅ Token decodificado correctamente:", user_info);

            request.user = user_info; // 🔹 Aquí se asigna `user`
            next();
        } catch (error) {
            console.log("❌ Error verificando el token:", error.message);
            throw new ServerError('Token inválido o vencido', 400);
        }
    } catch (error) {
        console.log("❌ Error en autenticación:", error.message);

        return response.status(error.status || 500).json({
            ok: false,
            status: error.status || 500,
            message: error.message || "Internal server error",
        });
    }
};
