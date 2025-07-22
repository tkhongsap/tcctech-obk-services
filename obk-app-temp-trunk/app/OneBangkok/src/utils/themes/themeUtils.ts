import {useColorScheme} from 'nativewind';
import {dark} from './dark';
import {light} from './light';
import {get, split} from 'lodash';
import themeConfig from '../../../tailwind.config';
import {reduce} from 'lodash';

export const getCustomClassUtility = (): string[] => {
  const borderWidth = {
    'border-0': 'border-[0px]',
    'border-0.5': 'border-[0.5px]',
    'border-1': 'border-[1px]',
    'border-2': 'border-[2px]',
    'border-3': 'border-[3px]',
    'border-4': 'border-[4px]',
    'border-6': 'border-[6px]',
    'border-8': 'border-[8px]',
  };
  return reduce(
    [dark, light, borderWidth],
    (result: Array<string>, theme) => {
      const values = Object.values(theme);
      return [...result, ...values];
    },
    [],
  );
};

const UseTheme = () => {
  // const {colorScheme} = useColorScheme();
  // const color = colorScheme === 'dark' ? dark : light;
  // Force color to light instead of use phone color scheme
  const color = light;
  return color;
};

const getTheme = (className: string) => {
  const theme = UseTheme();
  const classNameArray = split(className, ' ');
  const modifiedClassNameArray = classNameArray.map(cls =>
    get(theme, cls, cls),
  );

  const result = modifiedClassNameArray.join(' ');
  return result;
};

function getPropByString(obj: any, propString: string) {
  if (!propString) {
    return obj;
  }

  var prop,
    props = propString.split('.');

  for (var i = 0, length = props.length - 1; i < length; i++) {
    prop = props[i];

    var candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
}

export const GetPureColorCode = (name: string) => {
  const {colorScheme} = useColorScheme();
  type ObjectKey = keyof typeof themeConfig;
  const keyName = `theme.extend.colors.${name}.${colorScheme}` as ObjectKey;
  return getPropByString(themeConfig, keyName);
};

export default getTheme;
