import { Router, type IRouter } from "express";
import healthRouter from "./health";
import refreshRouter from "./refresh";

const router: IRouter = Router();

router.use(healthRouter);
router.use(refreshRouter);

export default router;
