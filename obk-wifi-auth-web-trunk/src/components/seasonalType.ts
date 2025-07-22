import Maple0 from '@/src/assets/maple-leaf-0.svg'
import Maple1 from '@/src/assets/maple-leaf-1.svg'
import Maple2 from '@/src/assets/maple-leaf-2.svg'
import Maple3 from '@/src/assets/maple-leaf-3.svg'

import Snow0 from '@/src/assets/snowflake-0.svg'
import Snow1 from '@/src/assets/snowflake-1.svg'
import Snow2 from '@/src/assets/snowflake-2.svg'
import Snow3 from '@/src/assets/snowflake-3.svg'
import Snow4 from '@/src/assets/snowflake-4.svg'

const commonOption = {
  color: {
    value: '#fff',
  },
  // Move the snow flakes to bottom for a realistic effect, 'out' in outModes is for making them reappear on top once exited at the bottom of the page, the speed should be slow for a realistic effect
  move: {
    direction: 'bottom',
    enable: true,
    outModes: 'out',
    speed: 2,
  },
  // How many particles/snowflakes will be created when starting the effect, density is a good option to enable since it calculates the particles number based on the screen size (mobile users will be happy)
  number: {
    density: {
      enable: true,
      area: 800,
    },
    value: 400,
  },
  // The opacity of the particles/snowflakes
  opacity: {
    value: 0.7,
  },
  // The shape of the particles/snowflakes, also custom shapes can be used, this will be discussed at the end
  // shape: {
  //   type: 'circle',
  // },
  // The size of the particles/snowflakes
  size: {
    value: 10,
  },
  // A nice wobble movement
  wobble: {
    enable: true,
    distance: 10,
    speed: 10,
  },
  // Some depth to the effect, (the layers count by default is 100, changing max here is not affecting that count)
  // The zIndex will affect speed, size and opacity of the particles/snowflakes, the smaller the zIndex the smaller/more transparent/slower the particles/snowflakes will be
  zIndex: {
    value: {
      min: 0,
      max: 100,
    },
  },
}

const summerType = {
  opacity: {
    value: 0.2,
  },
  shape: {
    type: 'images',
    options: {
      images: [
        {
          src: Maple0.src,
          width: 200,
          height: 200,
        },
        {
          src: Maple1.src,
          width: 200,
          height: 200,
        },
        {
          src: Maple2.src,
          width: 200,
          height: 200,
        },
        {
          src: Maple3.src,
          width: 200,
          height: 200,
        },
      ],
    },
  },
}

const winterType = {
  shape: {
    type: 'images',
    options: {
      images: [
        {
          src: Snow0.src,
          width: 200,
          height: 200,
        },
        {
          src: Snow1.src,
          width: 200,
          height: 200,
        },
        {
          src: Snow2.src,
          width: 200,
          height: 200,
        },
        {
          src: Snow3.src,
          width: 200,
          height: 200,
        },
        {
          src: Snow4.src,
          width: 200,
          height: 200,
        },
      ],
    },
  },
}

export { commonOption, summerType, winterType }
