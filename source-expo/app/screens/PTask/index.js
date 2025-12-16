import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header, ModalOption, Text, SafeAreaView, HeaderLargeTitleBadge, DeclarationYYS, Icon, NotFound } from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { listDeclarationYYS } from '@/actions/declaration';
import { listDeclarationRequest, listDeclarationYYSRequest } from '@/apis/declarationApi';

const PTask = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const { loading, declarations } = useSelector((state) => state.declarationYYS);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  useEffect(() => {
    fetchData();
  }, [selectedAuthorizedFirm])

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    dispatch(listDeclarationYYS(selectedAuthorizedFirm));
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('tasks')}
        renderLeft={() => {
          if (authorizedFirms) {
            return (
              <TouchableOpacity style={[styles.container, { borderColor: colors.border }]} onPress={() => navigation.navigate('PAuthorizedFirmFilter')}>
                <Text style={{ width: 115 }}>{authorizedFirms.filter(f => f.musteriid == selectedAuthorizedFirm)[0].name}</Text>
                <Icon style={{ width: 25, paddingTop: 8 }} name="angle-down" size={20} enableRTL={true} color={colors.text} />
              </TouchableOpacity>
            );
          }
        }}
        renderRight={() => {
          return (
            <View style={styles.notification}>
              <HeaderLargeTitleBadge onPress={goToPage('MNotification')} />
            </View>
          );
        }}
        onPressRight={() => {
        }}
      />
      {!loading && declarations && declarations.length === 0 && <NotFound />}

      {!loading && <FlatList
        style={{ marginTop: 10 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={declarations}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <DeclarationYYS
            beyannameRefId={item.refid}
            rejimTip={item.beyan}
            gonderici={item.gondericiad}
            alici={item.aliciad}
            onOption={() => setShowAction(true)}
            style={{
              marginBottom: 20,
            }}
          />
        )}
      />}
      {loading ? (
        <ActivityIndicator size="large" style={{ margin: 20 }} />
      ) : null
      }
    </SafeAreaView>
  );
};

export default PTask;
