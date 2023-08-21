import {Router, Request, Response, json} from "express";
import { cards } from '../models/gameModel';
export const cardsRouter = Router();

cardsRouter.use(json());

cardsRouter.get("/cards", async (_req: Request, res: Response) => {
    try {
        const cardsArray = (await cards.find({}).lean().exec());
        return res.status(200).send(cardsArray);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
});