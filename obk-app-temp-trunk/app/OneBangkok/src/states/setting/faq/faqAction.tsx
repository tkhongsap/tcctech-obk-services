import * as OB_DOCUMENT_SDK from 'ob-document-sdk';

const faqAction = {
  getFaqCategory: async (id: string) => {
    try {
      const response = await OB_DOCUMENT_SDK.client.categoryShow('', id);
      return response?.data?.data[0];
    } catch (error: any) {
      console.log(error);
    }
  },
  getFaqCategories: async (currentLanguage: string) => {
    try {
      const typeId = await OB_DOCUMENT_SDK.client.typeShow('faq');

      const response = await OB_DOCUMENT_SDK.client.categoryShow(
        '',
        '',
        typeId?.data?.data[0]?.id,
        {
          headers: {
            'accept-language': currentLanguage,
          },
        },
      );
      return response?.data?.data;
    } catch (error: any) {
      console.log(error);

    }
  },
  getFaqDocuments: async (categoryId: string, currentLanguage: string) => {
    try {
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
        {
          headers: {
            'accept-language': currentLanguage,
          },
        },
      );
      return response.data?.data;
    } catch (error: any) {
      console.log(error);

    }
  },
  getFaqDetail: async (id: string, currentLanguage: string) => {
    try {

      const response = await OB_DOCUMENT_SDK.client.documentsIndex('', id, {
        headers: {
          'accept-language': currentLanguage,
        },
      });

      return response.data?.data;
    } catch (error: any) {
      console.log(error);
    }
  },
  getFeedback: async (id: string, currentLanguage: string) => {
    try {
      const {data: response} = await OB_DOCUMENT_SDK.client.feedbackShow(
        '',
        id,
        {
          headers: {
            'accept-language': currentLanguage,
          },
        },
      );
      return response?.data[0];
    } catch (error: any) {
      console.log(error);
    }
  },
  createFeedback: async (id: string, like: boolean) => {
    try {
      const {data: response} = await OB_DOCUMENT_SDK.client.feedbackCreate(
        '',
        {
          document_id: id,
          like: like,
        },
      );
      return response?.data;
    } catch (error: any) {
      console.log(error);
    }
  },
  updateFeedback: async (id: string, like: boolean) => {
    try {
      const {data: response} = await OB_DOCUMENT_SDK.client.feedbackUpdate(
        id,
        {
          like: like,
        },
      );
      return response?.data;
    } catch (error: any) {
      console.log(error);
    }
  },
};

export default faqAction;
