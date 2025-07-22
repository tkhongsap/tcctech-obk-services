import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import {
  IArtCTranslation,
  IArtCTypeItem,
  IProgram,
  IProgramTranslation,
} from '@src/services/art-and-culture/model'
import dayjs from 'dayjs'

interface IHighlightProgramSlide {
  items: IProgram[]
  artCTypes: IArtCTypeItem[]
}

const HighlightProgramSlide = ({
  items,
  artCTypes,
}: IHighlightProgramSlide) => {
  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination]}
        loop={true}
        className='art-c-highlight-swiper'
      >
        {items.map((program) => {
          let translation: IProgramTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = program.programTranslation.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (!translation) {
            return null
          }

          const artCType = artCTypes.find(
            (item) => item.id === program.artCTypeId
          )

          let artCTranslation: IArtCTranslation | undefined
          if (artCType && artCType.artCTranslation) {
            for (let item of ['en', 'th', 'zh']) {
              artCTranslation = artCType.artCTranslation.find(
                (tItem) => tItem.locale === item
              )
              if (translation) {
                break
              }
            }
          }

          return (
            <SwiperSlide key={`hl-program-slide-${program.id}`}>
              <div>
                <div
                  className='relative w-full bg-cover bg-center'
                  style={{
                    height: '580px',
                    backgroundImage: `url(${translation.banner})`,
                  }}
                >
                  <div
                    className='absolute flex left-0 bottom-0 w-full'
                    style={{
                      height: '50%',
                      justifyContent: 'center',
                      alignItems: 'end',
                      background:
                        'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0) 100%)',
                    }}
                  >
                    <div className='text-center px-4'>
                      <div
                        className='text-xs pt-4'
                        style={{ color: '#FFEC41' }}
                      >
                        {artCTranslation ? artCTranslation.title : '&nbsp;'}
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        <div className='text-white'>
                          {dayjs(program.periodAt).format('DD MMM')} -{' '}
                          {dayjs(program.periodEnd).format('DD MMM YYYY')}
                        </div>
                        <div
                          className='text-white'
                          style={{ fontSize: '28px' }}
                        >
                          {translation.title}
                        </div>
                        {translation.author && (
                          <div className='text-white'>
                            by {translation.author}
                          </div>
                        )}
                      </div>
                      <div className='pt-3' style={{ color: '#BDBDBD' }}>
                        {translation.locations.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#000', height: '75px' }}></div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default HighlightProgramSlide
