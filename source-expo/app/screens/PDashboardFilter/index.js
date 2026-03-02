import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import {
  Button,
  FormDoubleSelectOption,
  Header,
  Icon,
  PaymentOption,
  PButtonAddUser,
  PickerSelect,
  ProfileGridSmall,
  SafeAreaView,
  Tag,
  Text,
  TextInput,
} from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '@/utils/utility';
import { useRoute } from '@react-navigation/native';
import DatePicker from '../Components/Common/DatePicker';

export const years = [
  { key: new Date().getFullYear(), name: new Date().getFullYear() },
  { key: new Date().getFullYear() - 1, name: new Date().getFullYear() - 1 },
  { key: new Date().getFullYear() - 2, name: new Date().getFullYear() - 2 },
  { key: new Date().getFullYear() - 3, name: new Date().getFullYear() - 3 },
  { key: new Date().getFullYear() - 4, name: new Date().getFullYear() - 4 }
];

export const transportationTypes = [
  { key: "DENİZ", name: "DENİZ" },
  { key: "HAVA", name: "HAVA" },
  { key: "KARA", name: "KARA" },
];

export const declarationTypes = [
  { key: "AN", name: "AN" },
  { key: "DI", name: "DI" },
  { key: "EX", name: "EX" },
  { key: "IM", name: "IM" },
  { key: "TE", name: "TE" },
  { key: "TR", name: "TR" },
  { key: "UZ", name: "UZ" },
];

const PDashboardFilter = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();
  const route = useRoute();
  const { colors } = useTheme();
  const [year, setYear] = useState({ key: new Date().getFullYear(), name: new Date().getFullYear() });
  const [yearId, setYearId] = useState(new Date().getFullYear());
  const [transportationType, setTransportationType] = useState();
  const [transportationTypeId, setTransportationTypeId] = useState();
  const [declarationType, setDeclarationType] = useState();
  const [declarationTypeId, setDeclarationTypeId] = useState();

  const today = new Date();
  const yıl = today.getFullYear();
  const ay = String(today.getMonth()+1).padStart(2, '0');
  const gun = String(today.getDay()+1).padStart(2, '0');
  const [tescilStartDate, setTescilStartDate] = useState();
  const [tescilEndDate, setTescilEndDate] = useState(yıl + "-" + ay + "-" + gun);
  const [basvuruStartDate, setBasvuruStartDate] = useState();
  const [basvuruEndDate, setBasvuruEndDate] = useState(yıl + "-" + ay + "-" + gun);
  const [tab, setTab] = useState();

  const { filter } = useSelector(state => state.dashboard);

  useEffect(() => {
      const today = new Date();
      const yıl = today.getFullYear();
      const ay = String(today.getMonth()+1).padStart(2, '0');
      const gun = String(today.getDay()+1).padStart(2, '0');

      if (filter && filter["vf_Yıl"] || !isNullOrEmpty(filter["vf_Yıl"]) && !isNaN(filter["vf_Yıl"])) {
        setYear(years.filter(f => f.key == filter["vf_Yıl"])[0]);
      }
      else{
        setYear(years[0])
      }

      if (filter && filter["vf_Beyan Tipi"] || !isNullOrEmpty(filter["vf_Beyan Tipi"]) && !isNaN(filter["vf_Beyan Tipi"])) {
        setDeclarationType(declarationTypes.filter(f => f.key == filter["vf_Beyan Tipi"])[0]);
      }

      if (filter && filter["vf_Taşıma Şekli"] || !isNullOrEmpty(filter["vf_Taşıma Şekli"]) && !isNaN(filter["vf_Taşıma Şekli"])) {
        setTransportationType(transportationTypes.filter(f => f.key == filter["vf_Taşıma Şekli"])[0]);
      }

      if (filter && filter["vf_RegisterationStartDate"] || !isNullOrEmpty(filter["vf_RegisterationStartDate"]) && !isNaN(filter["vf_RegisterationStartDate"])) {
        setTescilStartDate(filter["vf_RegisterationStartDate"]);
      }
      else{
        setTescilStartDate("2025-01-01");
      }

      if (filter && filter["vf_RegisterationEndDate"] || !isNullOrEmpty(filter["vf_RegisterationEndDate"]) && !isNaN(filter["vf_RegisterationEndDate"])) {
        setTescilEndDate(filter["vf_RegisterationEndDate"]);
      }
      else{
        setTescilEndDate(yıl + "-" + ay + "-" + gun);
      }

      if (filter && filter["vf_ApplicationStartDate"] || !isNullOrEmpty(filter["vf_ApplicationStartDate"]) && !isNaN(filter["vf_ApplicationStartDate"])) {
        setBasvuruStartDate(filter["vf_ApplicationStartDate"]);
      }
      else{
        setBasvuruStartDate("2025-01-01");
      }

      if (filter && filter["vf_ApplicationEndDate"] || !isNullOrEmpty(filter["vf_ApplicationEndDate"]) && !isNaN(filter["vf_ApplicationEndDate"])) {
        setBasvuruEndDate(filter["vf_ApplicationEndDate"]);
      }
      else{
        setBasvuruEndDate(yıl + "-" + ay + "-" + gun);
      }
  }, [filter]);

  useEffect(() => {
    if (route?.params?.item) {
      setTab(route?.params?.item.tab);
    }
  }, [route?.params]);

  const onClear = () => {
    setYear(years[0]);
    setYearId(years[0].key)
    setDeclarationType();
    setDeclarationTypeId();
    setTransportationType();
    setTransportationTypeId();

    setTescilStartDate("2025-01-01");
    setBasvuruStartDate("2025-01-02");

    const today = new Date();
    const yıl = today.getFullYear();
    const ay = String(today.getMonth()+1).padStart(2, '0');
    const gun = String(today.getDay()+1).padStart(2, '0');

    setTescilEndDate(yıl + "-" + ay + "-" + gun);
    setBasvuruEndDate(yıl + "-" + ay + "-" + gun);
  };

  const onFilter = () => {
    let filter = {};
    if (year) {
      filter["vf_Yıl"] = yearId;
    }
    else {
      filter["vf_Yıl"] = new Date().getFullYear();
    }

    if (transportationType) {
      filter["vf_Taşıma Şekli"] = transportationTypeId;
    }

    if (declarationType) {
      filter["vf_Beyan Tipi"] = declarationTypeId;
    }

    if (basvuruEndDate) {
      filter["vf_ApplicationEndDate"] = basvuruEndDate.split('T')[0];
    }

    if (basvuruStartDate) {
      filter["vf_ApplicationStartDate"] = basvuruStartDate.split('T')[0];
    }

    if (tescilStartDate) {
      filter["vf_RegisterationStartDate"] = tescilStartDate.split('T')[0];
    }

    if (tescilEndDate) {
      filter["vf_RegisterationEndDate"] = tescilEndDate.split('T')[0];
    }

    dispatch({ type: 'DASHBOARD_SET_FILTER', payload: filter });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left']}>
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('clear')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={onClear}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {tab && tab !== 'tareks' && <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <PickerSelect label={t('year')} value={year} onChange={(v) => { setYear(v); setYearId(v.key) }} options={years} />
        </View>}

        {tab && tab === 'tareks' && <View style={{ paddingHorizontal: 20, paddingTop: 10, width: "100%" }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>

              <DatePicker
                placeholder={t('tescil_start_date')}
                formatDisplay="DD/MM/yyyy"
                value={new Date(tescilStartDate)}
                label={t('tescil_start_date')}
                onChange={(value) => { setTescilStartDate(value.toISOString()) }}
              />
            </View>
            <View style={{ flex: 1 }}>

              <DatePicker
                placeholder={t('tescil_end_date')}
                formatDisplay="DD/MM/yyyy"
                value={new Date(tescilEndDate)}
                label={t('tescil_end_date')}
                onChange={(value) => setTescilEndDate(value.toISOString())}
              />
            </View>
          </View>
        </View>}

        {tab && tab === 'tareks' && <View style={{ paddingHorizontal: 20, paddingTop: 10, width: "100%" }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>

              <DatePicker
                placeholder={t('application_start_date')}
                formatDisplay="DD/MM/yyyy"
                value={new Date(basvuruStartDate)}
                label={t('application_start_date')}
                onChange={(value) => { setBasvuruStartDate(value.toISOString()) }}
              />
            </View>
            <View style={{ flex: 1 }}>

              <DatePicker
                placeholder={t('application_end_date')}
                formatDisplay="DD/MM/yyyy"
                value={new Date(basvuruEndDate)}
                label={t('application_end_date')}
                onChange={(value) => setBasvuruEndDate(value.toISOString())}
              />
            </View>
          </View>
        </View>}

        {tab && tab !== 'tareks' && <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <PickerSelect label={t('transportation_type')} value={transportationType} onChange={(v) => { setTransportationType(v); setTransportationTypeId(v.key) }} options={transportationTypes} />
        </View>}

        {tab && tab !== 'tareks' && <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <PickerSelect label={t('dec_type')} value={declarationType} onChange={(v) => { setDeclarationType(v); setDeclarationTypeId(v.key) }} options={declarationTypes} />
        </View>}

      </ScrollView>
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Button
          full
          onPress={onFilter}
        >
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default PDashboardFilter;
