import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {
  ListSection,
  ItemList,
  ListItemProps,
  Button,
  useModal,
} from '~/components/molecules';
import t from '~/utils/text';
import {useAccountState} from '~/states/account/accountState';
import {Spacing, Text} from '~/components/atoms';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {ProviderType} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {IdentityLimitReach} from '../constants/IdentityLimitReach';
import {capitalize, join, map} from 'lodash';

interface IdentityListsType {
  title: string;
  items: ListItemProps[];
}

interface IdentityBodyProps {
  IdentityLists: IdentityListsType[];
}
const IdentityBody = ({IdentityLists}: IdentityBodyProps) => {
  const lists = IdentityLists.map(section => {
    return (
      <View key={`list-section-${section.title}`}>
        <Spacing height={24} />
        <ListSection title={section.title}>
          <ItemList items={section.items} />
        </ListSection>
      </View>
    );
  });
  return <View>{lists}</View>;
};

interface LimitReachedIdentityProps {
  onClose: any;
  provider: ProviderType;
}

const LimitReachedIdentity = (props: LimitReachedIdentityProps) => {
  const {onClose, provider} = props;
  const title =
    provider === 'phone'
      ? t(
          'Drawer__Add_phone_reached_limit__Header',
          'Phone number limit reached',
        )
      : t('Drawer__Add_email_reached_limit__Header', 'Email limit reached');
  const description =
    provider === 'phone'
      ? t(
          'Drawer__Add_phone_reached_limit__Body',
          'You have reached the maximum limit of three numbers. To add a new phone number, please remove one of your existing numbers first.',
        )
      : t(
          'Drawer__Add_email_reached_limit__Body',
          'You have reached the maximum limit of three email addresses. To add a new email, please remove one of your existing emails first.',
        );
  return (
    <>
      <Text size="B1" weight="medium">
        {title}
      </Text>
      <Text color="subtitle-muted" size="B2">
        {description}
      </Text>
      <Spacing height={16} />
      <Button
        title={t('General__Close', 'Close')}
        outlined={true}
        onPress={onClose}
      />
      <Spacing height={16} />
    </>
  );
};

const IdentityList = () => {
  const {identifiers} = useAccountState();
  const [emailList, setEmailList] = useState<ListItemProps[]>([]);
  const [phoneNumberList, setPhoneNumberList] = useState<ListItemProps[]>([]);
  const navigation = useNavigation<StackNavigation>();
  const [_modalState, modalActions] = useModal();

  const mapIdentifiersList = useCallback(() => {
    const email: ListItemProps[] = [];
    const phoneNumber: ListItemProps[] = [];
    if (identifiers.value) {
      identifiers.value.map((identifier: any) => {
        if (identifier.provider === 'phone') {
          phoneNumber.push({
            rightElement: identifier.default ? 'tag' : 'right',
            title: identifier.identifier,
            onPress: () => {
              if (!identifier.default) {
                navigation.navigate('IdentityDetailScreen', {
                  header: t('General__Phone_number', 'Phone number'),
                  identity: {
                    provider: 'phone',
                    identifier: identifier.identifier,
                    id: identifier.id,
                  },
                });
              }
            },
            key: `${identifier.id}`,
            textDescriptionColor: 'muted',
            rightText: t('General__Default', 'Default'),
          });
        } else {
          const description = join(
            map(identifier.type, record => {
              return capitalize(record);
            }),
            ', ',
          );
          email.push({
            rightElement: identifier.default ? 'tag' : 'right',
            title: identifier.identifier,
            onPress: () => {
              if (!identifier.default) {
                navigation.navigate('IdentityDetailScreen', {
                  header: t('General__Email', 'Email'),
                  identity: {
                    provider: 'email',
                    identifier: identifier.identifier,
                    id: identifier.id,
                  },
                });
              }
            },
            description:
              identifier.type.length !== 0
                ? t('General__Connected_with', 'Connected with {{sso}}', {
                    sso: description,
                  })
                : '',
            key: `${identifier.id}`,
            textDescriptionColor: 'muted',
            rightText: t('General__Default', 'Default'),
          });
        }
      });
    }
    if (phoneNumber.length < 3) {
      phoneNumber.push({
        title: t('General__Add_new_phone', 'Add new phone number'),
        onPress: () => {
          handleOnPressAddIdentity('phone', phoneNumber.length - 1);
        },
        key: 'add-new-phone',
        textTitleColor: 'primary',
        textTitleWeight: 'medium',
      });
    } else {
      phoneNumber.push({
        title: t(
          'General__Phone_limit',
          "You've reached your limit. To add a new one, please delete an existing number.",
        ),
        key: 'add-new-phone-full',
        textTitleColor: 'subtitle-muted',
        textTitleWeight: 'regular',
      });
    }

    if (email.length < 3) {
      email.push({
        title: t('General__Add_new_email', 'Add new email'),
        onPress: () => {
          handleOnPressAddIdentity('email', email.length - 1);
        },
        key: 'add-new-email',
        textTitleColor: 'primary',
        textTitleWeight: 'medium',
      });
    } else {
      email.push({
        title: t(
          'General__Email_limit',
          "You've reached your limit of three emails. To add a new one, please delete an existing email first.",
        ),
        key: 'add-new-email-full',
        textTitleColor: 'subtitle-muted',
        textTitleWeight: 'regular',
      });
    }

    phoneNumber.sort(
      (a, b) =>
        Number(b.rightElement === 'tag') - Number(a.rightElement === 'tag'),
    );
    email.sort(
      (a, b) =>
        Number(b.rightElement === 'tag') - Number(a.rightElement === 'tag'),
    );
    setEmailList(email);
    setPhoneNumberList(phoneNumber);
  }, [identifiers]);

  useEffect(() => {
    mapIdentifiersList();
  }, [mapIdentifiersList]);

  const IdentityLists: IdentityListsType[] = [
    {
      title: t('General__Email', 'Email'),
      items: [...emailList],
    },
    {
      title: t('General__Phone_number', 'Phone number'),
      items: [...phoneNumberList],
    },
  ];

  const handleOnPressAddIdentity = (
    provider: ProviderType,
    identityLength: number,
  ) => {
    if (provider === 'phone' && identityLength < IdentityLimitReach.phone) {
      navigation.navigate('AddIdentityScreen', {provider});
    } else if (
      provider === 'email' &&
      identityLength < IdentityLimitReach.email
    ) {
      navigation.navigate('AddIdentityScreen', {provider: 'email'});
    } else {
      modalActions.setContent(
        <LimitReachedIdentity
          onClose={() => modalActions.hide()}
          provider={provider}
        />,
      );
      modalActions.show();
    }
  };

  return <IdentityBody IdentityLists={IdentityLists} />;
};

export default IdentityList;
