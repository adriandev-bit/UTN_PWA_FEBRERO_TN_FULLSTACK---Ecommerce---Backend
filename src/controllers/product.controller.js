
import Product from "../models/Product.model.js";
import { ServerError } from "../utils/errors.utils.js";
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js";
import mongoose from "mongoose";
import productRepository from "../repositories/product.repository.js";


export const getProductsByCategoryController = async (req, res) => {
    try {
        const { category_id } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(category_id)) {
            return res.status(400).json({ success: false, message: "ID de category es inválido" });
        }

        const products = await Product.find({ category: category_id });

        res.json({ success: true, data: { products } });
    } catch (error) {
        console.error("Error al obtener canales:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

export const getAllProductsController = async (req, res) => {
  try {
      
      const products = await productRepository.findAllProducts();
      
      res.json({ success: true, data: { products } });
  } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
  
export const getProductByIdController = async (req, res) => {
    try {
      const { productId } = req.params; 
      console.log(`Buscando producto con ID: ${productId}`); 
  
      
      const product = await productRepository.findProductById(productId);
  
     
      if (!product) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
      }
  
      
      res.json({ success: true, data: { product } });
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({ success: false, message: "Error en el servidor" });
    }
  };
  

export const createProductController =async (req, res) =>{
    try{

        const {name} = req.body

        const {category_id} = req.params
console.log("category_id", category_id) 

        const new_product = await productRepository.createProduct({name, category_id})
        res.json({
            ok: true,
            status: 200,
            message: "Product created",
            data: {
                new_product
            }
        })
    }
    catch(error){
        console.log("error al crear producto", error);

        if (error.status) {
            return res.status(400).send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        res.status(500).send({
            status: 500,
            ok: false,
            message: "internal server error"
        });
    }
}

export const deleteProductController = async (req, res) => {
    try {
      const { product_id } = req.params;
  
      
      const result = await productRepository.deleteProduct(product_id);
      
      res.json(result);
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error while deleting product"
      });
    }
  };