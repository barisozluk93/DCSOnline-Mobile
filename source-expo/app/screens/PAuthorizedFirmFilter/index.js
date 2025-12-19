import { useTranslation } from 'react-i18next';
import { ScrollView, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import {
  Button,
  Header,
  Icon,
  NotFound,
  SafeAreaView,
  Text,
  TextInput,
} from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

const PAuthorizedFirmFilter = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const [authorizedFirmList, setAuthorizedFirmList] = useState(authorizedFirms);
  const [selectedItem, setSelectedItem] = useState(selectedAuthorizedFirm);
  const [searchText, setSearchText] = useState('');

  const onItemSelected = (item) => {
    setSelectedItem(item.musteriid);
  };

  const filterFirm = (text) => {
    setSearchText(text)
    if (text) {
      setAuthorizedFirmList(authorizedFirms.filter((item) => item.name.toLocaleLowerCase("tr-TR").includes(text.toLocaleLowerCase("tr-TR"))));
    } else {
      setAuthorizedFirmList(authorizedFirms);
    }
  };

  const confirmFirmChange = () => {
    Alert.alert(
      "",
      t('sure'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          onPress: () => {
            dispatch({ type: 'SET_SELECTED_AUTH_FIRM', payload: selectedItem });
            navigation.goBack();
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
      <Header
        title={t('authorizedFirmSelection')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => navigation.goBack()}
      />

      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <TextInput
          value={searchText}
          onChangeText={filterFirm}
          placeholder={t('search_firm')}
          iconLeft={<Icon name="search" color={colors.border} style={{ marginRight: 8 }} size={18} />}
          icon={
            searchText ? (
              <TouchableOpacity onPress={() => { filterFirm(''); }}>
                <Icon name="times" size={16} color={BaseColor.grayColor} />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
      {authorizedFirmList.length === 0 && <NotFound />}

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {authorizedFirmList.map((item, index) => (
            <View style={[styles.contain]}>
              <View key={item.musteriid} style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => onItemSelected(item)} style={{
                    flexDirection: 'row',
                  }}>
                    {(item.musteriid === selectedItem) && <Icon name="check" size={14} color={colors.primary} />}
                    <View>
                      <Text body2 style={{ color: (item.musteriid === selectedItem) ? colors.primary : colors.text }}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                <View
                  style={[
                    styles.footer,
                    {
                      borderColor: colors.border,
                    },
                  ]}
                >
                </View>
              </View>
            </View>
          ))}

        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <Button
          full
          onPress={
            confirmFirmChange
          }
        >
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PAuthorizedFirmFilter;
