import { BaseEntity, Column, PrimaryGeneratedColumn, Entity } from "typeorm";

export interface IProductCreationParams {
    name: string;
    expirationDate: Date;
    price: number;
    category: Category;
    imported: boolean;
}

export interface IProductChangeset {
    name: string;
    expirationDate: Date;
    price: number;
    category: Category;
    imported: boolean;
}

export enum Category {
    VEGETABLE = "VEGETABLE",
    FRUIT = "FRUIT",
}

@Entity("products")
export class Product extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column("varchar", { unique: true, nullable: false })
    public name!: string;

    @Column("timestamptz", { nullable: false })
    public expirationDate!: Date;

    @Column("numeric", { nullable: false })
    public price!: number;

    @Column("varchar", { length: 16, nullable: false })
    public category!: string;

    @Column("boolean", { nullable: false })
    public imported!: boolean;

    constructor(name: string, 
                expirationDate: Date,
                price: number,
                category: string, 
                imported: boolean = false){
        super();
        this.name = name;
        this.expirationDate = expirationDate;
        this.price = price;
        this.category = category;
        this.imported = imported;
    }

}