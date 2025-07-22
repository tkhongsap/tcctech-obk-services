CREATE TABLE programs_add_ons (
    program_id bigint NOT NULL,
    add_on_id bigint NOT NULL
);

ALTER TABLE ONLY programs_add_ons
    ADD CONSTRAINT programs_add_ons_pkey PRIMARY KEY (program_id, add_on_id);

ALTER TABLE ONLY programs_add_ons
    ADD CONSTRAINT fk_programs_add_ons_add_on FOREIGN KEY (add_on_id) REFERENCES add_ons(id);

ALTER TABLE ONLY programs_add_ons
    ADD CONSTRAINT fk_programs_add_ons_program FOREIGN KEY (program_id) REFERENCES programs(id);
