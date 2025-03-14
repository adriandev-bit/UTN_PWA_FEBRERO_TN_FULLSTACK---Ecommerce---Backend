import channelRepository from "../repositories/channel.repository.js"
import messageRepository from "../repositories/message.repository.js"
import { AUTHORIZATION_TOKEN_PROPS } from "../utils/constants/token.constants.js"
import Channel from "../models/Channel.model.js";
import mongoose from "mongoose";

export const getChannelsByWorkspaceController = async (req, res) => {
    try {
        const { workspace_id } = req.params;

        // Convertimos workspace_id en ObjectId
        if (!mongoose.Types.ObjectId.isValid(workspace_id)) {
            return res.status(400).json({ success: false, message: "ID de workspace inválido" });
        }

        const channels = await Channel.find({ workspace: workspace_id });

        res.json({ success: true, data: { channels } });
    } catch (error) {
        console.error("Error al obtener canales:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};



export const createChannelController =async (req, res) =>{
    try{
        //Channel name
        const {name} = req.body

        //id del usuario que quiere crear el canal
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]

        //Workspace al que quiero añadir este canal
        const {workspace_id} = req.params

        const new_channel = await channelRepository.createChannel({name, user_id, workspace_id})
        res.json({
            ok: true,
            status: 200,
            message: "Channel created",
            data: {
                new_channel
            }
        })
    }
    catch(error){
        console.log("error al crear canal", error);

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

export const sendMessageToChannelController = async (req, res) =>{
    try{
        const {channel_id} = req.params
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]
        const {content} = req.body
 

        const new_message = await messageRepository.create({sender_id: user_id, channel_id, content})
        res.json({
            ok: true,
            message: 'Message created',
            status: 201,
            data: {
                new_message
            }
        })
    }
    catch(error){
        console.log("error al enviar mensaje al canal", error);

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

export const getMessagesListFromChannelController = async (req, res) =>{
    try{
        const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]
        const {channel_id} = req.params
        const messages = await messageRepository.findMessagesFromChannel({channel_id, user_id})
        res.json({
            ok: true,
            message: 'Messages found',
            status: 200,
            data: {
                messages
            }
        })

    }
    catch(error){
        console.log("error al obtener la lista de mensajes", error);

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

export const deleteChannelController = async (req, res) => {
    try {
      const { channel_id } = req.params;
      const user_id = req.user[AUTHORIZATION_TOKEN_PROPS.ID]; // Suponiendo que tienes el usuario autenticado
  
      // Llamamos al repositorio para eliminar el canal
      const result = await channelRepository.deleteChannel(channel_id, user_id);
      
      res.json(result);
    } catch (error) {
      console.error("Error deleting channel:", error);
      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: "Server error while deleting channel"
      });
    }
  };