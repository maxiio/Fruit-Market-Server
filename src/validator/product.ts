import { Request } from "express";
import { check, param, query, validationResult } from "express-validator/check";

export default class ProductRequestValidator{
    public static nameValidator(value: any, { req }: any){
        if (req.body.name.includes(";") || req.body.name.includes("*")){
            throw new Error("invalid_product_name");
        }
    }

    public static isDate(value: any, { req }: any){
        if (isNaN(Date.parse(value))){
            throw new Error("invalid_expiration_date");
        }
    }

    public static get(req: Request){
        param("id").isUUID(4).withMessage("invalid_product_id");
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { id } = req.params;
        return { id };
    }

    public static register(req: Request){
        check("name").isString().custom(ProductRequestValidator.nameValidator);
        check("expirationDate").custom(ProductRequestValidator.isDate);
        check("category").isString();
        check("price").isNumeric();
        check("imported").isBoolean();        
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { name, expirationDate, category, price, imported } = req.body;
        return { name, expirationDate, category, price, imported };
    }

    public static update(req: Request){
        check("id").isUUID();
        check("name").isString();
        check("expirationDate").custom(ProductRequestValidator.isDate);
        check("category").isString();
        check("price").isNumeric();
        check("imported").isBoolean();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { id, name, expirationDate, category, price, imported } = 
            req.body;
        const params = { name, expirationDate, category, price, imported };
        return { id, params };
    }


    public static destroy(req: Request){
        check("id").isUUID();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { id } = req.body;
        return { id };
    }

    public static search(req: Request){
        query("c").isString();
        query("q").isString();
        query("min").isNumeric();
        query("max").isNumeric();
        query("imported").isBoolean();
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new Error("bad_request");
        }
        const { c, q, min, max, imported } = req.query;
        return { category: c, name: q, min, max, imported };
    }

}