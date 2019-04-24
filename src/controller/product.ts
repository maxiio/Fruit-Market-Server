import { Request, Response } from "express";
import ProductRequestValidator from "../validator/product";
import Repos from "../repo";

export default class ProductController{

    private static undefinedGuard(params: any){
        const { c, name, min, max, imported } = params;
        if (c === undefined
            && name === undefined
            && min === undefined
            && max === undefined
            && imported === undefined){
            return true;
        }
        return false;
    }

    public static async get(req: Request, res: Response, repo: Repos){
        try {
            const params = ProductRequestValidator.get(req);
            const product = await repo.product.get(params);
            if (!product){
                throw new Error("product_not_found");
            }
            const renderedProduct = JSON.stringify(product);
            return res.status(200).json(renderedProduct);
        } catch(err) {
            res.status(400).json({ error: err.toString() });
        }
    }

    public static async register(req: Request, res: Response, repo: Repos){
        try {
            const params = ProductRequestValidator.register(req);
            const product = await repo.product.register(params);
            if (!product){
                throw new Error("product_not_found");
            }
            const renderedProduct = JSON.stringify(product);
            return res.status(201).json(renderedProduct);
        } catch(err){
            return res.status(400).json({ error: err.toString() });
        }
    }

    public static async update(req: Request, res: Response, repo: Repos){
        try {
            const params = ProductRequestValidator.update(req);
            const product = await repo.product.update(params);
            if (!product){
                throw new Error("product_not_found");
            }
            const renderedProduct = JSON.stringify(product);
            return res.status(200).json(renderedProduct);
        } catch(err){
            res.status(400).json({ error: err.toString() });
        }
    }

    public static async destroy(req: Request, res: Response, repo: Repos){
        try {
            const params = ProductRequestValidator.destroy(req);
            const deleted = await repo.product.destroy(params);
            if (!deleted){
                res.status(500).json();
                throw new Error("product_not_deleted");
            }
            return res.status(200).json();
        } catch(err){
            if (err !== new Error("product_not_deleted")) {
                return res.status(400).json({ error: err.toString() });
            }
        }
    }

    public static async search(req: Request, res: Response, repo: Repos){
        try {
            const params = ProductRequestValidator.search(req);
            if (ProductController.undefinedGuard(params)){
                return res.status(200).json({ products: [] });
            }
            const products =  await repo.product.getMany(params);
            if (!products){
                throw new Error();
            }
            const renderedProducts = JSON.stringify({ products });
            return res.status(200).send(renderedProducts);

        } catch(err){
            res.status(400).json({ error: err });
        }
    }
}