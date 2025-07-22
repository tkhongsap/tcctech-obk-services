BEGIN TRANSACTION;

INSERT INTO type (type) VALUES ('accesslocalinformation');

INSERT INTO category (active, image, type_id, title)
SELECT true, null, id, '{"en": "Shuttle bus information", "th": "ข้อมูลรถบัสรับส่ง", "seq": 1, "url": null}' FROM type WHERE type like 'accesslocalinformation';

INSERT INTO category (active, image, type_id, title)
SELECT true, null, id, '{"en": "BTS information", "th": "ข้อมูลรถไฟฟ้า BTS", "seq": 2}' FROM type WHERE type like 'accesslocalinformation';

INSERT INTO category (active, image, type_id, title)
SELECT true, null, id, '{"en": "MRT information", "th": "ข้อมูลรถไฟฟ้า MRT", "seq": 3}' FROM type WHERE type like 'accesslocalinformation';

END TRANSACTION;