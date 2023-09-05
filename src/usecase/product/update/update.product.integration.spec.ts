import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

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
      
      it("should create a product", async () => {

        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("p1", "Product", 10.0);
        await productRepository.create(product);

        const input = {
            id: product.id,
            name: "Product Updated",
            price: 20.0,
        };

        const output = await usecase.execute(input);

        expect(output).toEqual(input);
    });
});      