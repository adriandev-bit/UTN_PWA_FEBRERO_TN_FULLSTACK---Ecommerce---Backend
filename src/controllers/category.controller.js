import categoryRepository from "../repositories/category.repository.js";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const new_workspace = await categoryRepository.createCategory({ name });
        res.json({
            ok: true,
            status: 201,
            message: 'Category created!',
            data: {
                new_workspace
            }
        });
    } catch (error) {
        console.log("Error al registrar categoría", error);

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
            message: "Error interno del servidor"
        });
    }
};

export const getAllCategoriesController = async (req, res) => {
    try {
        
        const categories = await categoryRepository.getAllCategories(); 
        
        res.json({
            ok: true,
            status: 200,
            data: {
                categories
            }
        });
    } catch (error) {
        console.log("Error al obtener las categorías", error);
        res.status(500).send({
            status: 500,
            ok: false,
            message: "Error interno del servidor"
        });
    }
};
