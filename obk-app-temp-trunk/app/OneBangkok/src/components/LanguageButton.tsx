import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../navigations/AppNavigation';
import IconButton from './IconButton';

type Props = {};

const LanguageButton = ({}: Props) => {
  const navigation = useNavigation<StackNavigation>();

  const onPress = () => {
    navigation.navigate('LanguageSettingsScreen');
  };

  return (
    <IconButton
      onPress={onPress}
      imageSource={require('../../assets/images/icon_language.png')}
    />
  );
};

export default LanguageButton;
