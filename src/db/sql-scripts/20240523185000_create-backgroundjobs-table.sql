CREATE TYPE background_jobs_status AS ENUM ('created', 'processing', 'succeeded', 'failed');

CREATE TABLE public.background_jobs(
    id serial PRIMARY KEY,
    name varchar(100) NOT NULL,
    status background_jobs_status NOT NULL,
    percent smallint NULL,
    created_at timestamptz NOT NULL
);
