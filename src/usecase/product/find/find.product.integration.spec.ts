import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Test create product use case", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
      });
      
      it("should find a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const product = new Product("p1", "Product 1", 10.0);
        await productRepository.create(product);

        const input = {
            id: "p1",
        };

        const output = {
            id: "p1",
            name: "Product 1",
            price: 10.0,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);        

    });
});      