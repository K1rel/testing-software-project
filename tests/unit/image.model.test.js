import { ImageModel } from "../../src/models/ImageModel.js";


const mockQuery = jest.fn();
const mockCon = { query: mockQuery };

describe("ImageModel", () => {
    let imageModel;
  
    beforeEach(() => {
      imageModel = new ImageModel();
      imageModel.con = mockCon;
      mockQuery.mockClear();
    });
  
    test("get() should return all images", async () => {
      mockQuery.mockImplementation((query, callback) => {
        callback(null, [{ id: 1, product_id: 10, url: "image1.jpg" }]);
      });
      await expect(imageModel.get()).resolves.toEqual([{ id: 1, product_id: 10, url: "image1.jpg" }]);
    });
  
    test("getById() should return an image by id", async () => {
      mockQuery.mockImplementation((query, values, callback) => {
        callback(null, [{ id: 1, product_id: 10, url: "image1.jpg" }]);
      });
      await expect(imageModel.getById(1)).resolves.toEqual([{ id: 1, product_id: 10, url: "image1.jpg" }]);
    });
  
    test("getByProductId() should return images associated with a product", async () => {
      mockQuery.mockImplementation((query, values, callback) => {
        callback(null, [{ id: 1, product_id: 10, url: "image1.jpg" }]);
      });
      await expect(imageModel.getByProductId(10)).resolves.toEqual([{ id: 1, product_id: 10, url: "image1.jpg" }]);
    });
  });