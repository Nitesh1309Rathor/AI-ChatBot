import { Router } from "express";

const router = Router();
router.get("/health", (_req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

export default router;
