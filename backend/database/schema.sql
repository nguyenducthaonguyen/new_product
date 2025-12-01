-- ============================================================================
-- NEXUS E-commerce Database Schema
-- PostgreSQL DDL Script
-- ============================================================================
-- Description: Complete database schema for NEXUS e-commerce platform
-- Version: 1.0.0
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: users
-- Description: User accounts (Customer, Admin, Staff)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_user_role CHECK (role IN ('admin', 'staff', 'customer'))
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ============================================================================
-- Table: products
-- Description: Product catalog
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    images JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 0.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_product_price CHECK (price >= 0),
    CONSTRAINT chk_product_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT chk_product_review_count CHECK (review_count >= 0),
    CONSTRAINT chk_product_currency CHECK (LENGTH(currency) = 3)
);

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- ============================================================================
-- Table: product_variants
-- Description: Product variants (Size, Color, etc.) with SKU and stock
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50),
    size VARCHAR(20),
    stock INTEGER NOT NULL DEFAULT 0,
    price_modifier NUMERIC(10, 2) NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_product_variant_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_variant_stock CHECK (stock >= 0),
    CONSTRAINT chk_variant_price_modifier CHECK (price_modifier >= -999999.99)
);

-- Indexes for product_variants
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_stock ON product_variants(stock);

-- ============================================================================
-- Table: carts
-- Description: Shopping carts (supports both guest and authenticated users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    session_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cart_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_cart_user_or_session CHECK (
        (user_id IS NOT NULL) OR (session_id IS NOT NULL)
    )
);

-- Indexes for carts
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_created_at ON carts(created_at);

-- ============================================================================
-- Table: cart_items
-- Description: Items in shopping carts
-- ============================================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    sku VARCHAR(100) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cart_item_cart 
        FOREIGN KEY (cart_id) 
        REFERENCES carts(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_item_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_cart_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_cart_item_price CHECK (price >= 0)
);

-- Indexes for cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_sku ON cart_items(sku);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ============================================================================
-- Table: orders
-- Description: Customer orders
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    delivery_info JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_order_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_order_status CHECK (
        status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')
    ),
    CONSTRAINT chk_order_total CHECK (total >= 0)
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- Table: order_items
-- Description: Items in orders
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    
    CONSTRAINT fk_order_item_order 
        FOREIGN KEY (order_id) 
        REFERENCES orders(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product 
        FOREIGN KEY (product_id) 
        REFERENCES products(id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_order_item_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_item_price CHECK (price >= 0)
);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- Table: access_token_log
-- Description: Track access tokens for authentication and logout
-- ============================================================================
CREATE TABLE IF NOT EXISTS access_token_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_access_token_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Indexes for access_token_log
CREATE INDEX IF NOT EXISTS idx_access_token_user_id ON access_token_log(user_id);
CREATE INDEX IF NOT EXISTS idx_access_token_token ON access_token_log(token);
CREATE INDEX IF NOT EXISTS idx_access_token_expires_at ON access_token_log(expires_at);

-- ============================================================================
-- Triggers for updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_access_token_log_updated_at BEFORE UPDATE ON access_token_log
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE users IS 'User accounts including customers, admins, and staff';
COMMENT ON TABLE products IS 'Product catalog with base information';
COMMENT ON TABLE product_variants IS 'Product variants with SKU, stock, and price modifiers';
COMMENT ON TABLE carts IS 'Shopping carts supporting both guest and authenticated users';
COMMENT ON TABLE cart_items IS 'Items in shopping carts';
COMMENT ON TABLE orders IS 'Customer orders with status tracking';
COMMENT ON TABLE order_items IS 'Items in orders (historical record)';
COMMENT ON TABLE access_token_log IS 'Access token tracking for authentication';

COMMENT ON COLUMN products.images IS 'JSON array of image URLs';
COMMENT ON COLUMN products.rating IS 'Product rating from 0.00 to 5.00';
COMMENT ON COLUMN product_variants.sku IS 'Stock Keeping Unit - unique identifier for variant';
COMMENT ON COLUMN product_variants.price_modifier IS 'Price adjustment from base product price';
COMMENT ON COLUMN carts.user_id IS 'Nullable for guest carts';
COMMENT ON COLUMN carts.session_id IS 'Session ID for guest carts';
COMMENT ON COLUMN cart_items.price IS 'Price at time of adding to cart (snapshot)';
COMMENT ON COLUMN orders.delivery_info IS 'JSON object containing delivery address and details';
COMMENT ON COLUMN orders.status IS 'Order status: pending, paid, shipped, completed, cancelled';

-- ============================================================================
-- Sample Data: Products and Variants
-- ============================================================================

-- Insert sample products
INSERT INTO products (name, slug, description, price, currency, images, rating, review_count) VALUES
(
    'Nike Air Max 90',
    'nike-air-max-90',
    'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU accents. Fresh colors give it a modern look while Max Air cushioning adds comfort to your journey.',
    120.00,
    'USD',
    '["https://via.placeholder.com/800x600/FF0000/FFFFFF?text=Nike+Air+Max+90+1", "https://via.placeholder.com/800x600/0000FF/FFFFFF?text=Nike+Air+Max+90+2"]'::jsonb,
    4.8,
    120
),
(
    'Adidas Ultraboost 22',
    'adidas-ultraboost-22',
    'Experience ultimate comfort with Adidas Ultraboost 22. Featuring responsive cushioning and a supportive fit, these running shoes are perfect for daily runs and workouts.',
    150.00,
    'USD',
    '["https://via.placeholder.com/800x600/00FF00/FFFFFF?text=Adidas+Ultraboost+1", "https://via.placeholder.com/800x600/FFFF00/000000?text=Adidas+Ultraboost+2"]'::jsonb,
    4.6,
    89
),
(
    'Puma RS-X3',
    'puma-rs-x3',
    'The Puma RS-X3 combines retro style with modern technology. Bold design meets comfortable cushioning for a standout look.',
    110.00,
    'USD',
    '["https://via.placeholder.com/800x600/FF00FF/FFFFFF?text=Puma+RS-X3+1"]'::jsonb,
    4.5,
    67
),
(
    'New Balance 574',
    'new-balance-574',
    'A classic running shoe with timeless style. The New Balance 574 features ENCAP midsole cushioning and a durable suede and mesh upper.',
    85.00,
    'USD',
    '["https://via.placeholder.com/800x600/808080/FFFFFF?text=New+Balance+574+1", "https://via.placeholder.com/800x600/000000/FFFFFF?text=New+Balance+574+2"]'::jsonb,
    4.7,
    145
),
(
    'Converse Chuck Taylor All Star',
    'converse-chuck-taylor-all-star',
    'The iconic Converse Chuck Taylor All Star. A timeless classic that goes with everything.',
    55.00,
    'USD',
    '["https://via.placeholder.com/800x600/FFFFFF/000000?text=Converse+Chuck+Taylor+1"]'::jsonb,
    4.4,
    203
)
ON CONFLICT (slug) DO NOTHING;

-- Insert product variants for Nike Air Max 90
INSERT INTO product_variants (product_id, sku, color, size, stock, price_modifier) VALUES
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-RED-42', 'Red', '42', 10, 0.00),
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-RED-43', 'Red', '43', 8, 0.00),
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-BLUE-42', 'Blue', '42', 0, 0.00),
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-BLUE-43', 'Blue', '43', 5, 0.00),
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-BLACK-42', 'Black', '42', 15, 10.00),
((SELECT id FROM products WHERE slug = 'nike-air-max-90'), 'NIKE-AM90-BLACK-43', 'Black', '43', 12, 10.00)
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants for Adidas Ultraboost 22
INSERT INTO product_variants (product_id, sku, color, size, stock, price_modifier) VALUES
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-22'), 'ADIDAS-UB22-BLACK-43', 'Black', '43', 7, 0.00),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-22'), 'ADIDAS-UB22-BLACK-44', 'Black', '44', 9, 0.00),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-22'), 'ADIDAS-UB22-WHITE-43', 'White', '43', 4, 0.00),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-22'), 'ADIDAS-UB22-WHITE-44', 'White', '44', 6, 0.00),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-22'), 'ADIDAS-UB22-GREY-43', 'Grey', '43', 3, -5.00)
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants for Puma RS-X3
INSERT INTO product_variants (product_id, sku, color, size, stock, price_modifier) VALUES
((SELECT id FROM products WHERE slug = 'puma-rs-x3'), 'PUMA-RSX3-RED-42', 'Red', '42', 6, 0.00),
((SELECT id FROM products WHERE slug = 'puma-rs-x3'), 'PUMA-RSX3-RED-43', 'Red', '43', 8, 0.00),
((SELECT id FROM products WHERE slug = 'puma-rs-x3'), 'PUMA-RSX3-BLUE-42', 'Blue', '42', 5, 0.00),
((SELECT id FROM products WHERE slug = 'puma-rs-x3'), 'PUMA-RSX3-BLUE-43', 'Blue', '43', 4, 0.00)
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants for New Balance 574
INSERT INTO product_variants (product_id, sku, color, size, stock, price_modifier) VALUES
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-GREY-42', 'Grey', '42', 12, 0.00),
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-GREY-43', 'Grey', '43', 15, 0.00),
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-NAVY-42', 'Navy', '42', 10, 0.00),
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-NAVY-43', 'Navy', '43', 11, 0.00),
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-BLACK-42', 'Black', '42', 8, 5.00),
((SELECT id FROM products WHERE slug = 'new-balance-574'), 'NB-574-BLACK-43', 'Black', '43', 9, 5.00)
ON CONFLICT (sku) DO NOTHING;

-- Insert product variants for Converse Chuck Taylor All Star
INSERT INTO product_variants (product_id, sku, color, size, stock, price_modifier) VALUES
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-BLACK-41', 'Black', '41', 20, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-BLACK-42', 'Black', '42', 25, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-BLACK-43', 'Black', '43', 22, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-WHITE-41', 'White', '41', 18, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-WHITE-42', 'White', '42', 20, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-WHITE-43', 'White', '43', 19, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-RED-42', 'Red', '42', 15, 0.00),
((SELECT id FROM products WHERE slug = 'converse-chuck-taylor-all-star'), 'CONVERSE-CT-RED-43', 'Red', '43', 12, 0.00)
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- End of Schema
-- ============================================================================

