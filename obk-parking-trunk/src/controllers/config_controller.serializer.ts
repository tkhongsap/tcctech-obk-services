import { omit } from "lodash";
import {
  propertiesResponse,
  propertiesResult,
  StoreWhitelistResponse,
  StoreWhitelistResult,
} from "./config_controller.interface";

export function buildConfigStoreWhitelists(stores: StoreWhitelistResult[]) {
  return stores.map((store) => buildConfigStoreWhitelist(store));
}

export function buildConfigStoreWhitelist(
  store: StoreWhitelistResult
): StoreWhitelistResponse {
  return omit(store, ["property_id", "updated_by", "deleted_at"]);
}

export function buildConfigProperties(
  properties: propertiesResult[]
): propertiesResponse[] {
  return properties.map((item) => buildConfigProperty(item));
}

export function buildConfigProperty(property: propertiesResult): propertiesResponse {
  return omit(property, ["created_at", "updated_at", "deleted_at"]);
}
