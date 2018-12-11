DROP DATABASE IF EXISTS bamazon_db;
 
CREATE DATABASE bamazon_db;
 
USE bamazon_db;
 
CREATE TABLE products (
 
item_id INTEGER(11) NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(50) NOT NULL, 
price DECIMAL(10, 2) NOT NULL,
stock_quantity INTEGER (11) NOT NULL,
PRIMARY KEY (item_id)
);
 
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Specalized S-Works StumpJumper", "Bikes", 9500.00, 10),
(2, "Mclaren Senna", "Cars", 2670000.00, 3),
(3, "Chateau Petrus Year 2010", "Liquor", 21000.00, 20),
(4, "Mosaic Table LaBellezza", "Furniture", 244000.00, 1),
(5, "Tag Heuer Monaco V4 Watch", "Jewlery", 199000.00, 25),
(6, "Back to the Future Nike Air Mag", "Apparel", 48000.00, 50),
(7, "Kiton Slate Blue Windowpane Suit", "Apparel", 11500.00, 100),
(8, "Vivians's Ball Gown Wedding Dress", "Apparel", 27100.00, 80),
(9, "Glenlivet 50 Year Single Malt Scotch", "Liquor", 42500.00, 10),
(10, "Sony 100 inch 4K Bravia TV", "Electronics", 64200.00, 80),
(11, "174.97 Ct Emerald and Diamond Necklace", "Jewlery", 8300000.00, 2)
;
 
SELECT * FROM products;