CREATE TABLE program_translations (
    id bigint NOT NULL,
    program_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    title character varying(255) NOT NULL,
    short_desc character varying(255),
    "desc" text NOT NULL,
    author character varying(255),
    thumbnail character varying(255) NOT NULL,
    banner character varying(255) NOT NULL,
    opening_hours text,
    locations text,
    enter_fee numeric(8,2),
    external_link character varying(255),
    info_items text,
    tags text,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS program_translations_id_seq;
CREATE SEQUENCE program_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY program_translations ALTER COLUMN id SET DEFAULT nextval('program_translations_id_seq'::regclass);

ALTER TABLE ONLY program_translations
    ADD CONSTRAINT program_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY program_translations
    ADD CONSTRAINT fk_programs_program_translation FOREIGN KEY (program_id) REFERENCES programs(id);
