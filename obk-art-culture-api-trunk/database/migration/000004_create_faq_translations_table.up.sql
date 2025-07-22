CREATE TABLE faq_translations (
    id bigint NOT NULL,
    faq_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    question character varying(255) NOT NULL,
    answer text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS faq_translations_id_seq;
CREATE SEQUENCE faq_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY faq_translations ALTER COLUMN id SET DEFAULT nextval('faq_translations_id_seq'::regclass);

ALTER TABLE ONLY faq_translations
    ADD CONSTRAINT faq_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY faq_translations
    ADD CONSTRAINT fk_faqs_faq_translation FOREIGN KEY (faq_id) REFERENCES faqs(id);
