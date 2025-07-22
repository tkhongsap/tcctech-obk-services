import { resetDB } from "../helpers/db";
import app from "../../src/app";
import request from "supertest";
import campaignService from "../../src/services/campaign";
import { newErrorHandler } from "../../src/middlewares/error";
import { MOCK_CAMPAIGN } from "../fixtures/campaign";
import { OBError } from "../../src/utils/error_spec";
import { CampaignSequenceResponse } from "../../src/controllers/campaign_controller.interface";

beforeEach(async () => {
  await resetDB();
  app.use(newErrorHandler);
});

afterEach(async () => {
  await resetDB();
  jest.useRealTimers();
});

describe("CampaignController", () => {
  describe("GET /campaign", () => {
    it("should return 200 with empty campaigns", async () => {
      const response = await request(app).get("/campaign");
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toEqual("Campaign not found");
    });
    it("should return 200 with a list of campaigns", async () => {
      await campaignService.upsertCampaign(MOCK_CAMPAIGN);
      const response = await request(app).get("/campaign");
      expect(response.status).toEqual(200);
      expect(response.body.data["1"].sequence).toEqual(1);
      expect(response.body.data["1"].price_min).toEqual(0);
      expect(response.body.data["1"].price_max).toEqual(499.99);
      expect(response.body.data["1"].rate_code).toEqual("rate code 1");

      expect(response.body.data["2"].sequence).toEqual(2);
      expect(response.body.data["2"].price_min).toEqual(500);
      expect(response.body.data["2"].price_max).toEqual(1999.99);
      expect(response.body.data["2"].rate_code).toEqual("rate code 2");

      expect(response.body.data["3"].sequence).toEqual(3);
      expect(response.body.data["3"].price_min).toEqual(2000);
      expect(response.body.data["3"].price_max).toEqual(4999.99);
      expect(response.body.data["3"].rate_code).toEqual("rate code 3");

      expect(response.body.data["4"].sequence).toEqual(4);
      expect(response.body.data["4"].price_min).toEqual(5000);
      expect(response.body.data["4"].price_max).toEqual(null);
      expect(response.body.data["4"].rate_code).toEqual("rate code 4");
    });
  });

  describe("POST /campaign", () => {
    it("should return 200 with a list of campaigns", async () => {
      const newCampaign = {
        data: {
          "1": {
            price_min: 0,
            price_max: 199.99,
            redeem_hour: 2,
            rate_code: "new rate 1",
          },
          "2": {
            price_min: 200,
            price_max: 399.99,
            redeem_hour: 2,
            rate_code: "new rate 2",
          },
          "3": {
            price_min: 400,
            price_max: 599.99,
            redeem_hour: 4,
            rate_code: "new rate 3",
          },
          "4": {
            price_min: 600,
            redeem_hour: 8,
            rate_code: "new rate 4",
          },
        },
        updated_by: "User 2",
      };
      const response = await request(app).post("/campaign").send(newCampaign);

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(4);
      expect(response.body[0].price_min).toEqual(0);
      expect(response.body[0].price_max).toEqual(199.99);
      expect(response.body[0].rate_code).toEqual("new rate 1");

      expect(response.body[1].price_min).toEqual(200);
      expect(response.body[1].price_max).toEqual(399.99);
      expect(response.body[1].rate_code).toEqual("new rate 2");

      expect(response.body[2].price_min).toEqual(400);
      expect(response.body[2].price_max).toEqual(599.99);
      expect(response.body[2].rate_code).toEqual("new rate 3");

      expect(response.body[3].price_min).toEqual(600);
      expect(response.body[3].price_max).toEqual(null);
      expect(response.body[3].rate_code).toEqual("new rate 4");
    });

    it("should return 400 with error code", async () => {
      const newCampaign = {
        data: {
          "1": {
            price_min: 0,
            price_max: 199.99,
            redeem_hour: 2,
            rate_code: "new rate 1",
          },
          "2": {
            price_min: 100,
            price_max: 399.99,
            redeem_hour: 2,
            rate_code: "new rate 2",
          },
          "3": {
            price_min: 400,
            price_max: 599.99,
            redeem_hour: 4,
            rate_code: "new rate 3",
          },
          "4": {
            price_min: 600,
            redeem_hour: 8,
            rate_code: "new rate 4",
          },
        },
        updated_by: "User 3",
      };

      const response = await request(app).post("/campaign").send(newCampaign);
      expect(response.status).toEqual(400);
      expect(response.body.error.message).toEqual(OBError.CF_CP_001.message);
    });
  });
});
