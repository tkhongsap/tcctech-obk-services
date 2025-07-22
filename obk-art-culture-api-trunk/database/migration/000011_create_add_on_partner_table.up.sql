CREATE TABLE add_on_partner (
    add_on_id bigint NOT NULL,
    partner_id bigint NOT NULL
);

ALTER TABLE ONLY add_on_partner
    ADD CONSTRAINT add_on_partner_pkey PRIMARY KEY (add_on_id, partner_id);

ALTER TABLE ONLY add_on_partner
    ADD CONSTRAINT fk_add_on_partner_add_on FOREIGN KEY (add_on_id) REFERENCES add_ons(id);

ALTER TABLE ONLY add_on_partner
    ADD CONSTRAINT fk_add_on_partner_partner FOREIGN KEY (partner_id) REFERENCES partners(id);
