ALTER TABLE products
ADD COLUMN full_text_search tsvector generated always as (
    to_tsvector ('english', name || ' ' || category)
) stored;

CREATE INDEX products_full_text_search_idx ON products USING gin (full_text_search);