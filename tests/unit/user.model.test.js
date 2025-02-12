import { UserModel } from "../../src/models/UserModel.js";



const mockQuery = jest.fn();
const mockCon = { query: mockQuery };


describe("UserModel", () => {
  let userModel;

  beforeEach(() => {
    userModel = new UserModel();
    userModel.con = mockCon;
    mockQuery.mockClear();
  });

  test("create() should resolve success message on successful query", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });
    await expect(userModel.create(["John Doe", "john@example.com", "password"])).resolves.toBe("You are now registered and can log in");
  });

  test("getByEmail() should return user details on successful query", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, fullname: "John Doe", email: "john@example.com" }]);
    });
    await expect(userModel.getByEmail("john@example.com")).resolves.toEqual([{ id: 1, fullname: "John Doe", email: "john@example.com" }]);
  });

  test("getById() should return user details on successful query", async () => {
    mockQuery.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, fullname: "John Doe" }]);
    });
    await expect(userModel.getById(1)).resolves.toEqual([{ id: 1, fullname: "John Doe" }]);
  });
});



