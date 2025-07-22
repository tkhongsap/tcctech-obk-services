CREATE TABLE programs_partners (
    program_id bigint NOT NULL,
    partner_id bigint NOT NULL
);

ALTER TABLE ONLY programs_partners
    ADD CONSTRAINT programs_partners_pkey PRIMARY KEY (program_id, partner_id);

ALTER TABLE ONLY programs_partners
    ADD CONSTRAINT fk_programs_partners_partner FOREIGN KEY (partner_id) REFERENCES partners(id);

ALTER TABLE ONLY programs_partners
    ADD CONSTRAINT fk_programs_partners_program FOREIGN KEY (program_id) REFERENCES programs(id);
