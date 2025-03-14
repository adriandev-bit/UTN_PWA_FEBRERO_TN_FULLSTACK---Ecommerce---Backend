import Workspace from "../models/Workspace.model.js";
import { ServerError } from "../utils/errors.utils.js";

class WorkspaceRepository {
    async findWorkspaceById (id){
        return await Workspace.findById(id)
    }
    async createWorkspace({name, owner_id}){
        const workspace = await Workspace.create(
            {
                name, 
                owner: owner_id,
                members: [owner_id] 
            }
        )
        return workspace
    }
    async addNewMember({workspace_id, owner_id, invited_id}){
        const workspace_found = await this.findWorkspaceById(workspace_id)
        // que exista el workspace
        if(!workspace_found){
            throw new ServerError('Workspace not found', 404)
        }
        //que sea el dueño
        if(!workspace_found.owner.equals(owner_id)){
            throw new ServerError ('You are not the owner of this workspace', 403)
        }
        //que el invitado ya no sea miembro del workspace
        if(workspace_found.members.includes(invited_id)){
            throw new ServerError ('Is already a member', 400)
        }
        workspace_found.members.push(invited_id)
        await workspace_found.save()
        return workspace_found
    }

    async getWorkspacesByUserId(userId) {
        // Buscar workspaces donde el usuario es el propietario o un miembro
        const workspaces = await Workspace.find({
            $or: [
                { owner: userId },  // El usuario es el propietario
                { members: userId }, // El usuario es miembro
            ],
        });

        return workspaces;
    }

    async deleteWorkspace(workspace_id, user_id) {
        const workspace = await this.findWorkspaceById(workspace_id);
    
        if (!workspace) {
            throw new ServerError("Workspace no encontrado", 404);
        }
    
        if (!workspace.owner.equals(user_id)) {
            throw new ServerError("No tienes permisos para eliminar este workspace", 403);
        }
    
        await Workspace.deleteOne({ _id: workspace_id });
        return workspace;
    }
    
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository