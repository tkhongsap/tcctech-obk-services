CREATE TABLE add_ons (
    id bigint NOT NULL,
    "type" character varying(255) NOT NULL,
    is_published boolean DEFAULT false,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS add_ons_id_seq;
CREATE SEQUENCE add_ons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY add_ons ALTER COLUMN id SET DEFAULT nextval('add_ons_id_seq'::regclass);

ALTER TABLE ONLY add_ons
    ADD CONSTRAINT add_ons_pkey PRIMARY KEY (id);
