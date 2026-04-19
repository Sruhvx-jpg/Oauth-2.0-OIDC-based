import { Router } from "express";
import { handlCallBck, redirectUser } from "./oauth.controller";

const router = Router();

router.get("/auth", redirectUser)
router.get("/auth/callback", handlCallBck)

export default router