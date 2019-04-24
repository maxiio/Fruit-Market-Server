import ProductRepo from "./product";
import { Connection } from "typeorm";

export default class Repos {
    product: ProductRepo;
    
    constructor(dbconn: Connection){
        this.product = new ProductRepo(dbconn);
    }
}