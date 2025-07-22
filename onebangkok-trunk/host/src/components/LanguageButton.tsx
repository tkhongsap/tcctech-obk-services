import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../navigations/AppNavigation';
import IconButtonWithImage from './IconButtonWithImage';

type Props = {};

const LanguageButton = ({}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const onPress = () => {
    navigation.navigate('LanguageSettingsScreen');
  };

  return (
    <IconButtonWithImage
      onPress={onPress}
      imageSource={require('../../assets/images/icon_language.png')}
    />
  );
};

export default LanguageButton;
