import express from "express";
import newCampaignPayload from "../controllers/newCampaignPayloadController.js";

const router = express.Router();

router.post("/", newCampaignPayload);

export default router;
