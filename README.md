# Feira da Fruta

## Introduction

**Feira da Fruta** (in portuguese: Fruit Market) is an app that i did to train my abilities with Express server and React. In this repo we have the server.

## Setup
 - execute yarn or npm install.
 - Create a postgres database and set it's name at ormconfig.json.
 - Set host, port, username and password of that database at ormconfig.json.

## Execution
- execute yarn start

## Routes
 - Routes are all configured in index.ts
  - GET "/api/product/:id" to fetch a product
  - POST "/api/product/register" to create a new product
    - Accepts:
        - Format: "application/json"
        - Body Parameters:
          - name: Product's new name
          - category: Product's category (which could be "FRUIT" or "VEGETABLE")
          - price: Product's price (if it's $ 1.00 use 100)
          - imported: Product's origin, Boolean.
  - POST "/api/product/destroy" to remove a product
    - Accepts:
        - Format: "application/json"
        - Body Parameters:
            - id: Product's UUID
  - POST "/api/product/update" to update a product
    - Accepts:
        - Format: "application/json"
        - Body Parameters:
            - id: Product's UUID
            - name: Product's new name
            - category: Product's category (which could be "FRUIT" or "VEGETABLE")
            - price: Product's price (if it's $ 1.00 use 100)
            - imported: Product's origin, Boolean.
  - GET "/api/products" to search for products
    - URL Parameters:
      - q: Name of the product
      - c: Category (which could be "FRUIT" or "VEGETABLE")
      - min: Minimum product price
      - max: Maximum product price
      - imported: if the product is imported
