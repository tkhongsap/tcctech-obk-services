import {AxiosResponse} from 'axios';
import {
  WrappedResponseCategoryResult,
  WrappedResponseTypeResult,
} from 'ob-document-sdk/dist/api';
import * as OB_DOCUMENT_SDK from 'ob-document-sdk';
import DateTime from '~/utils/datetime';
import isBetween from 'dayjs/plugin/isBetween';
import dayjs from 'dayjs';

dayjs.extend(isBetween);
export interface WhatHappeningProps {
  id: string;
  title: string;
  description: string;
  textOverlay?: string;
  category: string;
  image: string;
  thumbnailImage: string;
  headImage: string;
  tags: string[];
  location: string;
  eventStartDate: string;
  eventEndDate: string;
  showStartDate: string;
  showEndDate?: string;
  sequence: number;
  isCurrentDisplay?: boolean;
  button?: {name: string; url: string} | null;
}

interface WhatHappeningApiResponse {
  id: string;
  title: {[key: string]: string} | string;
  list: ListType[];
  image: string;
  active: false;
  created_at: string;
  updated_at: string;
  version: number;
  history_categoryId: string;
  deleted_at: string | null;
  updated_by: string;
  type: {id: string; type: string};
  type_id: string;
}

interface ListType {
  id: string;
  category_id: string;
  title: object;
  body: {
    seq: number;
    categoryId: string;
    publishDate: string;
    location: string;
    eventStartDate: string;
    eventEndDate: string;
    showStartDate: string;
    showEndDate?: string;
    thumbnailImage: string;
    headImage: string;
    content: {
      en: {title: string; description: string; textOverlay: string};
      th: {title: string; description: string; textOverlay: string};
      zh: {title: string; description: string; textOverlay: string};
    };
    tags: string[];
    button: {
      isShow: boolean;
      content: {th: {name: string}; en: {name: string}; zh: {name: string}};
      url: string;
    };
    isCurrentDisplay: boolean; // Use for mapping suggested events on the Home screen
  };
  image: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  published: boolean;
  release_date: string | null;
  slug: string;
  version: number;
  history_categoryId: string | null;
  deleted_at: string | null;
  updated_by: string;
}

const whatHappeningService = {
  getEvents: async (language: string) => {
    try {
      const typeData: AxiosResponse<WrappedResponseTypeResult> =
        await OB_DOCUMENT_SDK.client.typeShow('whathappening');
      const typeObject = typeData.data.data as any;
      const typeId: string | undefined = typeObject[0].id;

      if (typeId) {
        const response: AxiosResponse<WrappedResponseCategoryResult> =
          await OB_DOCUMENT_SDK.client.categoryShow('*', undefined, typeId);
        const serializedData = whatHappeningService.serializeData(
          response.data.data as WhatHappeningApiResponse[],
          language,
        );
        return serializedData;
      }
    } catch (error) {
      console.log("Fetch What's happening error :", error);
    }
  },
  suggestEvents: async (language: string) => {
    try {
      const typeData: AxiosResponse<WrappedResponseTypeResult> =
        await OB_DOCUMENT_SDK.client.typeShow('whathappening');
      const typeObject = typeData.data.data as any;
      const typeId: string | undefined = typeObject[0].id;

      if (typeId) {
        const response: AxiosResponse<WrappedResponseCategoryResult> =
          await OB_DOCUMENT_SDK.client.categoryShow('*', undefined, typeId);
        const serializedData = whatHappeningService.serializeData(
          response.data.data as WhatHappeningApiResponse[],
          language,
        );
        let filteredData: WhatHappeningProps[] = serializedData.filter(
          item => item.isCurrentDisplay === true && item.sequence > 0,
        );
        const sortedData = filteredData.sort((a, b) => a.sequence - b.sequence);
        return sortedData;
      }
    } catch (error) {
      console.log("Fetch What's happening error :", error);
    }
  },
  serializeData: (
    data: WhatHappeningApiResponse[],
    language: string,
  ): WhatHappeningProps[] => {
    let events: WhatHappeningProps[] = [];
    data.map(group => {
      group.list.map(item => {
        const currentTime = new Date().getTime();
        const publishDate = new Date(item.body.showStartDate).getTime();
        const isPublishing = currentTime >= publishDate;
        if (item.published && isPublishing) {
          const eventData = {
            id: item.id,
            title:
              item.body.content[
                language as keyof (typeof item)['body']['content']
              ].title || item.body.content.en.title,
            description:
              item.body.content[
                language as keyof (typeof item)['body']['content']
              ].description || item.body.content.en.description,
            textOverlay:
              item.body.content[
                language as keyof (typeof item)['body']['content']
              ].textOverlay || item.body.content.en.textOverlay,
            category: group.title as string,
            image: item.body.headImage,
            thumbnailImage: item.body.thumbnailImage,
            headImage: item.body.headImage,
            tags: item.body.tags,
            location: item.body.location,
            eventStartDate: item.body.eventStartDate,
            eventEndDate: item.body.eventEndDate,
            showStartDate: item.body.showStartDate,
            showEndDate: item.body.showEndDate,
            sequence: item.body.seq,
            isCurrentDisplay: item.body.isCurrentDisplay,
            button: item.body.button?.isShow
              ? {
                  name:
                    item.body.button.content[
                      language as keyof (typeof item)['body']['button']['content']
                    ].name || item.body.button.content.en.name,
                  url: item.body.button.url,
                }
              : null,
          };
          events.push(eventData);
        }
      });
    });
    events = events.filter(event =>
      dayjs().isBetween(event.showStartDate, event.showEndDate, 'day', '[]'),
    );
    events.sort((a, b) => {
      const startDateA = new Date(a.eventStartDate).getTime();
      const startDateB = new Date(b.eventStartDate).getTime();

      const endDateA = new Date(a.eventEndDate).getTime();
      const endDateB = new Date(b.eventEndDate).getTime();

      if (!DateTime.isSame(startDateA, startDateB)) {
        return startDateB - startDateA;
      }
      if (!DateTime.isSame(endDateA, endDateB)) {
        return endDateB - endDateA;
      }

      return a.title.localeCompare(b.title);
    });
    return events;
  },
};

export {whatHappeningService};
