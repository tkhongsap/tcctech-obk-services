CREATE TABLE programs (
    id bigint NOT NULL,
    art_c_type_id bigint,
    art_c_category_id bigint,
    "type" text,
    is_published boolean DEFAULT false,
    is_product boolean DEFAULT false,
    product_price numeric(8,2) DEFAULT 0,
    display_free_label boolean DEFAULT false,
    relate_program_ids text,
    relate_product_ids text,
    published_at timestamp with time zone,
    period_at timestamp with time zone,
    period_end timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS programs_id_seq;
CREATE SEQUENCE programs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY programs ALTER COLUMN id SET DEFAULT nextval('programs_id_seq'::regclass);

ALTER TABLE ONLY programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY programs
    ADD CONSTRAINT fk_art_c_categories_program FOREIGN KEY (art_c_category_id) REFERENCES art_c_categories(id);

ALTER TABLE ONLY programs
    ADD CONSTRAINT fk_art_c_types_program FOREIGN KEY (art_c_type_id) REFERENCES art_c_types(id);
