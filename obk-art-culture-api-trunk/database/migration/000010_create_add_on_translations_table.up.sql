CREATE TABLE add_on_translations (
    id bigint NOT NULL,
    add_on_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    title character varying(255) NOT NULL,
    "desc" text NOT NULL,
    thumbnail character varying(255) NOT NULL,
    banner character varying(255) NOT NULL,
    audio text,
    video text,
    tags text,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS landing_paadd_on_translations_id_seqges_id_seq;
CREATE SEQUENCE add_on_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY add_on_translations ALTER COLUMN id SET DEFAULT nextval('add_on_translations_id_seq'::regclass);

ALTER TABLE ONLY add_on_translations
    ADD CONSTRAINT add_on_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY add_on_translations
    ADD CONSTRAINT fk_add_ons_add_on_translation FOREIGN KEY (add_on_id) REFERENCES add_ons(id);
