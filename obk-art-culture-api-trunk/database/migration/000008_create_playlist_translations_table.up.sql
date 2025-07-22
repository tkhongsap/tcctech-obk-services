CREATE TABLE playlist_translations (
    id bigint NOT NULL,
    playlist_id bigint NOT NULL,
    locale character varying(5) NOT NULL,
    title character varying(255) NOT NULL,
    "desc" character varying(255) NOT NULL,
    author character varying(255),
    thumbnail character varying(255) NOT NULL,
    durations bigint DEFAULT 0,
    link character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT (now()),
    updated_at timestamp with time zone NOT NULL DEFAULT (now()),
    deleted_at timestamp with time zone
);

DROP SEQUENCE IF EXISTS playlist_translations_id_seq;
CREATE SEQUENCE playlist_translations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY playlist_translations ALTER COLUMN id SET DEFAULT nextval('playlist_translations_id_seq'::regclass);

ALTER TABLE ONLY playlist_translations
    ADD CONSTRAINT playlist_translations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY playlist_translations
    ADD CONSTRAINT fk_playlists_playlist_translation FOREIGN KEY (playlist_id) REFERENCES playlists(id);
