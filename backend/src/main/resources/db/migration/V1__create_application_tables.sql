CREATE TABLE users
(
    id            UUID PRIMARY KEY,
    name          VARCHAR(120)             NOT NULL,
    email         VARCHAR(180)             NOT NULL,
    password_hash VARCHAR(255)             NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE orders
(
    id               UUID PRIMARY KEY,
    customer_name    VARCHAR(120)             NOT NULL,
    delivery_address VARCHAR(300)             NOT NULL,
    status           VARCHAR(40)              NOT NULL,
    created_by       UUID                     NOT NULL,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at       TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_orders_created_by
        FOREIGN KEY (created_by)
            REFERENCES users (id),

    CONSTRAINT ck_orders_status
        CHECK (
            status IN (
                       'RECEBIDO',
                       'EM_PREPARO',
                       'SAIU_PARA_ENTREGA',
                       'ENTREGUE',
                       'CANCELADO'
                )
            )
);

CREATE TABLE order_items
(
    id          UUID PRIMARY KEY,
    order_id    UUID           NOT NULL,
    description VARCHAR(200)   NOT NULL,
    quantity    INTEGER        NOT NULL,
    unit_price  NUMERIC(12, 2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
            REFERENCES orders (id)
            ON DELETE CASCADE,

    CONSTRAINT ck_order_items_quantity
        CHECK (quantity > 0),

    CONSTRAINT ck_order_items_unit_price
        CHECK (unit_price > 0)
);

CREATE INDEX idx_orders_created_at
    ON orders (created_at DESC);

CREATE INDEX idx_orders_status
    ON orders (status);

CREATE INDEX idx_order_items_order_id
    ON order_items (order_id);