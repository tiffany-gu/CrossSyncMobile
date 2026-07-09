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

router.post("/crosssync/refresh", (req, res) => {
  const provided = req.header("X-Refresh-Secret") ?? "";
  const expected = process.env["REFRESH_SECRET"] ?? "";

  if (!expected || !safeEqual(provided, expected)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  res.status(200).json({ ok: true });

  try {
    logger.info("crosssync refresh: pulling latest and restarting");
    execSync("git fetch --all && git reset --hard origin/main", { stdio: "inherit" });
  } catch (err) {
    logger.error({ err }, "crosssync refresh: git reset failed");
    return;
  }

  process.exit(0);
});

export default router;

3. Edit artifacts/api-server/src/routes/index.ts to add two lines:
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import refreshRouter from "./refresh";

const router: IRouter = Router();

router.use(healthRouter);
router.use(refreshRouter);

export default router;