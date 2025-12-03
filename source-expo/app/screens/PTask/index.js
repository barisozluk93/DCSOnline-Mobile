import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header, ModalOption, Text, SafeAreaView, HeaderLargeTitleBadge, DeclarationYYS, Icon } from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { listDeclaration } from '@/actions/declaration';

const PTask = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showAction, setShowAction] = useState(false);
  const [showAuthorizedFirmsAction, setShowAuthorizedFirmsAction] = useState(false);
  const {authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const {loading, declarations, page, totalPages, pageSize } = useSelector((state) => state.declaration);
  const [currentPage, setCurrentPage] = useState(1);
  const [authorizedFirmsList, setAuthorizedFirmsList] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const YYSAction = [
    {
      value: 'confirm',
      text: t('confirm'),
    },
  ];

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  useEffect(() => {
    if(authorizedFirms) {
      let list = [];
      authorizedFirms.forEach(element => {
        list.push({ value: element.musteriid + "", text: element.name })

        if(element.musteriid === selectedAuthorizedFirm) {
          setSelectedOption({ value: element.musteriid, text: element.name })
        }
      });

      setAuthorizedFirmsList(list);
    }
  }, [authorizedFirms, showAuthorizedFirmsAction])

  useEffect(() => {
    fetchData();
  }, [selectedAuthorizedFirm])

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [currentPage])

  const fetchData = () => {
    dispatch(listDeclaration(selectedAuthorizedFirm, currentPage, 6));
  }

  const optionSelected = (value) => {
    setSelectedOption(value);
    dispatch({ type: 'SET_SELECTED_AUTH_FIRM', payload: value.value });
    setShowAuthorizedFirmsAction(false);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('tasks')}
        renderLeft={() => {
          if(authorizedFirms) {
            return (
              <TouchableOpacity style={[styles.container, {borderColor: colors.border}]} onPress={() => { setShowAuthorizedFirmsAction(true) }}>
                    <Text style={{width: 115}}>{authorizedFirms.filter(f => f.musteriid == selectedAuthorizedFirm)[0].name}</Text>
                    <Icon style={{width: 25, paddingTop: 8}} name="angle-down" size={20} enableRTL={true} color={colors.text} />
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
      {!loading && <FlatList
        style={{marginTop: 10}}
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
      {!loading && <View style={{ flexDirection: "row", justifyContent: "center", padding: 16 }}>        
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setCurrentPage(page-1)}
          style={{ marginHorizontal: 6, opacity: page === 1 ? 0.4 : 1 }}
        >
          <Text style={{ borderRadius: 8, height: 30, textAlign: "center", color: colors.text, fontSize: 16, padding: 5 }}>‹ {t('prev')}</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={true}>
          <Text style={{ borderRadius: 8, width: 30, height: 30, textAlign: "center", color: colors.text, backgroundColor: colors.primary, fontSize: 16, padding: 5 }}>
            {page}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => setCurrentPage(page + 1)}
          style={{ marginHorizontal: 6, opacity: page === totalPages ? 0.4 : 1 }}
        >
          <Text style={{ borderRadius: 8, height: 30, textAlign: "center", color: colors.text, fontSize: 16, padding: 5 }}>{t('next')} ›</Text>
        </TouchableOpacity>
      </View>}
      {loading ? (
          <ActivityIndicator size="large" style={{ margin: 20 }} />
        ) : null
      }
      <ModalOption
        value={{}}
        options={YYSAction}
        isVisible={showAction}
        onSwipeComplete={() => {
          setShowAction(false);
        }}
        onPress={() => {
          setShowAction(false);
        }}
      />

      {authorizedFirmsList.length > 0 && <ModalOption

        value={selectedOption}
        options={authorizedFirmsList}
        isVisible={showAuthorizedFirmsAction}
        onSwipeComplete={() => {
          setShowAuthorizedFirmsAction(false);
        }}
        onPress={(value) => {
          optionSelected(value)
        }}
      />}
    </SafeAreaView>
  );
};

export default PTask;
