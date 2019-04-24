import express, { Request, Response } from "express";
import cors from "cors";
import bodyParse from "body-parser";
import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import Repos from "./repo";
import ProductController from "./controller/product";

createConnection().then(async (dbconn: Connection) => {
    const app = express();
    const port = 4600;

    app.use(cors());
    app.use(bodyParse.json());

    const repo = new Repos(dbconn);

    app.get("/api/product/:id", (req: Request, res: Response) => {
        ProductController.get(req, res, repo);
    });
    
    app.post("/api/product/register", (req: Request, res: Response) => {
        ProductController.register(req, res, repo);
    });
    
    app.post("/api/product/update", (req: Request, res: Response) => {
        ProductController.update(req, res, repo);
    });
    
    app.post("/api/product/destroy", (req: Request, res: Response) => {
        ProductController.destroy(req, res, repo);
    });
    
    app.get("/api/products", (req: Request, res: Response) => {
        ProductController.search(req, res, repo);
    });
    
    app.listen(port, () => {
        console.log(`Running on: http://localhost:${port}/`)
    });
});