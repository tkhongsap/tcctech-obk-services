import request from "supertest";
import StoresRepository from "../../src/repositories/stores_whitelist_repository";
import DocumentTypeRepository from "../../src/repositories/document_type_repository";
import app from "../../src/app";
import { newErrorHandler } from "../../src/middlewares/error";
import { resetDB } from "../helpers/db";
import { OBError } from "../../src/utils/error_spec";
import {
  MOCK_DOC_TYPE_RESPONSE,
  MOCK_STORE,
  MOCK_STORE_RESPONSE,
  MOCK_DOC_TYPE,
  MOCK_PROPERTY_RESPONSE,
  MOCK_PROPERTY,
} from "../fixtures/config";
import {
  AddConfigStoreWhitelist,
  propertiesResponse,
} from "../../src/controllers/config_controller.interface";
import { omit } from "lodash";
import ConfigService from "../../src/services/config_service";
import PropertyRepository from "../../src/repositories/properties_repository";

const configService = new ConfigService();
let propertyData: propertiesResponse[];
const sortById = (arr: any[]) => arr.sort((a, b) => a.id.localeCompare(b.id));

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
  propertyData = await Promise.all(
    MOCK_PROPERTY.map((item) =>
      PropertyRepository.create({
        data: item,
        select: { id: true, name: true, addresses: true, keywords: true },
      })
    )
  );
  await StoresRepository.createMany({
    data: MOCK_STORE.slice(0, 2),
  });
  await DocumentTypeRepository.createMany({ data: MOCK_DOC_TYPE.slice(0, 2) });
});

afterEach(async () => {
  await resetDB();
  jest.useRealTimers();
});

describe("ConfigController", () => {
  describe("GET /config/store/whitelist", () => {
    it("should return 200 with a list of stores", async () => {
      const response = await request(app).get("/config/store/whitelist");

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(MOCK_STORE_RESPONSE.slice(0, 2));
    });

    it("should return 200 with one store", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ property_name: "The One Bangkok" });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([MOCK_STORE_RESPONSE[0]]);
    });

    it("should return 200 with one store ", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ property_id: "1" });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([MOCK_STORE_RESPONSE[0]]);
    });

    it("should return 200 with empty query parameter", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ property_name: "Paragon" });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it("should return 200 with empty array", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ property_name: "Paragon", property_id: "1" });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([]);
    });

    it("should return 200 with sorted store", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ sort_key: "id", sort_direction: "asc" });

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(MOCK_STORE_RESPONSE.slice(0, 2));
    });

    it("should return 200 with sorted store", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ sort_key: "unit_no", sort_direction: "desc" });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(
        MOCK_STORE_RESPONSE.slice(0, 2).sort((a, b) =>
          b.unit_no.localeCompare(a.unit_no)
        )
      );
    });

    it("should return 200 with sorted store", async () => {
      const response = await request(app)
        .get("/config/store/whitelist")
        .query({ sort_key: "property_name", sort_direction: "desc" });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(
        MOCK_STORE_RESPONSE.slice(0, 2).sort((a, b) =>
          b.property.name.localeCompare(a.property.name)
        )
      );
    });
  });

  describe("GET /config/property/name", () => {
    it("should return 200 with property data", async () => {
      const response = await request(app).get("/config/property/name");
      expect(response.status).toEqual(200);
      expect(sortById(response.body)).toEqual(sortById(propertyData));
    });

    it("should return 200 with property data", async () => {
      const response = await request(app)
        .get("/config/property/name")
        .query({ id: propertyData[0].id, name: propertyData[1].name });
      expect(response.status).toEqual(200);
      expect(sortById(response.body)).toEqual(sortById(propertyData));
    });

    it("should return 200 with one property data", async () => {
      const response = await request(app)
        .get("/config/property/name")
        .query({ id: propertyData[0].id });
      console.log("propertyData[0]", propertyData[0]);
      expect(response.status).toEqual(200);
      expect(sortById(response.body)).toEqual([propertyData[0]]);
    });

    it("should return 200 with one property data", async () => {
      const response = await request(app)
        .get("/config/property/name")
        .query({ name: propertyData[1].name });
      console.log("propertyData[1]", propertyData[1]);
      expect(response.status).toEqual(200);
      expect(sortById(response.body)).toEqual([propertyData[1]]);
    });
  });

  describe("GET /config/store/whitelist/:id", () => {
    it("should return 200 with store data", async () => {
      const response = await request(app).get(`/config/store/whitelist/1`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(MOCK_STORE_RESPONSE[0]);
    });

    it("should return 404 if store not found", async () => {
      const response = await request(app).get("/config/store/whitelist/999");

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_SW_001.message);
    });
  });

  describe("POST /config/store/whitelist", () => {
    it("should return 201 with created store", async () => {
      let newStore: AddConfigStoreWhitelist = omit(MOCK_STORE[2], [
        "id",
        "created_at",
        "updated_at",
      ]);
      const response = await request(app)
        .post("/config/store/whitelist")
        .send(newStore);

      expect(response.status).toEqual(201);
      expect(
        omit(response.body, ["id", "created_at", "updated_at"])
      ).toMatchObject(
        omit(MOCK_STORE_RESPONSE[2], ["id", "created_at", "updated_at"])
      );
    });
  });

  describe("PATCH /config/store/whitelist/:id", () => {
    beforeEach(async () => {
      await StoresRepository.create({
        data: { ...MOCK_STORE[3] },
      });
    });

    it("should return 200 with updated store", async () => {
      const payload = { store_name: "Updated Store 4" };

      const response = await request(app)
        .patch("/config/store/whitelist/4")
        .send({ ...payload });

      expect(response.status).toEqual(200);
      expect(response.body.store_name).toEqual(payload.store_name);

      const store = await StoresRepository.findUnique({ where: { id: "4" } });
      expect(store?.store_name).toEqual(payload.store_name);
    });

    it("should return 404 if store not found", async () => {
      const response = await request(app)
        .patch("/config/store/whitelist/999")
        .send({ store_name: "Updated Store" });

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_SW_001.message);
    });
  });

  describe("DELETE /config/store/whitelist/:id", () => {
    it("should return 204 on successful deletion", async () => {
      const response = await request(app).delete(
        `/config/store/whitelist/${MOCK_STORE_RESPONSE[0].id}`
      );

      expect(response.status).toEqual(204);
    });

    it("should return 404 if store not found", async () => {
      const response = await request(app).delete("/config/store/whitelist/999");

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_SW_001.message);
    });
  });

  describe("GET /config/doc", () => {
    it("should return 200 with a list of document type", async () => {
      const response = await request(app).get("/config/doc");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(MOCK_DOC_TYPE_RESPONSE.slice(0, 2));
    });
  });

  describe("GET /config/doc", () => {
    it("should return 200 with a list of document types", async () => {
      const response = await request(app).get("/config/doc");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(MOCK_DOC_TYPE_RESPONSE.slice(0, 2));
    });
  });

  describe("GET /config/doc/:id", () => {
    it("should return 200 with document type", async () => {
      const response = await request(app).get("/config/doc/1");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(MOCK_DOC_TYPE_RESPONSE[0]);
    });

    it("should return 404 if document type not found", async () => {
      const response = await request(app).get("/config/doc/999");

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_DT_001.message);
    });
  });

  describe("POST /config/doc", () => {
    it("should return 201 with created document type", async () => {
      const payload = { keyword: "doc1", type: "type1" };

      const response = await request(app).post("/config/doc").send(payload);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(payload);

      const docs = await DocumentTypeRepository.findMany({
        where: { keyword: "doc1" },
      });
      expect(docs).toHaveLength(1);
      expect(docs[0]).toMatchObject(payload);
    });

    it("should return 409 if document type already exists", async () => {
      const response = await request(app).post("/config/doc").send({
        keyword: MOCK_DOC_TYPE[1].keyword,
        type: MOCK_DOC_TYPE[1].type,
      });

      expect(response.status).toEqual(409);
      expect(response.body.error.message).toEqual(OBError.CF_DT_002.message);
    });
  });

  describe("PATCH /config/doc/:id", () => {
    it("should return 200 with updated document type", async () => {
      const payload = { keyword: "updated keyword 1", type: "updated type 1" };

      const response = await request(app).patch("/config/doc/1").send(payload);

      expect(response.status).toEqual(200);
      expect(response.body.keyword).toEqual(payload.keyword);
      expect(response.body.type).toEqual(payload.type);

      const doc = await DocumentTypeRepository.findUnique({
        where: { id: "1" },
      });
      expect(doc?.keyword).toEqual(payload.keyword);
      expect(doc?.type).toEqual(payload.type);
    });

    it("should return 404 if document type not found", async () => {
      const response = await request(app)
        .patch("/config/doc/999")
        .send({ keyword: "updated_doc", type: "type1" });

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_DT_001.message);
    });
  });

  describe("DELETE /config/doc/:id", () => {
    it("should return 204 on successful deletion", async () => {
      const response = await request(app).delete("/config/doc/2");

      expect(response.status).toEqual(204);

      const doc = await DocumentTypeRepository.findUnique({
        where: { id: "3" },
      });
      expect(doc).toBeNull();
    });

    it("should return 404 if document type not found", async () => {
      const response = await request(app).delete("/config/doc/999");

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_DT_001.message);
    });
  });

  describe("GET /config/property/name/:id", () => {
    it("should return 200 with property data", async () => {
      const response = await request(app).get(
        `/config/property/name/${propertyData[0].id}`
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(MOCK_PROPERTY_RESPONSE[0]);
    });

    it("should return 404 if store not found", async () => {
      const response = await request(app).get("/config/property/name/999");
      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_PP_001.message);
    });
  });

  describe("POST /config/property/name/", () => {
    const payload = {
      name: "The Parade",
      addresses: ["The Parade 1", "The Parade 2"],
      keywords: ["The Parade 1", "The Parade 2"],
    };
    it("should return 201 with created property", async () => {
      const response = await request(app)
        .post("/config/property/name")
        .send(payload);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(payload);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 409 if property already exists", async () => {
      await request(app).post("/config/property/name").send(payload);
      const response = await request(app)
        .post("/config/property/name")
        .send(payload);

      expect(response.status).toEqual(409);
      expect(response.body.error.message).toEqual(OBError.CF_PP_002.message);
    });
  });

  describe("PATCH /config/property/name/:id", () => {
    it("should return 200 with updated property", async () => {
      const payload = {
        name: "The One Bangkok updated",
        addresses: ["The One Bangkok 1 updated", "The One Bangkok 2 updated"],
        keywords: ["The One Bangkok 1 updated", "The One Bangkok 2 updated"],
      };

      const response = await request(app)
        .patch(`/config/property/name/${propertyData[0].id}`)
        .send(payload);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(payload);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 404 if property not found", async () => {
      const response = await request(app)
        .patch("/config/property/name/999")
        .send({
          name: "not found",
          addresses: [""],
          keywords: [""],
        });

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_PP_001.message);
    });

    it("should return 409 if property name duplicated", async () => {
      const response = await request(app)
        .patch(`/config/property/name/${propertyData[0].id}`)
        .send({
          name: "The Storeys",
          addresses: [""],
          keywords: [""],
        });

      expect(response.status).toEqual(409);
      expect(response.body.error.message).toEqual(OBError.CF_PP_002.message);
    });
  });

  describe("DELETE /config/property/name/:id", () => {
    it("should return 204 on successful deletion", async () => {
      const response = await request(app).delete("/config/property/name/1");

      expect(response.status).toEqual(204);

      const doc = await PropertyRepository.findUnique({
        where: { id: "1" },
      });
      expect(doc).toBeNull();
    });

    it("should return 404 if document type not found", async () => {
      const response = await request(app).delete("/config/property/name/999");

      expect(response.status).toEqual(404);
      expect(response.body.error.message).toEqual(OBError.CF_PP_001.message);
    });
  });
});
