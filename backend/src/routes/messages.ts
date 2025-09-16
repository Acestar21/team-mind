import { Router } from "express";
import { createMessages, getMessages , deleteMessages , updateMessage} from "../controllers/messageController.js";

const router = Router();

router.post("/", createMessages);
router.get("/", getMessages);
router.delete("/:id", deleteMessages);
router.put("/:id", updateMessage);

export default router;