import {
  Body,
  Controller,
  Delete,
  Get,
  OperationId,
  Patch,
  Path,
  Post,
  Queries,
  Route,
  SuccessResponse,
} from "tsoa";
import {
  ConfigDocsTypeBody,
  ConfigStoreWhitelistQuery,
  PropertyBody,
  PropertyQuery,
  StoreWhitelistResponse,
  UpdateConfigStoreWhitelist,
} from "./config_controller.interface";
import ConfigService from "../services/config_service";
import { AddConfigStoreWhitelist } from "./config_controller.interface";

@Route("config")
export class ConfigController extends Controller {
  private configService: ConfigService;

  constructor() {
    super();
    this.configService = new ConfigService();
  }

  @Get("/store/whitelist")
  @SuccessResponse(200)
  @OperationId("config.store_whitelist.index")
  public async storeIndex(
    @Queries() query: ConfigStoreWhitelistQuery
  ): Promise<StoreWhitelistResponse[]> {
    const stores = await this.configService.getStoreWhitelist(query);
    return stores;
  }

  @Get("/store/whitelist/{id}")
  @SuccessResponse(200)
  @OperationId("config.store_whitelist.show")
  public async getStore(@Path() id: string) {
    const store = await this.configService.getStoreWhitelistData(id);
    return store;
  }

  @Post("/store/whitelist")
  @SuccessResponse(201)
  @OperationId("config.add.store_whitelist")
  public async addStore(@Body() body: AddConfigStoreWhitelist) {
    const newStore = await this.configService.addStoreWhitelist(body);
    return newStore;
  }

  @Patch("/store/whitelist/{id}")
  @SuccessResponse(200)
  @OperationId("config.update.store_whitelist")
  public async updateStore(
    @Path() id: string,
    @Body() body: UpdateConfigStoreWhitelist
  ) {
    const newStore = await this.configService.updateStoreWhitelist(id, body);
    return newStore;
  }

  @Delete("/store/whitelist/{id}")
  @SuccessResponse(204)
  @OperationId("config.delete.store_whitelist")
  public async deleteStore(@Path() id: string) {
    const deleteStore = await this.configService.deleteStoreWhitelist(id);
    return deleteStore;
  }

  @Get("/property/name")
  @SuccessResponse(200)
  @OperationId("config.property.index")
  public async propertyIndex(@Queries() query: PropertyQuery) {
    const properties = await this.configService.getProperties(query);
    return properties;
  }

  @Get("/property/name/{id}")
  @SuccessResponse(200)
  @OperationId("config.property.show")
  public async getProperty(@Path() id: string) {
    const property = await this.configService.getPropertyData(id);
    return property;
  }

  @Post("/property/name")
  @SuccessResponse(201)
  @OperationId("config.add.property")
  public async addProperty(@Body() body: PropertyBody) {
    const newProperty = await this.configService.addProperty(body);
    return newProperty;
  }

  @Patch("/property/name/{id}")
  @SuccessResponse(200)
  @OperationId("config.update.property")
  public async updateProperty(@Path() id: string, @Body() body: PropertyBody) {
    const updateProperty = await this.configService.updateProperty(id, body);
    return updateProperty;
  }

  @Delete("/property/name/{id}")
  @SuccessResponse(204)
  @OperationId("config.delete.property")
  public async deleteProperty(@Path() id: string) {
    const deleteProperty = await this.configService.deleteProperty(id);
    return deleteProperty;
  }

  @Get("/doc")
  @SuccessResponse(200)
  @OperationId("config.doc.index")
  public async docsIndex() {
    const documentTypes = await this.configService.getDocsTypes();
    return documentTypes;
  }

  @Get("/doc/{id}")
  @SuccessResponse(200)
  @OperationId("config.doc.show")
  public async getDocs(@Path() id: string) {
    const documentTypes = await this.configService.getDocsTypeData(id);
    return documentTypes;
  }

  @Post("/doc")
  @SuccessResponse(201)
  @OperationId("config.add.doc")
  public async addDocument(@Body() body: ConfigDocsTypeBody) {
    const newDocumentTypes = await this.configService.addDocumentType(body);
    return newDocumentTypes;
  }

  @Patch("/doc/{id}")
  @SuccessResponse(200)
  @OperationId("config.update.doc")
  public async updateDocument(
    @Path() id: string,
    @Body() body: ConfigDocsTypeBody
  ) {
    const updateDocumentType = await this.configService.updateDocumentType(
      id,
      body
    );
    return updateDocumentType;
  }

  @Delete("/doc/{id}")
  @SuccessResponse(204)
  @OperationId("config.delete.doc")
  public async deleteDocument(@Path() id: string) {
    const deleteDocumentType = await this.configService.deleteDocumentType(id);
    return deleteDocumentType;
  }
}
