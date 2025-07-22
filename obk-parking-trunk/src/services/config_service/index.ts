import StoresRepository from "../../repositories/stores_whitelist_repository";
import {
  AddConfigStoreWhitelist,
  ConfigStoreWhitelistQuery,
  StoreWhitelistResponse,
  UpdateConfigStoreWhitelist,
  ConfigDocsTypeBody,
  ConfigDocsTypeResponse,
  propertiesResponse,
  PropertyBody,
  PropertyQuery,
} from "../../controllers/config_controller.interface";
import {
  buildConfigProperties,
  buildConfigProperty,
  buildConfigStoreWhitelist,
  buildConfigStoreWhitelists,
} from "../../controllers/config_controller.serializer";
import { CustomError } from "../../middlewares/error";
import { OBError } from "../../utils/error_spec";
import DocumentTypeRepository from "../../repositories/document_type_repository";
import PropertyRepository from "../../repositories/properties_repository";
import { Prisma } from "../../../db/client";
import logging from "../../utils/logging";

export default class ConfigService {
  private storeWhitelistInclude = {
    property: {
      select: {
        id: true,
        name: true,
        addresses: true,
        keywords: true,
      },
    },
  };

  public async getStoreWhitelist(
    query: ConfigStoreWhitelistQuery
  ): Promise<StoreWhitelistResponse[]> {
    const {
      sort_key,
      sort_direction = "desc",
      property_name,
      property_id,
      ...whereQuery
    } = query;

    const orderBy: Prisma.StoreWhitelistOrderByWithRelationInput | undefined =
      sort_key === "property_name"
        ? { property: { name: sort_direction as Prisma.SortOrder } }
        : sort_key
        ? { [sort_key]: sort_direction as Prisma.SortOrder }
        : undefined;

    const whereProperty: Prisma.PropertyWhereInput = {};

    if (property_name) {
      whereProperty.name = {
        contains: property_name,
        mode: "insensitive",
      };
    }

    if (property_id) {
      whereProperty.id = {
        equals: property_id,
      };
    }

    const where: Prisma.StoreWhitelistWhereInput = {
      ...whereQuery,
      ...(whereProperty && {
        AND: [
          {
            property: whereProperty,
          },
        ],
      }),
    };

    const stores = await StoresRepository.findMany({
      where,
      ...(orderBy && { orderBy }),
      include: this.storeWhitelistInclude,
    });

    logging.info("get store whitelist index", stores);

    return buildConfigStoreWhitelists(stores);
  }

  public async getStoreWhitelistData(id: string) {
    const store = await StoresRepository.findUnique({
      where: { id },
      include: this.storeWhitelistInclude,
    });

    if (!store) {
      throw new CustomError(OBError.CF_SW_001);
    }

    logging.info("get store whitelist", store);

    return buildConfigStoreWhitelist(store);
  }

  public async addStoreWhitelist(
    payload: AddConfigStoreWhitelist
  ): Promise<StoreWhitelistResponse> {
    const store = await StoresRepository.create({
      data: { ...payload },
      include: this.storeWhitelistInclude,
    });
    logging.info("create store whitelist", store);
    return buildConfigStoreWhitelist(store);
  }

  public async updateStoreWhitelist(
    id: string,
    payload: UpdateConfigStoreWhitelist
  ): Promise<StoreWhitelistResponse> {
    const existing = await StoresRepository.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomError(OBError.CF_SW_001);
    }

    const updatedStore = await StoresRepository.update({
      where: { id },
      data: { ...payload },
      include: this.storeWhitelistInclude,
    });
    logging.info("update store whitelist", updatedStore);
    return buildConfigStoreWhitelist(updatedStore);
  }

  public async deleteStoreWhitelist(id: string) {
    const existing = await StoresRepository.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomError(OBError.CF_SW_001);
    }

    await StoresRepository.delete({ where: { id } });
    logging.info("delete store whitelist", existing);
    return true;
  }

  public async getProperties(
    query: PropertyQuery
  ): Promise<propertiesResponse[]> {
    const { id, name } = query;

    let findOptions: Prisma.PropertyFindManyArgs = {};
    if (id || name) {
      const orConditions = [];
      if (id) orConditions.push({ id });
      if (name) orConditions.push({ name });
      findOptions.where = { OR: orConditions };
    }

    const properties = await PropertyRepository.findMany(findOptions);
    logging.info("get property index", properties);
    return buildConfigProperties(properties);
  }

  public async getPropertyData(id: string): Promise<propertiesResponse> {
    const property = await PropertyRepository.findUnique({ where: { id } });
    if (!property) throw new CustomError(OBError.CF_PP_001);
    logging.info("get property data", property);
    return buildConfigProperty(property);
  }

  public async addProperty(payload: PropertyBody): Promise<propertiesResponse> {
    const existProperty = await PropertyRepository.findUnique({
      where: { name: payload.name },
    });
    if (existProperty) {
      throw new CustomError(OBError.CF_PP_002);
    }
    const newProperty = await PropertyRepository.create({
      data: { ...payload },
      select: { id: true, name: true, addresses: true, keywords: true },
    });
    logging.info("create property", newProperty);
    return newProperty;
  }

  public async updateProperty(
    id: string,
    payload: PropertyBody
  ): Promise<propertiesResponse> {
    const existProperty = await PropertyRepository.findUnique({
      where: { id },
    });
    if (!existProperty) {
      throw new CustomError(OBError.CF_PP_001);
    }

    const duplicateProperty = await PropertyRepository.findFirst({
      where: { id: { not: id }, name: payload.name },
    });
    if (duplicateProperty) {
      throw new CustomError(OBError.CF_PP_002);
    }

    const updateProperty = await PropertyRepository.update({
      where: { id },
      data: { ...payload },
      select: { id: true, name: true, addresses: true, keywords: true },
    });
    logging.info("update property", updateProperty);
    return updateProperty;
  }

  public async deleteProperty(id: string): Promise<boolean> {
    const existing = await PropertyRepository.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomError(OBError.CF_PP_001);
    }

    await PropertyRepository.delete({ where: { id } });
    logging.info("delete property", existing);
    return true;
  }

  public async getDocsTypes(): Promise<ConfigDocsTypeResponse[]> {
    const docsTypes = await DocumentTypeRepository.findMany({
      select: { id: true, keyword: true, type: true },
    });
    logging.info("get document type index", docsTypes);
    return docsTypes;
  }

  public async getDocsTypeData(id: string): Promise<ConfigDocsTypeResponse> {
    const docsTypes = await DocumentTypeRepository.findUnique({
      where: { id },
      select: { id: true, keyword: true, type: true },
    });
    if (!docsTypes) {
      throw new CustomError(OBError.CF_DT_001);
    }
    logging.info("get document type data", docsTypes);
    return docsTypes;
  }

  public async addDocumentType(
    payload: ConfigDocsTypeBody
  ): Promise<ConfigDocsTypeResponse> {
    const existDocsType = await DocumentTypeRepository.findFirst({
      where: { ...payload },
    });
    if (existDocsType) {
      throw new CustomError(OBError.CF_DT_002);
    }
    const newDocsType = await DocumentTypeRepository.create({
      data: { ...payload },
      select: { id: true, keyword: true, type: true },
    });
    logging.info("create document type", newDocsType);
    return newDocsType;
  }

  public async updateDocumentType(
    id: string,
    payload: ConfigDocsTypeBody
  ): Promise<ConfigDocsTypeResponse> {
    const existDocsType = await DocumentTypeRepository.findUnique({
      where: { id },
    });
    if (!existDocsType) {
      throw new CustomError(OBError.CF_DT_001);
    }
    const updateDocsType = await DocumentTypeRepository.update({
      where: { id },
      data: { ...payload },
      select: { id: true, keyword: true, type: true },
    });
    logging.info("update document type", updateDocsType);
    return updateDocsType;
  }

  public async deleteDocumentType(id: string): Promise<boolean> {
    const existing = await DocumentTypeRepository.findUnique({ where: { id } });

    if (!existing) {
      throw new CustomError(OBError.CF_DT_001);
    }

    await DocumentTypeRepository.delete({ where: { id } });
    logging.info("delete document type", existing);
    return true;
  }
}
