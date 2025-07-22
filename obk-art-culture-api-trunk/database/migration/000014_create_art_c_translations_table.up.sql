CREATE TABLE art_c_translations (
    id bigint NOT NULL,
    art_c_type_id bigint,
    art_c_category_id bigint,
    locale character varying(5) NOT NULL,
    title character varying(255) NOT NULL,
    short_desc character varying(255),
    "desc" text NOT NULL,
    thumbnail character varying(255) NOT NULL,
    banner character varying(255),
    category_section_title character varying(255),
    playlist_section_title character varying(255),
    program_section_title character varying(255),
    opening_hours text,
    locations text,
    enter_fee numeric(8,2),
    external_link character varying(255),
    tags text,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS art_c_translations_id_seq;
CREATE SEQUENCE art_c_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY art_c_translations ALTER COLUMN id SET DEFAULT nextval('art_c_translations_id_seq'::regclass);

ALTER TABLE ONLY art_c_translations
    ADD CONSTRAINT art_c_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY art_c_translations
    ADD CONSTRAINT fk_art_c_categories_art_c_translation FOREIGN KEY (art_c_category_id) REFERENCES art_c_categories(id);

ALTER TABLE ONLY art_c_translations
    ADD CONSTRAINT fk_art_c_types_art_c_translation FOREIGN KEY (art_c_type_id) REFERENCES art_c_types(id);
