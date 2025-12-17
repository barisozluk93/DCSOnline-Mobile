import { useTranslation } from 'react-i18next';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [ authorizedFirmList, setAuthorizedFirmList ] = useState(authorizedFirms);
  const [ selectedItem, setSelectedItem ] = useState(selectedAuthorizedFirm);
  const [ searchText, setSearchText ] = useState('');

  const onItemSelected = (item) => {
    setSelectedItem(item.musteriid);
  };

  const filterFirm = (text) => {
    setSearchText(text)
      if (text) {
        setAuthorizedFirmList(authorizedFirmList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase())));
      } else {
        setAuthorizedFirmList(authorizedFirms);
      }
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
                  <TouchableOpacity onPress={() => { setSelectedItem(''); filterFirm(''); }}>
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
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'column' }}>
                  <TouchableOpacity onPress={() => onItemSelected(item)} style={{
                    flexDirection: 'row',
                  }} key={`${index}`}>
                    {(item.musteriid === selectedItem) && <Icon name="check" size={14} color={colors.primary} />}
                    <View>
                      <Text body2 style={{ color: (item.musteriid === selectedItem) ? colors.primary : colors.text }}>
                       {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
          onPress={() => {
            dispatch({ type: 'SET_SELECTED_AUTH_FIRM', payload: selectedItem });
            navigation.goBack();
          }}
        >
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PAuthorizedFirmFilter;
