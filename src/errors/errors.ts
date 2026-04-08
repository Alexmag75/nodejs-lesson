import {Response} from "express";

export const handleError = (res: Response, e: unknown, defaultMessage: string) => {
    const message = e instanceof Error ? e.message : defaultMessage;
    res.status(500).send(message);
};