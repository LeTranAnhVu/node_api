CREATE TABLE public.products (
    id serial PRIMARY KEY,
    name varchar NOT NULL,
    category varchar NOT NULL,
    image varchar,
    link varchar,
    ratings decimal(2,1),
    no_of_ratings int NOT NULL,
    price decimal(8,2) NOT NULL
);