import User, { USER_PROPS } from "../models/user.model.js";

export const getUsernameController = async (req, res) => {
    try {
        const user_id = req.user[USER_PROPS.ID]; // Obtener el ID del usuario desde el token

        if (!user_id) {
            return res.status(400).json({ message: "ID de usuario requerido" });
        }

        const user = await User.findById(user_id).select(USER_PROPS.USERNAME); // Obtener solo el username

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ success: true, username: user[USER_PROPS.USERNAME] });
    } catch (error) {
        console.error("Error al obtener el username:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
