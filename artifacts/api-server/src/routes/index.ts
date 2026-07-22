import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import modulesRouter from "./modules";
import learningRouter from "./learning";
import agentsRouter from "./agents";
import ticketsRouter from "./tickets";
import summariesRouter from "./summaries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(modulesRouter);
router.use(learningRouter);
router.use(agentsRouter);
router.use(ticketsRouter);
router.use(summariesRouter);

export default router;
