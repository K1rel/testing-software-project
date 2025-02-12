

import sinon from 'sinon';

import { ProductModel } from '../../src/models/ProductModel.js';
import { con } from '../../src/config/app-config.js';


describe('ProductModel', () => {
  let productModel;
  let queryStub;

  beforeEach(() => {
    productModel = new ProductModel();
    queryStub = sinon.stub(con, 'query');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('get', () => {
    it('should return products when database query succeeds', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      queryStub.callsArgWith(1, null, mockProducts);

      const result = await productModel.get();
      expect(result).toEqual(mockProducts);
    });

    it('should throw error when database query fails', async () => {
      queryStub.callsArgWith(1, new Error('DB Connection Failed'));
      await expect(productModel.get()).rejects.toThrow('Database error');
    });

    it('should throw error when no products found', async () => {
      queryStub.callsArgWith(1, null, []);
      await expect(productModel.get()).rejects.toThrow('No results found');
    });
  });

  describe('getPage', () => {
    it('should return paginated results', async () => {
      const mockProducts = [{ id: 1 }, { id: 2 }];
      queryStub.callsArgWith(2, null, mockProducts);

      const result = await productModel.getPage(2);
      expect(result.length).toBe(2);
      expect(queryStub.args[0][0]).toContain('LIMIT ?, ?');
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', async () => {
      const getStub = sinon.stub(productModel, 'getById')
        .resolves([{ id: 1, stock: 10 }]);
      
        queryStub.callsArgWith(2, null, []); 
      await productModel.updateStock(1, 5);
      
      sinon.assert.calledWith(queryStub, 
        'UPDATE products SET stock = ? WHERE id = ?',
        [15, 1],
        sinon.match.func
      );
    });

    it('should reject when stock goes negative', async () => {
      sinon.stub(productModel, 'getById').resolves([{ id: 1, stock: 5 }]);
      await expect(productModel.updateStock(1, -10))
        .rejects.toThrow('Maximum stock reached');
    });
  });

  describe('cart operations', () => {
    const userId = 1;
    const productId = 123;

    it('should add item to cart', async () => {
      queryStub.callsArgWith(2, null, { affectedRows: 1 });

      const result = await productModel.createInCart(userId, productId);
      expect(result).toBe('Product added to customer cart');
    });

    it('should remove item from cart', async () => {
      
      queryStub.callsArgWith(2, null, { affectedRows: 1 });

      const result = await productModel.deleteInCart(userId, productId);
      expect(result).toBe('Product removed from customer cart');
    });
  });
});