CREATE TABLE bookmarks (
    id bigint NOT NULL,
    account_id character varying(255) NOT NULL,
    content_type character varying(255) NOT NULL,
    content_id character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now())
);

DROP SEQUENCE IF EXISTS bookmarks_id_seq;
CREATE SEQUENCE bookmarks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY bookmarks ALTER COLUMN id SET DEFAULT nextval('bookmarks_id_seq'::regclass);

ALTER TABLE ONLY bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);
