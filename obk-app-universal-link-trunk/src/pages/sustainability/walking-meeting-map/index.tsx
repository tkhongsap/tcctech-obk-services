import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function WalkingMeetingMapPage() {
  useEffect(() => {
    setTimeout(() => {
      const deepLink = `${process.env.APP_URL}sustainability/walking-meeting-map`;
      window.location.href = deepLink;
    }, 1000);
  }, []);

  return (
    <div className='relative flex items-center justify-center w-full h-full'>
      <div className='max-w-[320px] w-full mx-auto p-4'>
        <div className='pb-10'>
          <Image
            src='/images/logo-one-black.png'
            width='238'
            height='29'
            alt='One Bangkok'
            className='w-full'
          />
        </div>

        <div className='pb-10 text-center text-lg'>
          Please download <strong>One Bangkok</strong> application to access{' '}
          <span className='text-nowrap'>
            the <strong>Walking Meeting Map</strong> content.
          </span>
        </div>

        <div className='-mx-2 flex'>
          <div className='px-2 w-1/2'>
            <Link
              href='https://apps.apple.com/th/app/one-bangkok/id6475669593'
              target='_blank'
            >
              <Image
                src='/images/app-store.png'
                width='238'
                height='29'
                alt='App Store'
                className='w-full'
              />
            </Link>
          </div>

          <div className='px-2 w-1/2'>
            <Link
              href='https://play.google.com/store/apps/details?id=com.onebangkok.prod'
              target='_blank'
            >
              <Image
                src='/images/play-store.png'
                width='238'
                height='29'
                alt='App Store'
                className='w-full'
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
