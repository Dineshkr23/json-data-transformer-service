import express from "express";
import newPayload from "../controllers/newPayloadController.js";

const router = express.Router();

router.post("/", newPayload);

export default router;
