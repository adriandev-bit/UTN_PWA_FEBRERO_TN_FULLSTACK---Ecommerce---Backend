import { Router } from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createWorkspaceController, deleteWorkspaceController, getWorkspacesController, invteUserToWorkspaceController } from "../controllers/workspace.controller.js"

const workspace_router = Router()

workspace_router.post('/', authMiddleware, createWorkspaceController)

// api/workspaces/ivite/
workspace_router.post('/:workspace_id/invite/:invited_id', authMiddleware, invteUserToWorkspaceController)
workspace_router.get('/', authMiddleware, getWorkspacesController);
workspace_router.delete("/:workspace_id", authMiddleware, deleteWorkspaceController);

export default workspace_router