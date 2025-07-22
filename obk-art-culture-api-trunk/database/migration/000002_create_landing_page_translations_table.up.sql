CREATE TABLE landing_page_translations (
    id bigint NOT NULL,
    landing_page_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS landing_page_translations_id_seq;
CREATE SEQUENCE landing_page_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY landing_page_translations ALTER COLUMN id SET DEFAULT nextval('landing_page_translations_id_seq'::regclass);

ALTER TABLE ONLY landing_page_translations
    ADD CONSTRAINT landing_page_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY landing_page_translations
    ADD CONSTRAINT fk_landing_pages_landing_translation FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id);
