import { htmlToMarkdown, markdownToHtml } from 'utils/markdown'

export interface IGetWhatHappening {
  id: string
  active: boolean
  release_date: string
  created_at: string
  published: boolean
  updated_at: string
  body: IUpsertWhatHappening
  updated_by: string
}

export interface IFilterWhatHappening {
  filter?: string
  categoryId?: string
  location?: string
  date?: Date[]
}

export interface IGetWhatHappeningCategory {
  categoryId: string
  category: string
  contentList?: IGetWhatHappening[]
}

export interface IGetWhatHappeningLocation {
  locationId: string
  location: string
  contentList?: IGetWhatHappening[]
}

export interface IFilterWhatHappeningLocation {
  locationId?: string
}

export class FilterWhatHappeningLocation
  implements IFilterWhatHappeningLocation
{
  locationId?: string

  constructor(data?: IFilterWhatHappeningLocation) {
    this.locationId = data?.locationId
  }
}

export class FilterWhatHappening implements IFilterWhatHappening {
  filter?: string
  categoryId?: string
  location?: string
  date?: Date[]

  constructor(data?: IFilterWhatHappening) {
    this.filter = data?.filter
    this.categoryId = data?.categoryId
    this.location = data?.location
    this.date = data?.date
  }
}

export interface IGetWhatHappeningRecord {
  categoryid: string
  isCurrentDisplay: boolean
  seq: number
  id: string
  title: string
  status: string
  category: string
  publishdate: string
  eventRange: string
  lastUpdate: string
  updatedBy: string
}

export interface IUpsertWhatHappening {
  id?: string
  isCurrentDisplay: boolean
  seq: number
  categoryId: string
  publishDate?: Date
  location: string
  showStartDate: string
  showEndDate?: string
  eventStartDate: string
  eventEndDate: string
  thumbnailImage: string
  headImage: string
  content: {
    th: {
      title: string
      description: string
      textOverlay?: string
    }
    en: {
      title: string
      description: string
      textOverlay?: string
    }
    zh: {
      title: string
      description: string
      textOverlay?: string
    }
  }
  tags: string[]
  button: {
    isShow: boolean
    content: {
      th: {
        name: string
      }
      en: {
        name: string
      }
      zh: {
        name: string
      }
    }
    url: string
  }
}

export class WhatHappening implements IUpsertWhatHappening {
  id?: string | undefined
  isCurrentDisplay: boolean
  seq: number
  categoryId: string
  publishDate?: Date
  location: string
  showStartDate: string
  showEndDate?: string
  eventStartDate: string
  eventEndDate: string
  thumbnailImage: string
  headImage: string
  content: {
    th: {
      title: string
      description: string
      textOverlay?: string
    }
    en: {
      title: string
      description: string
      textOverlay?: string
    }
    zh: {
      title: string
      description: string
      textOverlay?: string
    }
  }
  tags: string[]
  button: {
    isShow: boolean
    content: {
      th: {
        name: string
      }
      en: {
        name: string
      }
      zh: {
        name: string
      }
    }
    url: string
  }

  constructor(data?: IUpsertWhatHappening) {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
    this.id = data?.id
    this.isCurrentDisplay = data?.isCurrentDisplay ?? false
    this.seq = data?.seq ?? 0
    this.categoryId = data?.categoryId ?? ''
    this.publishDate = new Date()
    this.location = data?.location ?? ''
    this.showStartDate = data?.showStartDate ?? ''
    this.showEndDate = data?.showEndDate ?? ''
    this.eventStartDate = data?.eventStartDate ?? ''
    this.eventEndDate = data?.eventEndDate ?? ''
    this.thumbnailImage = data?.thumbnailImage ?? ''
    this.headImage = data?.headImage ?? ''
    this.content = {
      en: {
        title: data?.content.en.title ?? '',
        description: markdownToHtml(data?.content.en.description ?? ''),
        textOverlay: data?.content.en.textOverlay ?? '',
      },
      th: {
        title: data?.content.th.title ?? '',
        description: markdownToHtml(data?.content.th.description ?? ''),
        textOverlay: data?.content.th.textOverlay ?? '',
      },
      zh: {
        title: data?.content.zh.title ?? '',
        description: markdownToHtml(data?.content.zh.description ?? ''),
        textOverlay: data?.content.zh.textOverlay ?? '',
      },
    }
    this.tags = data?.tags ?? []
    this.button = {
      isShow: data?.button.isShow ?? false,
      content: {
        th: {
          name: data?.button.content.th.name ?? '',
        },
        en: {
          name: data?.button.content.en.name ?? '',
        },
        zh: {
          name: data?.button.content.zh.name ?? '',
        },
      },
      url: data?.button.url ?? '',
    }
  }
}

export class UpsertWhatHappening implements IUpsertWhatHappening {
  id?: string | undefined
  isCurrentDisplay: boolean
  seq: number
  categoryId: string
  publishDate?: Date
  location: string
  showStartDate: string
  showEndDate?: string
  eventStartDate: string
  eventEndDate: string
  thumbnailImage: string
  headImage: string
  content: {
    th: {
      title: string
      description: string
      textOverlay?: string
    }
    en: {
      title: string
      description: string
      textOverlay?: string
    }
    zh: {
      title: string
      description: string
      textOverlay?: string
    }
  }
  tags: string[]
  button: {
    isShow: boolean
    content: {
      th: {
        name: string
      }
      en: {
        name: string
      }
      zh: {
        name: string
      }
    }
    url: string
  }

  constructor(data?: IUpsertWhatHappening) {
    this.id = data?.id
    this.isCurrentDisplay = data?.isCurrentDisplay ?? false
    this.seq = data?.seq ?? 0
    this.categoryId = data?.categoryId ?? ''
    this.publishDate = new Date()
    this.location = data?.location ?? ''

    const showStartDate = new Date(data?.showStartDate ?? '')
    showStartDate.setHours(0, 0, 0, 0)
    this.showStartDate = showStartDate.toISOString()

    if (data?.showEndDate) {
      const showEndDate = new Date(data.showEndDate)
      showEndDate.setHours(23, 59, 59, 0)
      this.showEndDate = showEndDate.toISOString()
    } else {
      this.showEndDate = undefined
    }

    const eventStartDate = new Date(data?.eventStartDate ?? '')
    eventStartDate.setHours(0, 0, 0, 0)
    this.eventStartDate = eventStartDate.toISOString()

    const eventEndDate = new Date(data?.eventEndDate ?? '')
    eventEndDate.setHours(23, 59, 59, 0)
    this.eventEndDate = eventEndDate.toISOString()

    this.thumbnailImage = data?.thumbnailImage ?? ''
    this.headImage = data?.headImage ?? ''
    this.content = {
      en: {
        title: data?.content.en.title ?? '',
        description: htmlToMarkdown(data?.content.en.description ?? ''),
        textOverlay: data?.content.en.textOverlay ?? '',
      },
      th: {
        title: data?.content.th.title ?? '',
        description: htmlToMarkdown(data?.content.th.description ?? ''),
        textOverlay: data?.content.th.textOverlay ?? '',
      },
      zh: {
        title: data?.content.zh.title ?? '',
        description: htmlToMarkdown(data?.content.zh.description ?? ''),
        textOverlay: data?.content.zh.textOverlay ?? '',
      },
    }
    this.tags = data?.tags ?? []
    this.button = {
      isShow: data?.button.isShow ?? false,
      content: {
        th: {
          name: data?.button.content.th.name ?? '',
        },
        en: {
          name: data?.button.content.en.name ?? '',
        },
        zh: {
          name: data?.button.content.zh.name ?? '',
        },
      },
      url: data?.button.url ?? '',
    }
  }
}

export interface WhatheppeningResult {
  id?: string
  category_id?: string
  title?: any
  body?: UpsertWhatHappening
  image?: string | null
  active?: boolean
  created_at?: Date | string
  updated_at?: Date | string
  published?: boolean
  release_date?: Date | string | null
  slug?: string
  version?: number
}

export interface WhathappeningShowQuery {
  limit?: number
  page?: number
  order?: 'asc' | 'desc'
  sort?: string
  active?: boolean
  released?: boolean
  releaseDate?: string
  isCurrentDisplay?: boolean
  filter?: string
  location?: string
  startDateFrom?: string
  startDateTo?: string
  endDateFrom?: string
  endDateTo?: string
}
