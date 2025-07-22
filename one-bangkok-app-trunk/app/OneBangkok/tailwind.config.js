module.exports = {
  content: [
    '**/*/screens/**/*.{js,ts,jsx,tsx}',
    '**/*/components/**/*.{js,ts,jsx,tsx}',
    '**/*/utils/**/*',
  ],
  theme: {
    fontFamily: {
      obRegular: ['"OneBangkok-Regular"'],
      obMedium: ['"OneBangkok-Medium"'],
      obBold: ['"OneBangkok-Bold"'],
    },
    extend: {
      colors: {
        default: {
          light: '#262D33',
          dark: '#FFFFFE',
        },
        'default-inverse': {
          light: '#FFFFFE',
          dark: '#262D33',
        },
        primary: {
          light: '#1E8DF2',
          dark: '#1E8DF2',
        },
        'muted-50': {
          light: '#F4F6F7',
          dark: '#F4F6F7',
        },
        'muted-400': {
          light: '#989898',
          dark: '#989898',
        },
        'muted-800': {
          light: '#464646',
          dark: '#464646',
        },
        muted: {
          light: '#8E8E93',
          dark: '#8E8E93',
        },
        success: {
          light: '#09BDB0',
          dark: '#09BDB0',
        },
        error: {
          light: '#FF3C3C',
          dark: '#FF3C3C',
        },
        warning: {
          light: '#FFB137',
          dark: '#FFB137',
        },
        select: {
          light: '#FCFCFC',
          dark: '#FCFCFC',
        },
        label: {
          light: '#09BDB0',
          dark: '#09BDB0',
        },
        fade: {
          light: '#D8D8D8',
          dark: '#D8D8D8',
        },
        subtitle: {
          light: '#E99D09',
          dark: '#E99D09',
        },
        'subtitle-muted': {
          light: '#7C7C7C',
          dark: '#7C7C7C',
        },
        veryWeakBar: {
          light: '#FF6C64',
          dark: '#FF6C64',
        },
        weakBar: {
          light: '#FFB137',
          dark: '#FFB137',
        },
        mediumBar: {
          light: '#34AAFD',
          dark: '#34AAFD',
        },
        strongBar: {
          light: '#46C070',
          dark: '#46C070',
        },
        veryStrongBar: {
          light: '#2B8E4E',
          dark: '#2B8E4E',
        },
        danger: {
          light: '#C8170D',
          dark: '#C8170D',
        },
        line: {
          light: '#DCDCDC',
          dark: '#DCDCDC',
        },
        cascade: {
          light: '#57756C',
          dark: '#57756C',
        },
        'mist-gray-700': {
          light: '#6D6B61',
          dark: '#6D6B61',
        },
        'vp-pass-desc': {
          light: '#686868',
          dark: '#686868',
        },
        'vp-pass-date': {
          light: '#808080',
          dark: '#808080',
        },
        'puerto-rico-700': {
          light: '#087D78',
          dark: '#087D78',
        },
        'pizazz-600': {
          light: '#F07B06',
          dark: '#F07B06',
        },
        'greenish-blue': {
          light: '#003753',
          dark: '#003753',
        },
        'sky-blue': {
          light: '#87DAFF',
          dark: '#87DAFF',
        },
        'dark-red': {
          light: '#842525',
          dark: '#842525',
        },
        'dark-gray': {
          light: '#292929',
          dark: '#292929',
        },
        'jet-black': {
          light: '#1A1919',
          dark: '#1A1919',
        },
        'kelly-green': {
          light: '#22973F',
          dark: '#22973F',
        },
        'fire-engine-red': {
          light: '#ED2015',
          dark: '#ED2015',
        },
        'dark-teal': {
          light: '#014541',
          dark: '#014541',
        },
        orange: {
          light: '#FF9500',
          dark: '#FF9500',
        },
        navy: {
          light: '#162C51',
          dark: '#162C51',
        },
        'light-gray': {
          light: '#EFEFEF',
          dark: '#EFEFEF',
        },
        yellow: {
          light: '#FFE35A',
          dark: '#FFE35A',
        },
        'white-text': {
          light: '#FDFDFD',
          dark: '#FDFDFD',
        },
        'soft-white': {
          light: '#FDFDFD',
          dark: '#FDFDFD',
        },
        'greyscale-400': {
          light: '#989898',
          dark: '#989898',
        },
        black: {
          light: '#000000',
          dark: '#000000',
        },
      },
      backgroundColor: {
        default: {
          light: '#FFFFFE',
          dark: '#262D33',
        },
        'default-inverse': {
          light: '#262D33',
          dark: '#FFFFFE',
        },
        primary: {
          light: '#1E8DF2',
          dark: '#1E8DF2',
        },
        'primary-selected': {
          light: '#EEFAFF',
          dark: '#EEFAFF',
        },
        section: {
          light: '#F6F6F6',
          dark: '#F6F6F6',
        },
        line: {
          light: '#F2F2F2',
          dark: '#F2F2F2',
        },
        'muted-400': {
          light: '#989898',
          dark: '#989898',
        },
        'muted-800': {
          light: '#464646',
          dark: '#464646',
        },
        muted: {
          light: '#8E8E93',
          dark: '#8E8E93',
        },
        'error-200': {
          light: '#FFE4E4',
          dark: '#FFE4E4',
        },
        error: {
          light: '#FFF2F1',
          dark: '#FFF2F1',
        },
        sky: {
          light: '#C3EAFE',
          dark: '#C3EAFE',
        },
        bar: {
          light: '#DCDCDC',
          dark: '#DCDCDC',
        },
        veryWeakBar: {
          light: '#FF6C64',
          dark: '#FF6C64',
        },
        weakBar: {
          light: '#FFB137',
          dark: '#FFB137',
        },
        mediumBar: {
          light: '#34AAFD',
          dark: '#34AAFD',
        },
        strongBar: {
          light: '#46C070',
          dark: '#46C070',
        },
        veryStrongBar: {
          light: '#2B8E4E',
          dark: '#2B8E4E',
        },
        'visitor-pass': {
          light: '#F9F7F3',
          dark: '#F9F7F3',
        },
        'vp-list': {
          light: '#FDFDFD',
          dark: '#FDFDFD',
        },
        forest: {
          light: '#394C46',
          dark: '#394C46',
        },
        'view-parking': {
          light: '#003753',
          dark: '#003753',
        },
        'parking-lot-floor-card': {
          light: '#DDEEE4',
          dark: '#DDEEE4',
        },
        'building-access': {
          light: '#10221D',
          dark: '#10221D',
        },
        navy: {
          light: '#162C51',
          dark: '#162C51',
        },
        'jet-black': {
          light: '#1A1919',
          dark: '#1A1919',
        },
        'light-gray': {
          light: '#EFEFEF',
          dark: '#EFEFEF',
        },
        'pale-yellow': {
          light: '#FFFEC1',
          dark: '#FFFEC1',
        },
        'light-blue': {
          light: '#D6F2FF',
          dark: '#D6F2FF',
        },
        'light-green': {
          light: '#DFF9E5',
          dark: '#DFF9E5',
        },
        'light-green-unread': {
          light: '#EDFFF7',
          dark: '#EDFFF7',
        },
        'muted-50': {
          light: '#F4F6F7',
          dark: '#F4F6F7',
        },
        'light-pink': {
          light: '#FFE1DF',
          dark: '#FFE1DF',
        },
        'dark-teal': {
          light: '#014541',
          dark: '#014541',
        },
        yellow: {
          light: '#FFE35A',
          dark: '#FFE35A',
        },
        'dark-red': {
          light: '#842525',
          dark: '#842525',
        },
        black: {
          light: '#000000',
          dark: '#000000',
        },
        'white-fade': {
          light: 'rgba(255,255,255,0.8)',
          dark: 'rgba(255,255,255,0.8)',
        },
      },
      borderColor: {
        primary: {
          light: '#1E8DF2',
          dark: '#1E8DF2',
        },
        active: {
          light: '#1E8DF2',
          dark: '#1E8DF2',
        },
        inactive: {
          light: '#C1C1C6',
          dark: '#C1C1C6',
        },
        select: {
          light: '#FCFCFC',
          dark: '#FCFCFC',
        },
        error: {
          light: '#FF3C3C',
          dark: '#FF3C3C',
        },
        fade: {
          light: '#D8D8D8',
          dark: '#D8D8D8',
        },
        danger: {
          light: '#A5170F',
          dark: '#A5170F',
        },
        line: {
          light: '#DCDCDC',
          dark: '#DCDCDC',
        },
        'vp-button': {
          light: '#394C46',
          dark: '#394C46',
        },
        'brown-400': {
          light: '#A2A195',
          dark: '#A2A195',
        },
        'jet-black': {
          light: '#1A1919',
          dark: '#1A1919',
        },
        'fire-engine-red': {
          light: '#ED2015',
          dark: '#ED2015',
        },
        'dark-orange': {
          light: '#D19500',
          dark: '#D19500',
        },
        'vibrant-blue': {
          light: '#068EFF',
          dark: '#068EFF',
        },
        'dark-green': {
          light: '#1E7735',
          dark: '#1E7735',
        },
        'light-silver': {
          light: '#BDBDBD',
          dark: '#BDBDBD',
        },
      },
    },
  },
};
