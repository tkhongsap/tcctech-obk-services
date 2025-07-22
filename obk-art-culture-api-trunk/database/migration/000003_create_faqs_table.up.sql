CREATE TABLE faqs (
    id bigint NOT NULL,
    order_no bigint,
    is_published boolean DEFAULT false,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS faqs_id_seq;
CREATE SEQUENCE faqs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY faqs ALTER COLUMN id SET DEFAULT nextval('faqs_id_seq'::regclass);

ALTER TABLE ONLY faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);
