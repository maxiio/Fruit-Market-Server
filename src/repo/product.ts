import { Product,
         Category,
         IProductChangeset
} from "../entity/product";
import { Connection, Repository, SelectQueryBuilder } from "typeorm";

declare module "typeorm" {
    class SelectQueryBuilder<Entity> {
        map(f: (qb: SelectQueryBuilder<Entity>) => SelectQueryBuilder<Entity>): 
            SelectQueryBuilder<Entity>;
    }
}

SelectQueryBuilder.prototype.map = function (f) {
    return f(this);
}

export interface IProductGetParams{
    id: string;
}

export interface IProductRegisterParams {
    name: string;
    expirationDate: string;
    price: number;
    category: Category;
    imported: boolean;
}

export interface IProductUpdateParams {
    id: string;
    params: IProductChangeset;
}

export interface IProductDestroyParams{
    id: string;
}

export interface IProductQueryParams {
    name?: string;
    expirationDate?: Date;
    category?: Category;
    min?: number;
    max?: number;
    imported?: boolean;
}

export default class ProductRepo {

    public dbconn: Connection;
    public repo: Repository<Product>;

    constructor(dbconn: Connection) {
        this.dbconn = dbconn;
        this.repo = dbconn.getRepository(Product);
    }

    public async get(params: IProductGetParams){
        const { id } = params;
        return this.repo
            .createQueryBuilder("product")
            .where("product.id = :id", { id })
            .getOne();
    }

    public async register(params: IProductRegisterParams){
        const { name, expirationDate, price, category, imported } = params;
        const expDate = Date.parse(expirationDate);
        const date = new Date(expDate);
        const product = new Product(name, date, price, category, imported);
        return await product.save();
    }

    public async update(args: IProductUpdateParams){
        const { id, params } = args;
        this.dbconn
            .createQueryBuilder()
            .update(Product)
            .set({... params})
            .where("id = :id", { id })
            .execute();
        return this.get({ id });
    }

    public async destroy(params: IProductDestroyParams){
        const { id } = params;
        await this.dbconn
            .createQueryBuilder()
            .delete()
            .from(Product)
            .where("id = :id", { id })
            .execute();
        const deleted = await this.get({ id });
        return (deleted === undefined);
    }
    
    queryNameIfExists(qb: SelectQueryBuilder<Product>,
                      name: string | undefined){
        if (name){
            return qb.andWhere("product.name = :name", { name });
        }
        return qb;
    }

    queryExpirationDateIfExists(qb: SelectQueryBuilder<Product>,
                                expDate: Date | undefined){
        if (expDate){
            return qb.andWhere("product.expirationDate = :expDate", { expDate });
        }
        return qb;
    }

    queryMinPriceIfExists(qb: SelectQueryBuilder<Product>,
                          min: number | undefined){
        if (min){
            return qb.andWhere("product.price >= :min", { min });
        }
        return qb;
    }

    queryMaxPriceIfExists(qb: SelectQueryBuilder<Product>,
                          max: number | undefined){
        if (max){
            return qb.andWhere("product.price <= :max", { max });
        }
        return qb;
    }

    queryCategoryIfExists(qb: SelectQueryBuilder<Product>,
                          category: Category | undefined){
        if (category){
            return qb.andWhere("product.category = :category", { category });
        }
        return qb;
    }

    queryImportedIfExists(qb: SelectQueryBuilder<Product>,
                          imported: boolean | undefined){
        if (imported === undefined){
            return qb;
        }
        return qb.andWhere("product.imported = :imported", { imported });
    }

    public async getMany(params: IProductQueryParams){
        const { name, expirationDate, min, max, category, imported } = params;

        const mapName = (qb: SelectQueryBuilder<Product>) => 
            this.queryNameIfExists(qb, name);
        
        const mapExpDate = (qb: SelectQueryBuilder<Product>) => 
            this.queryExpirationDateIfExists(qb, expirationDate);
        
        const mapMin = (qb: SelectQueryBuilder<Product>) =>
            this.queryMinPriceIfExists(qb, min)
        
        const mapMax = (qb: SelectQueryBuilder<Product>) =>
            this.queryMaxPriceIfExists(qb, max)
        
        const mapCategory = (qb: SelectQueryBuilder<Product>) =>
            this.queryCategoryIfExists(qb, category)
        
        const mapImported = (qb: SelectQueryBuilder<Product>) =>
            this.queryImportedIfExists(qb, imported)

        return this.repo.createQueryBuilder("product")
            .map(mapName)
            .map(mapExpDate)
            .map(mapMin)
            .map(mapMax)
            .map(mapCategory)
            .map(mapImported)
            .orderBy("product.name", "ASC")
            .getMany();
    }

}