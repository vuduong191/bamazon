DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE departments(
	department_id INT(10) AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT(50) NOT NULL
);
CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    department_id INT(10) NOT NULL,
    price DECIMAL(8,2),
    stock_quantity INT(10),
    product_sales DECIMAL(10,2),
    FOREIGN KEY(department_id) REFERENCES departments(department_id)
);
INSERT INTO departments(department_name, over_head_costs)
VALUES
	("Electronics",2000),
    ("Fashion",1500),
    ("Beauty",1000),
    ("Pet Supplies",500),
    ("Home Decor",500),
    ("Grocery",200),
    ("Health & Personal Care",50);

INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales) 
VALUES 
	("Bose QuietComfort 35", 1, 299, 10, 400),
    ("3-Pack Loose Fit Fleece Footed Pajamas", 2, 14.99, 200, 400),
    ("LG Electronics 65SK8000PUA 65-Inch 4K", 1, 896.99, 120, 400),
    ("India's Original Masala Chai Tea Loose Leaf", 6, 12.74, 1200, 500),
    ("Dog Nail Clippers and Trimmer By Boshel", 4, 9.38, 100, 100),
    ("TOGUARD Backup Camera", 1, 59.49, 100, 400),
    ("Rugshop Newport Area Rug", 5, 73.01, 1000, 200),
    ("Flents Quiet Contour Ear Plugs", 7, 11.38, 1010, 200),
    ("14k Gold Solitaire Bezel Set Diamond with Lobster Clasp Strand Bracelet", 2, 129.22, 100, 400),
    ("HEALTH WARRIOR Chia Bars", 6, 17.81, 1001, 200),
    ("Gillette Venus Women's Sensitive 3 Blades", 3, 8.18, 1001, 400);

    
-- SELECT * FROM products;
-- SELECT * FROM departments;

-- SELECT * FROM products WHERE stock_quantity<5;

-- SELECT departments.department_id, department_name, over_head_costs, COALESCE(SUM(product_sales),0) AS total_product_sales, COALESCE(SUM(product_sales),0)-over_head_costs AS total_profit
-- FROM departments LEFT JOIN products ON departments.department_id = products.department_id
-- GROUP BY department_id;

