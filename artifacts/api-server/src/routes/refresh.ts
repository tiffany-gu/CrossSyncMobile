import { Router, type IRouter } from "express";
import { timingSafeEqual } from "crypto";
import { execSync } from "child_process";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

router.post("/refresh", (req, res) => {
  const provided = req.header("X-Refresh-Secret") ?? "";
  const expected = process.env["REFRESH_SECRET"] ?? "";

  if (!expected || !safeEqual(provided, expected)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  // Ack immediately — GitHub Action's curl has a 15s timeout, and the reset
  // + restart can take longer than that.
  res.status(200).json({ ok: true });

  try {
    logger.info("crosssync refresh: pulling latest and restarting");
    execSync("git fetch --all && git reset --hard origin/main", { stdio: "inherit" });
  } catch (err) {
    logger.error({ err }, "crosssync refresh: git reset failed");
    return;
  }

  // Replit's process supervisor restarts the app after exit.
  process.exit(0);
});

export default router;
