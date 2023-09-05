import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("p1", "Product 1", 10.0)

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit test find product use case", () => {

    it("should find a product", async () => {

        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

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

    it("should not find a product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const usecase = new FindProductUseCase(productRepository);

        await productRepository.create(product);

        const input = {
            id: "p2",
        };
        
        expect(() => {
           return usecase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});