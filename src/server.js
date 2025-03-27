import ENVIROMENT from "./config/enviroment.config.js";
import express from 'express';
import authRouter from "./routes/auth.router.js";
import mongoose from "./config/mongoDB.config.js";
import { sendMail } from "./utils/mailer.utils.js";
import cors from 'cors';
import { authMiddleware } from "./middlewares/authMiddleware.js";
import categoryRouter from "./routes/category.router.js";  
import productRouter from "./routes/product.router.js";  
import cartRouter from "./routes/cart.router.js";  
import reviewRouter from './routes/review.router.js';  


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
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter); 
app.use('/api/reviews', reviewRouter);  

// Endpoint de prueba (para comprobar autenticación y compra)
app.get('/api/test/comprar', authMiddleware, (req, res) => {
    console.log(req.user);
    res.json({
        message: 'Producto comprado'
    });
});

// Conectar a la base de datos de MongoDB
app.listen(ENVIROMENT.PORT, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${ENVIROMENT.PORT}`);
});

