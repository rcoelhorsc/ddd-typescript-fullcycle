import {app, sequelize} from "../express"
import request from "supertest"

describe("E2E teste for custome", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "John",
            address: {
                street: "Street",
                number: 1,
                city: "City",
                zip: "12345",
            }
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John");
        expect(response.body.address.street).toBe("Street");
        expect(response.body.address.number).toBe(1);
        expect(response.body.address.city).toBe("City");
        expect(response.body.address.zip).toBe("12345");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "John",
        });

        expect(response.status).toBe(500);
    });        

    it("should list all customer", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "John",
            address: {
                street: "Street",
                number: 1,
                city: "City",
                zip: "12345",
            }
        });
        expect(response.status).toBe(200);

        const response2 = await request(app)
        .post("/customer")
        .send({
            name: "Jane",
            address: {
                street: "Street 2",
                number: 2,
                city: "City 2",
                zip: "1234",
            }
        });
        expect(response2.status).toBe(200);    
        
        const listResponse = await request(app).get("/customer").send();
        expect(listResponse.status).toBe(200);    
        expect(listResponse.body.customers.length).toBe(2);

        const customer = listResponse.body.customers[0];
        expect(customer.name).toBe("John");
        expect(customer.address.street).toBe("Street");
        expect(customer.address.number).toBe(1);
        expect(customer.address.city).toBe("City");
        expect(customer.address.zip).toBe("12345");

        const customer2 = listResponse.body.customers[1];
        expect(customer2.name).toBe("Jane");
        expect(customer2.address.street).toBe("Street 2");
        expect(customer2.address.number).toBe(2);
        expect(customer2.address.city).toBe("City 2");
        expect(customer2.address.zip).toBe("1234");      
        
        const listResponseXML = await request(app)
        .get("/customer")
        .set("Accept", "application/xml")
        .send()

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    });         
});