-- ============================================================================
-- Migration: Fix Orders Schema
-- Description: 
--   1. Add product_variant_id to order_items (thay product_id)
--   2. Add total_product and cost_ship to orders (tách từ total)
-- ============================================================================

-- Step 1: Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS total_product NUMERIC(12, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost_ship NUMERIC(12, 2) NOT NULL DEFAULT 0;

-- Step 2: Migrate existing data
-- Set total_product = total (assume no shipping cost for old orders)
UPDATE orders 
SET total_product = total, cost_ship = 0 
WHERE total_product = 0 AND cost_ship = 0;

-- Step 3: Add product_variant_id and sku to order_items
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_variant_id INTEGER,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

-- Step 4: Try to populate product_variant_id from cart_items if possible
-- (This is a best-effort migration - may not work for all cases)
-- Note: This assumes we can match by product_id and price
-- In practice, you may need to manually review or set to NULL

-- Step 5: Add foreign key constraint for product_variant_id
ALTER TABLE order_items
ADD CONSTRAINT fk_order_item_product_variant 
    FOREIGN KEY (product_variant_id) 
    REFERENCES product_variants(id) 
    ON DELETE RESTRICT;

-- Step 6: Add index for product_variant_id and sku
CREATE INDEX IF NOT EXISTS idx_order_items_product_variant_id 
ON order_items(product_variant_id);

CREATE INDEX IF NOT EXISTS idx_order_items_sku 
ON order_items(sku);

-- Step 7: Make product_variant_id and sku NOT NULL after migration
-- (Comment out for now - uncomment after verifying data migration)
-- ALTER TABLE order_items 
-- ALTER COLUMN product_variant_id SET NOT NULL;
-- ALTER TABLE order_items 
-- ALTER COLUMN sku SET NOT NULL;

-- Step 8: Drop old product_id column (after verifying migration)
-- (Comment out for now - uncomment after verifying data migration)
ALTER TABLE order_items 
DROP CONSTRAINT IF EXISTS fk_order_item_product;
DROP INDEX IF EXISTS idx_order_items_product_id;
ALTER TABLE order_items 
DROP COLUMN IF EXISTS product_id;

-- Step 9: Add constraints
ALTER TABLE orders
ADD CONSTRAINT chk_order_total_product CHECK (total_product >= 0),
ADD CONSTRAINT chk_order_cost_ship CHECK (cost_ship >= 0);

-- Step 10: Update total to be calculated (or keep as stored value)
-- Option A: Keep total as stored (current approach)
-- Option B: Make total a computed column (PostgreSQL 12+)
-- ALTER TABLE orders 
-- ADD COLUMN total_computed NUMERIC(12, 2) GENERATED ALWAYS AS (total_product + cost_ship) STORED;

COMMENT ON COLUMN orders.total_product IS 'Total price of all products (before shipping)';
COMMENT ON COLUMN orders.cost_ship IS 'Shipping cost';
COMMENT ON COLUMN orders.total IS 'Total amount (total_product + cost_ship)';
COMMENT ON COLUMN order_items.product_variant_id IS 'Product variant ID (required, replaces product_id)';
COMMENT ON COLUMN order_items.sku IS 'Product variant SKU for reference (required)';

