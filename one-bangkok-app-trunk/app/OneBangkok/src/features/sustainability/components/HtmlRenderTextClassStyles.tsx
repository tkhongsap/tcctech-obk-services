import {Platform, StyleSheet} from 'react-native';
import {defaultSystemFonts} from 'react-native-render-html';

export const HTMLRenderTextClassStyles = StyleSheet.create({
  'ql-align-center': {textAlign: 'center'},
  'ql-align-right': {textAlign: 'right'},
  'ql-size-small': {fontSize: 12},
  'ql-size-large': {fontSize: 20},
  'ql-size-huge': {fontSize: 24},
});

export const HTMLRenderTextTagsStyles = StyleSheet.create(
  Platform.OS === 'ios'
    ? {
        p: {margin: 0, padding: 0, fontFamily: 'OneBangkok-Regular'},
        ul: {margin: 0, fontFamily: 'OneBangkok-Regular'},
        li: {margin: 0, padding: 0, fontFamily: 'OneBangkok-Regular'},
        h1: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h2: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h3: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h4: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h5: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h6: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
      }
    : {
        p: {
          margin: 0,
          padding: 2,
          lineHeight: 20,
          fontFamily: 'OneBangkok-Regular',
        },
        ul: {margin: 0, lineHeight: 19, fontFamily: 'OneBangkok-Regular'},
        li: {
          margin: 0,
          padding: 0,
          lineHeight: 19,
          fontFamily: 'OneBangkok-Regular',
        },
        h1: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h2: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h3: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h4: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h5: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
        h6: {
          margin: 0,
          padding: 0,
          fontFamily: 'OneBangkok-Regular',
          fontWeight: 'normal',
        },
      },
);

export const replaceTextHtml = (sHtml: string) => {
  let sText = '';
  sText = "<div style='color:#000;'>" + sHtml + '</div>';
  sText = sText.replace(/<p><br><\/p>/g, "<div style='height:15px'></div>");
  return sText;
};

export const systemFonts = [...defaultSystemFonts, 'OneBangkok-Regular'];
