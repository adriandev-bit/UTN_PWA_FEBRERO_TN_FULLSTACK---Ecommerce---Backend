import workspaceRepository from "../repositories/workspace.repository.js";


export const createWorkspaceController = async (req, res) => {
    try {
        const { name } = req.body
        const owner_id = req.user._id
        const new_workspace = await workspaceRepository.createWorkspace({ name, owner_id })
        res.json({
            ok: true,
            status: 201,
            message: 'Workspace created!',
            data: {
                new_workspace
            }
        })
    } catch (error) {
        console.log("error al registrar", error);

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


export const invteUserToWorkspaceController = async (req, res) => {
    try {
        const user_id = req.user._id
        const {invited_id, workspace_id} = req.params

        const workspace_found = await workspaceRepository.addNewMember({owner_id: user_id, invited_id, workspace_id})
        res.json(
            {
                ok: true,
                status: 201,
                message: 'New member',
                data: {
                    workspace: workspace_found
                }
            }
        )
    } catch (error) {
        console.log("error al registrar", error);

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

export const getWorkspacesController = async (req, res) => {
    try {
        const user_id = req.user._id; // Supongo que el workspace está asociado al usuario
        const workspaces = await workspaceRepository.getWorkspacesByUserId(user_id);  // Aquí debes crear un método en tu repositorio para obtener los workspaces del usuario
        res.json({
            ok: true,
            status: 200,
            data: {
                workspaces
            }
        });
    } catch (error) {
        console.log("Error al obtener los workspaces", error);
        res.status(500).send({
            status: 500,
            ok: false,
            message: "Error interno del servidor"
        });
    }
};


export const deleteWorkspaceController = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const user_id = req.user._id;

        const deletedWorkspace = await workspaceRepository.deleteWorkspace(workspace_id, user_id);

        res.json({
            ok: true,
            status: 200,
            message: "Workspace eliminado correctamente",
            data: { deletedWorkspace }
        });
    } catch (error) {
        console.error("Error al eliminar el workspace:", error);
        res.status(error.status || 500).json({
            ok: false,
            status: error.status || 500,
            message: error.message || "Error interno del servidor"
        });
    }
};
