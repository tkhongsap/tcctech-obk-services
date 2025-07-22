CREATE TABLE art_c_types (
    id bigint NOT NULL,
    order_type bigint,
    modify_strict boolean DEFAULT false,
    display_list boolean DEFAULT false,
    display_free_label boolean DEFAULT false,
    playlist text,
    relate_program_ids text,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS art_c_types_id_seq;
CREATE SEQUENCE art_c_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY art_c_types ALTER COLUMN id SET DEFAULT nextval('art_c_types_id_seq'::regclass);

ALTER TABLE ONLY art_c_types
    ADD CONSTRAINT art_c_types_pkey PRIMARY KEY (id);
