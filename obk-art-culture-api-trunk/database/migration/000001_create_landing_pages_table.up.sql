CREATE TABLE landing_pages (
    id bigint NOT NULL,
    program_ids text NOT NULL,
    highlight_auto_play bigint DEFAULT 5 NOT NULL,
    section_order text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS landing_pages_id_seq;
CREATE SEQUENCE landing_pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY landing_pages ALTER COLUMN id SET DEFAULT nextval('landing_pages_id_seq'::regclass);

ALTER TABLE ONLY landing_pages
    ADD CONSTRAINT landing_pages_pkey PRIMARY KEY (id);
