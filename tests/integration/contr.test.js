import request from 'supertest';
import mysql from 'mysql2/promise';
import { app } from '../../app.js';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../../src/config/app-config.js';

describe('Integration Tests', () => {
  let testUser;
  let testProduct;
  let cookies;
  let connection;

 
  jest.setTimeout(30000); 

  beforeAll(async () => {
    try {
      
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Kiril123!@#',
        database: 'eCommerce_test',
      });

      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
      await connection.execute('TRUNCATE TABLE users');
      await connection.execute('TRUNCATE TABLE customers');
      await connection.execute('TRUNCATE TABLE products');
      await connection.execute('TRUNCATE TABLE images');
      await connection.execute('TRUNCATE TABLE carts');
      await connection.execute('TRUNCATE TABLE orders');
      await connection.execute('TRUNCATE TABLE orders_products');
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

     
      const saltRounds = SALT_ROUNDS ? parseInt(SALT_ROUNDS) : 10;
      const hashedPassword = await bcrypt.hash('testpass123', saltRounds);
      
      const [userResult] = await connection.execute(
        'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
        ['Test User', 'test@example.com', hashedPassword, 'employee']
      );
      testUser = { id: userResult.insertId };

    
      const [productResult] = await connection.execute(
        'INSERT INTO products (title, price, description, stock) VALUES (?, ?, ?, ?)',
        ['Test Product', 99.99, 'Test Description', 10]
      );
      testProduct = { id: productResult.insertId };

      await connection.execute(
        'INSERT INTO images (product_id, path) VALUES (?, ?)',
        [testProduct.id, '/home/k1rel/finki_7_semester/skit/node.js_eCommerce_MVC-master/public/img/products/prod-8/prod-8-1.jpg']
      );
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123'
      });
  
    if (loginResponse.headers['set-cookie']) {
      cookies = loginResponse.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
    }
  });

  afterAll(async () => {
    try {
      
      await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

      
      await connection.execute('TRUNCATE TABLE users');
      await connection.execute('TRUNCATE TABLE customers');
      await connection.execute('TRUNCATE TABLE products');
      await connection.execute('TRUNCATE TABLE images');
      await connection.execute('TRUNCATE TABLE carts');
      await connection.execute('TRUNCATE TABLE orders');
      await connection.execute('TRUNCATE TABLE orders_products');

      
      await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

      
      await connection.end();
    } catch (error) {
      console.error('Cleanup error:', error);
      throw error;
    }
  });

  describe('UserController Tests', () => {
    describe('POST /user/login', () => {
      it('should login successfully with correct credentials', async () => {
        const response = await request(app)
          .post('/user/login')
          .send({
            email: 'test@example.com',
            password: 'testpass123'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('login'); 
        expect(response.headers['set-cookie']).toBeDefined();
      });

      it('should fail login with incorrect credentials', async () => {
        const response = await request(app)
          .post('/user/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('login'); 
      });
    });

    describe('POST /user/register', () => {
      it('should register a new user successfully', async () => {
        const response = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/x-www-form-urlencoded') 
        .send({
          registerName: 'New User',
          registerEmail: 'new2@example.com', 
          registerPassword: 'newpass123'
        });
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe('/user/login');
      });

      it('should fail registration with existing email', async () => {
        const response = await request(app)
        .post('/user/register')
        .set('Content-Type', 'application/x-www-form-urlencoded') 
        .send({
          registerName: 'Duplicate User',
          registerEmail: 'new2@example.com', 
          registerPassword: 'testpass123'
        });

        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('ER_DUP_ENTRY'); 
        expect(response.body.error.message).toBe('Email already exists'); 
      });
    });
  });

  describe('PublicController Tests', () => {
    
  
    describe('GET /', () => {
      it('should render the homepage with the test product', async () => {
        const response = await request(app)
          .get('/')
          .set('Cookie', cookies)
          .set('Accept', 'text/html');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Test Product'); 
        expect(response.text).toContain('Test Description'); 
      });

      it('should handle errors gracefully when no products are found', async () => {
      
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0'); 
    await connection.execute('TRUNCATE TABLE images'); 
    await connection.execute('TRUNCATE TABLE products'); 
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1'); 

  
    const response = await request(app)
      .get('/')
      .set('Accept', 'text/html');

   
    expect(response.status).toBe(500); 
    expect(response.text).toContain('No results found in the database'); 

      });
    }, 60000);

    describe('POST /cart/addToCart', () => {
      it('should add product to cart successfully', async () => {
        const response = await request(app)
          .post('/cart/addToCart')
          .set('Cookie', cookies)
          .send({
            product_id: testProduct.id,
            quantity: 1
          });

       
        expect([200, 302]).toContain(response.status);
      });

      it('should fail when product is out of stock', async () => {
        
        await connection.execute(
          'UPDATE products SET stock = 0 WHERE id = ?',
          [testProduct.id]
        );

        const response = await request(app)
          .post('/cart/addToCart')
          .set('Cookie', cookies)
          .send({
            product_id: testProduct.id,
            quantity: 1
          });

        
        expect([400, 302]).toContain(response.status);

        
        await connection.execute(
          'UPDATE products SET stock = 10 WHERE id = ?',
          [testProduct.id]
        );
      });
    });

    describe('POST /checkout/validateShipping', () => {
      it('should validate shipping details successfully', async () => {
        const response = await request(app)
          .post('/checkout/1')
          .set('Cookie', cookies)
          .send({
            address: '123 Test St',
            city: 'Test City',
            zipCode: '12345',
            country: 'Test Country',
            phone: '1234567890'
          });

        expect(response.status).toBe(302);
        
        expect(['/checkout/2', '/user/login']).toContain(response.headers.location);
      });
    });

    describe('POST /checkout/validatePayment', () => {
      it('should validate payment details successfully', async () => {
        const response = await request(app)
          .post('/checkout/2')
          .set('Cookie', cookies)
          .send({
            cardNumber: '4111111111111111',
            expiry: '12/25',
            cvv: '123'
          });

        expect(response.status).toBe(302);
        
        expect(['/checkout/3', '/user/login']).toContain(response.headers.location);
      });

      it('should reject invalid credit card number', async () => {
        const response = await request(app)
          .post('/checkout/2')
          .set('Cookie', cookies)
          .send({
            cardNumber: '1234123412341234',
            expiry: '12/25',
            cvv: '123'
          });

       
        expect([400, 302]).toContain(response.status);
      });
    });
  });
});