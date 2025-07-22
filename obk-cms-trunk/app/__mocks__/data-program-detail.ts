import { IProgram } from '@src/services/art-and-culture/model'

export const defaultProgramDetailData: IProgram = {
  id: 24,
  artCTypeId: 3,
  type: ['sculpture'],
  isPublished: true,
  isProduct: true,
  productPrice: 0,
  displayFreeLabel: false,
  relateProgramIds: [32, 15],
  relateProductIds: [],
  publishedAt: new Date('2024-10-24T17:00:40.61Z'),
  periodAt: new Date('2024-11-13T06:44:35.076Z'),
  createdAt: new Date('2024-10-22T11:28:24.967552Z'),
  updatedAt: new Date('2024-11-13T06:44:45.804682Z'),
  programTranslation: [
    {
      id: 41,
      programId: 24,
      locale: 'th',
      title: "It Is, It Isn't",
      shortDesc: '',
      desc: '\u003cp\u003e(เกิด พ.ศ. 2492 เมืองลิเวอร์พูล สหราชอาณาจักร พำนักและทำงานที่เมืองวุพเพอร์ทาล ประเทศเยอรมนี)\u003c/p\u003e',
      author: 'โทนี แคร็กก์',
      thumbnail:
        'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729596855265_6ehl7p.jpg',
      banner:
        'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729596861206_hxcwi.jpg',
      openingHours: [],
      locations: [],
      enterFee: 0,
      externalLink: '',
      infoItems: [
        {
          title: 'MEDIUM',
          content: 'สเตนเลส',
        },
        {
          title: 'COLLECTION',
          content: 'สมบัติของ โทนิค อินเตอร์เนชั่นแนล',
        },
        {
          title: 'YEAR',
          content: '2566-2567',
        },
        {
          title: 'DIMENSIONS',
          content: '780.5 x 341 x 393 ซม',
        },
      ],
      audio: '',
      video: '',
      tags: [],
      createdAt: new Date('2024-10-22T11:28:24.967552Z'),
      updatedAt: new Date('2024-11-13T06:44:45.804682Z'),
    },
    {
      id: 40,
      programId: 24,
      locale: 'en',
      title: "It Is, It Isn't",
      shortDesc: '',
      desc: '',
      author: 'Tony Cragg',
      thumbnail:
        'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729776288713_9tqsp.jpg',
      banner:
        'https://obk-uat-image.s3.ap-southeast-1.amazonaws.com/1729776293182_i75bxd.jpg',
      openingHours: ['10.00-12.00'],
      locations: ['abc'],
      enterFee: 0,
      externalLink: 'https://www.onebangkok.com/en/',
      infoItems: [
        {
          title: 'DIMENSIONS',
          content: '780.5 x 341 x 393 cm',
        },
        {
          title: 'COLLECTION',
          content: 'Collection of Tonic International',
        },
        {
          title: 'YEAR',
          content: '2023-2024',
        },
      ],
      audio: '',
      video: '',
      tags: [],
      createdAt: new Date('2024-10-22T11:28:24.967552Z'),
      updatedAt: new Date('2024-11-13T06:44:45.804682Z'),
    },
  ],
  addOns: [],
  partners: [],
}
