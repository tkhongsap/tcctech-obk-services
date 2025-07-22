CREATE TABLE partner_translations (
    id bigint NOT NULL,
    partner_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    title character varying(255) NOT NULL,
    thumbnail character varying(255) NOT NULL,
    link character varying(255),
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS partner_translations_id_seq;
CREATE SEQUENCE partner_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY partner_translations ALTER COLUMN id SET DEFAULT nextval('partner_translations_id_seq'::regclass);

ALTER TABLE ONLY partner_translations
    ADD CONSTRAINT partner_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY partner_translations
    ADD CONSTRAINT fk_partners_partner_translation FOREIGN KEY (partner_id) REFERENCES partners(id);
