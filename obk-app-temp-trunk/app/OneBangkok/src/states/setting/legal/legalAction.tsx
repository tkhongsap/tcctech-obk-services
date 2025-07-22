import {showLoading, hideLoading} from '../../loadingState';
import * as OB_DOCUMENT_SDK from 'ob-document-sdk';

export type DocumentDetail = {
  id: string;
  title: string;
  body: string;
  image?: string;
};

export const LegalCategories = {
  aboutUs: 'aboutUs',
  privacyStatement: 'privacyStatement',
  termAndCondition: 'termAndCondition',
  PDPA: 'PDPA',
};

const legalAction = {
  getType: async () => {
    try {
      showLoading();
      const response = await OB_DOCUMENT_SDK.client.typeShow('legal');
      hideLoading();
      return response?.data?.data;
    } catch (error: any) {
      hideLoading();
    }
  },
  getCategory: async (typeId: string) => {
    try {
      showLoading();
      const response = await OB_DOCUMENT_SDK.client.categoryShow('', typeId);
      hideLoading();

      return response?.data?.data;
    } catch (error: any) {
      hideLoading();
    }
  },
  getDocuments: async (categoryId: string) => {
    try {
      showLoading();
      const params = {
        category_id: categoryId,
        active: true,
        released: true,
      };
      const response = await OB_DOCUMENT_SDK.client.documentsShow(
        '',
        params.active,
        params.released,
        params.category_id,
      );
      hideLoading();
      return response.data;
    } catch (error: any) {
      hideLoading();
    }
  },
  getDocumentDetail: async (idOrSlug: string, currentLanguage: string) => {
    try {
      const response = await OB_DOCUMENT_SDK.client.documentsIndex(
        currentLanguage,
        idOrSlug,
      );
      return response.data?.data;
    } catch (error: any) {
      console.log(error);
    }
  },
};

export default legalAction;
