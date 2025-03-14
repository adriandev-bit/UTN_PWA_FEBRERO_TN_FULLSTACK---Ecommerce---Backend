
import Channel from "../models/Channel.model.js";
import { ServerError } from "../utils/errors.utils.js";
import Workspace from "../models/Workspace.model.js";
import workspaceRepository from "./workspace.repository.js";
import Message from "../models/Message.model.js"; 

class ChannelRepository {
    async findChannelById (channel_id){
        return Channel.findById(channel_id).populate('workspace')
    }
    async createChannel({ name, workspace_id, user_id }) {
        const workspace_found = await workspaceRepository.findWorkspaceById(workspace_id)
        if (!workspace_found) {
            throw new ServerError("Workspace not found", 404)
        }
        console.log({user_id})
        console.log(workspace_found.members)
        if(!workspace_found.members.includes(user_id)){
            throw new ServerError("You are not member of this workspace", 403)
        }

        const channel = await Channel.create(
            {
                name,
                workspace: workspace_id,
                created_by: user_id
            }
        )
        return channel

    }

    async deleteChannel(channel_id, user_id) {
        // Verificar si el canal existe
        const channel = await Channel.findById(channel_id);
        if (!channel) {
            throw new ServerError('Channel not found', 404); // Si no se encuentra el canal
        }
    
        // Verificar si el usuario tiene permisos para eliminar el canal
        if (!channel.created_by.equals(user_id)) {
            throw new ServerError('You do not have permission to delete this channel', 403); // Si el usuario no es el creador
        }

        // Eliminar los mensajes asociados a este canal
        await Message.deleteMany({ channel: channel_id });
    
        // Eliminar el canal
        await Channel.findByIdAndDelete(channel_id);
    
        return { success: true, message: 'Channel deleted successfully' }; // Confirmación de la eliminación
    }
    
}
    
const channelRepository = new ChannelRepository()
export default channelRepository