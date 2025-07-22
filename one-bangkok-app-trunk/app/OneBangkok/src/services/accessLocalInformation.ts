import {AxiosResponse} from 'axios';
import {find} from 'lodash';
import * as OB_DOCUMENT_SDK from 'ob-document-sdk';
import {
  WrappedResponseCategoryResult,
  WrappedResponseTypeResult,
} from 'ob-document-sdk/dist/api';

export interface Category {
  active: boolean;
  id: string;
  image: string;
  list: IDocument[];
  title: string;
  type: {id: string; type: string};
  type_id: string;
  updated_at: string;
  updated_by: string;
  updated_by_name: string;
  version: number;
}
export interface IAccount {
  account?: {
    isDeleted?: boolean | null;
    device: {
      id: string;
    };
    profile: Profile;
    identity?: object[];
  };
}
export interface Profile {
  id: string;
  gender: string;
  title?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  dob: string;
  created_at: string;
  updated_at: string;
  account_id?: string;
}
export interface IDocument {
  id?: string;
  version?: number;
  created_by?: IAccount;
  created_at?: Date | string;
  updated_by?: IAccount;
  updated_at?: Date | string;
  category_id?: string;
  body?: {
    contentEn: string;
    contentTh: string;
    contentCn: string;
    url: string;
  };
  title?: {
    en: string;
    th: string;
    cn: string;
  };
  image?: string[] | null;
  active?: boolean;
  published?: boolean;
  release_date?: string | null;
  slug?: string;
  history_categoryId?: string | null;
  deleted_at?: string | null;
}

export interface AccessLocalInformationType {
  id: string;
  title:
    | {
        en: string;
        th: string;
        cn?: string;
        url?: null;
        seq?: number;
      }
    | string;
  body: {
    contentEn: string;
    contentTh: string;
    contentCn: string;
    url?: string;
  };
  sequence?: number;
}

const mapperContentLanguage = {
  en: 'contentEn',
  th: 'contentTh',
  zh: 'contentCn',
};

const accessLocalInformationService = {
  getInformations: async () => {
    try {
      const typeData: AxiosResponse<WrappedResponseTypeResult> =
        await OB_DOCUMENT_SDK.client.typeShow('accesslocalinformation');
      const typeObject = typeData.data.data as any;
      const typeId: string | undefined = typeData && typeObject[0].id;

      const response: AxiosResponse<WrappedResponseCategoryResult> =
        await OB_DOCUMENT_SDK.client.categoryShow('*', undefined, typeId);

      const data = response.data.data as Category[];

      if (data) {
        const serializeData = accessLocalInformationService.serializeData(data);
        return serializeData;
      }
    } catch (error) {
      console.log(error);
    }
    return [] as AccessLocalInformationType[];
  },
  mappedContent: async (
    data: AccessLocalInformationType[],
    sequence: number,
    language: string,
  ) => {
    const contentSelected = find(data, {sequence: sequence}) as
      | AccessLocalInformationType
      | undefined;

    if (contentSelected) {
      const mapperKey = mapperContentLanguage[
        language as keyof typeof mapperContentLanguage
      ] as keyof AccessLocalInformationType['body'];

      return {
        content: contentSelected?.body[mapperKey],
        ...(contentSelected?.body.url && {url: contentSelected?.body.url}),
      };
    }
    return {
      content: '',
      url: '',
    };
  },
  serializeData: (data: Category[]): AccessLocalInformationType[] => {
    const serializeData: AccessLocalInformationType[] = data.map(
      (item: Category) => {
        let jsonTitle;
        try {
          jsonTitle = JSON.parse(item.title);
        } catch (error) {
          console.error('Error parsing title:', error);
          jsonTitle = {};
        }
        const {list = []} = item;
        const firstDocument = list[0] || {};
        const title = {
          th: jsonTitle.th,
          en: jsonTitle.en,
        };
        const {
          id = '',
          body = {contentEn: '', contentTh: '', contentCn: '', url: ''},
        } = firstDocument;

        return {
          id,
          title,
          body: {
            ...body,
            contentTh: body.contentTh ?? body.contentEn,
            contentCn: body.contentCn ?? body.contentEn,
          },
          sequence: jsonTitle?.seq ?? 1,
        };
      },
    );
    return serializeData;
  },
};

export default accessLocalInformationService;
