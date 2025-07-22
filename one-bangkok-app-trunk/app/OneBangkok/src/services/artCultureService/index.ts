import {getArtCToken} from './authService';
import {artCultureHttpClient} from './httpClient';
import authenState from '~/states/authen/authenState';

class ArtCultureServices {
  async fetchLandingPage(locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get('/api/landing/page', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchAllArtCTypePage(locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get('/api/art-c/page/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchArtCTypePage(typeId: string | number, locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(`/api/art-c/page/${typeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchArtCCategoryPage(
    typeId: string | number,
    categoryId: string | number,
    locale: string,
  ) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(
      `/api/art-c/category/page/${typeId}/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          locale,
        },
      },
    );
  }

  async fetchProgramsPage(locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get('/api/programs/page', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchProgramPage(programId: string | number, locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(`/api/programs/page/${programId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchAddOnPage(
    programId: string | number,
    addOnId: string | number,
    locale: string,
  ) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(
      `/api/add-on/page/${programId}/${addOnId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          locale,
        },
      },
    );
  }

  async fetchTagPage(tag: string, locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(`/api/programs/page/tags/${tag}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchFaqs(locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get('/api/faqs/page', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchWalkingMeetingMaps(locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get('/api/walking-meeting-map', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async fetchWalkingMeetingMap(id: number, locale: string) {
    const token = await getArtCToken();
    return artCultureHttpClient.get(`/api/walking-meeting-map/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        locale,
      },
    });
  }

  async getBookmark() {
    return artCultureHttpClient.get('/user-api/bookmark', {
      headers: {
        Authorization: `Bearer ${authenState.token.get()}`,
      },
    });
  }

  async getBookmarkByType(type: string) {
    return artCultureHttpClient.get(`/user-api/bookmark/${type}`, {
      headers: {
        Authorization: `Bearer ${authenState.token.get()}`,
      },
    });
  }

  async createBookmark(contentType: string, contentId: string) {
    return artCultureHttpClient.post(
      '/user-api/bookmark',
      {
        contentType,
        contentId,
      },
      {
        headers: {
          Authorization: `Bearer ${authenState.token.get()}`,
        },
      },
    );
  }

  async deleteBookmark(contentType: string, contentId: string) {
    return artCultureHttpClient.delete('/user-api/bookmark', {
      headers: {
        Authorization: `Bearer ${authenState.token.get()}`,
      },
      data: {
        contentType,
        contentId,
      },
    });
  }
}

export const artCultureServices = new ArtCultureServices();
