ALTER TABLE orders
DROP COLUMN delivery_address;

ALTER TABLE orders
    ADD COLUMN customer_phone VARCHAR(20) NOT NULL,
    ADD COLUMN customer_email VARCHAR(180),
    ADD COLUMN delivery_street VARCHAR(150) NOT NULL,
    ADD COLUMN delivery_number VARCHAR(30) NOT NULL,
    ADD COLUMN delivery_complement VARCHAR(100),
    ADD COLUMN delivery_neighborhood VARCHAR(100) NOT NULL,
    ADD COLUMN delivery_city VARCHAR(100) NOT NULL,
    ADD COLUMN delivery_state VARCHAR(2) NOT NULL,
    ADD COLUMN delivery_zip_code VARCHAR(10);

ALTER TABLE orders
    ADD CONSTRAINT ck_orders_delivery_state
        CHECK (char_length(delivery_state) = 2);
