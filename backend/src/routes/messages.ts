import { Router } from "express";
import { createMessages, getMessages , deleteMessages , updateMessage} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/jwtmiddleware.js";

const router = Router();

router.post("/", authMiddleware, createMessages);
router.get("/", authMiddleware, getMessages);
router.delete("/:id", deleteMessages);
router.put("/:id", updateMessage);

export default router;