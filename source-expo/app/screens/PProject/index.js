import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Header, ModalOption, Text, SafeAreaView, HeaderLargeTitleBadge, Icon, Declaration, NotFound } from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { listDeclaration } from '@/actions/declaration';
import { listDeclarationArchieveRequest } from '@/apis/declarationApi';

const PProject = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showFilesAction, setShowFilesAction] = useState(false);
  const [beyannameid, setBeyannameid] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [selectedFileOption, setSelectedFileOption] = useState();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const { loading, declarations, page, totalPages } = useSelector((state) => state.declaration);
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

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

  const setSelectedItem = (beyannameid) => {
    setSelectedFileOption();
    setBeyannameid(beyannameid);
    listDeclarationArchieveRequest(beyannameid).then(response => {
      let list = [];
      setFiles([]);

      response.forEach(element => {
        list.push({ value: element.arsivid + "", text: element.ad })
      });

      setFiles([...list]);
      setShowFilesAction(true);
    });
  }

  const fileOptionSelected = (value) => {
    setSelectedFileOption(value);
    setShowFilesAction(false);

    navigation.navigate('PProjectView', { item: { refid: declarations.filter(f => f.beyannameid === beyannameid)[0].refid, arsivid: value.value, beyannameid: beyannameid } });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('declaration')}
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
          <Declaration
            beyannameRefId={item.refid}
            rejimTip={item.beyan}
            gonderici={item.gondericiad}
            alici={item.aliciad}
            registrationDate={item.tesciltarihi}
            registrationNo={item.tescilno}
            status={item.istakipdurum}
            onOption={() => setSelectedItem(item.beyannameid)}
            style={{
              marginBottom: 20,
            }}
          />


        )}
      />}
      {!loading && declarations && declarations.length > 0 && <View style={{ flexDirection: "row", justifyContent: "center", padding: 16 }}>
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setCurrentPage(page - 1)}
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
          <Text style={{ borderRadius: 8, height: 30, textAlign: "center", color: colors.text, fontSize: 16, padding: 5 }}>{t('next')}›</Text>
        </TouchableOpacity>
      </View>}

      {loading ? (
        <ActivityIndicator size="x-large" style={{ margin: 20, textAlign: "center" }} />
      ) : null
      }
      {showFilesAction && files && files.length > 0 && <ModalOption
        value={selectedFileOption}
        options={files}
        isVisible={showFilesAction}
        onSwipeComplete={() => {
          setShowFilesAction(false);
        }}
        onPress={(value) => {
          fileOptionSelected(value)
        }}
        onBackdropPress={() => {
          setShowFilesAction(false)
        }}
      />}
    </SafeAreaView>
  );
};

export default PProject;
