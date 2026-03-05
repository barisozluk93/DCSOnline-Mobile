import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header, Text, SafeAreaView, HeaderLargeTitleBadge, DeclarationYYS, Icon, NotFound } from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { approveYYS, getByRefId, getDetailById, listDeclarationYYSRequest } from '@/apis/declarationApi';
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';
import { useCallback, useEffect } from 'react';

const PTask = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const { loading, declarations } = useSelector((state) => state.declarationYYS);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  const confirmYYSApprove = (item) => {
    Alert.alert(
      "",
      t('sure'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('ok'),
          onPress: () => confirmYYS(item),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmYYS = (item) => {
    approveYYS(item.beyannameid, item.musteriid).then(response => {
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: t('success_message'),
      });

      setTimeout(() => {
        fetchData();
      }, 250);
    })
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();

      return () => {
        dispatch({ type: 'DECLARATION_YYS_INIT' });
      };
    }, [selectedAuthorizedFirm])
  );

  const fetchData = () => {
    dispatch({ type: 'DECLARATION_YYS_LIST_REQUEST' });
    let yysList = [];
    try {
      listDeclarationYYSRequest(selectedAuthorizedFirm).then(response => {
        response.data.forEach(item => {
          getByRefId(item.refid).then(response1 => {
            getDetailById(response1.data.beyannameid).then(response2 => {
              yysList.push(response2.data.data);

              if (yysList.length === response.data.length) {
                dispatch({ type: 'DECLARATION_YYS_LIST_SUCCESS', payload: yysList });
              }
            });
          })
        });

        if (response.data.length === 0) {
          dispatch({ type: 'DECLARATION_YYS_LIST_SUCCESS', payload: response.data });
        }
      })
    } catch (err) {
      dispatch({ type: 'DECLARATION_YYS_LIST_FAIL', payload: err.response?.data?.message || err.message });
    }
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('tasks')}
        renderLeft={() => {
          if (!authorizedFirms) return null;
          const currentFirm = authorizedFirms.find((f) => f.musteriid == selectedAuthorizedFirm);

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.container, { borderColor: colors.border }]}
              onPress={() => navigation.navigate("PAuthorizedFirmFilter")}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail" // Uzun isimlerin sonuna ... koyar ama genişlik arttığı için daha çok kelime sığar
                style={[styles.firmText, { color: colors.text }]}
              >
                {currentFirm?.name || t("select_firm")}
              </Text>
              <Icon
                name="angle-down"
                size={18}
                color={colors.text}
              />
            </TouchableOpacity>
          );
        }}
        renderRight={() => {
          // return (
          //   <View style={styles.notification}>
          //     <HeaderLargeTitleBadge onPress={goToPage('MNotification')} />
          //   </View>
          // );
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
            rejimTip={item.beyan1}
            gonderici={item.gondericiad}
            alici={item.aliciad}
            onApprove={() => confirmYYSApprove(item)}
            style={{
              marginBottom: 20,
            }}
          />
        )}
      />}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
      ) : null
      }
    </SafeAreaView>
  );
};

export default PTask;
