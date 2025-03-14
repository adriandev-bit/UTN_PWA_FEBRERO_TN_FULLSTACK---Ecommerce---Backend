import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express';
import authRouter from "./routes/auth.router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendMail } from "./utils/mailer.utils.js";
import cors from 'cors';
import { authMiddleware } from "./middlewares/authMiddleware.js";
import workspace_router from "./routes/workspace.router.js";
import channelRouter from "./routes/channel.router.js";

const app = express();

// Deshabilito la política de CORS
app.use(cors());

// Si quieren que sea reservado para cierto dominio
/* 
app.use(cors({
    origin: ENVIROMENT.URL_FRONTEND
})); 
*/

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspace_router);
app.use('/api/channels', channelRouter);

app.get('/api/test/comprar', authMiddleware, (req, res) => {
    console.log(req.user);
    res.json({
        message: 'Producto comprado'
    });
});

app.listen(ENVIROMENT.PORT, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${ENVIROMENT.PORT}`);
});
