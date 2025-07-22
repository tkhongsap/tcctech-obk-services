CREATE TABLE art_c_categories (
    id bigint NOT NULL,
    art_c_type_id bigint,
    order_category bigint,
    display_list boolean DEFAULT false,
    display_free_label boolean DEFAULT false,
    relate_program_ids text,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS art_c_categories_id_seq;
CREATE SEQUENCE art_c_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY art_c_categories ALTER COLUMN id SET DEFAULT nextval('art_c_categories_id_seq'::regclass);

ALTER TABLE ONLY art_c_categories
    ADD CONSTRAINT art_c_categories_pkey PRIMARY KEY (id);

ALTER TABLE ONLY art_c_categories
    ADD CONSTRAINT fk_art_c_types_art_c_category FOREIGN KEY (art_c_type_id) REFERENCES art_c_types(id);
