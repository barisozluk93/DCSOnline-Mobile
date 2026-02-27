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
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { isNullOrEmpty } from '@/utils/utility';

export const years = [
  { key: new Date().getFullYear(), name: new Date().getFullYear() },
  { key: new Date().getFullYear()-1, name: new Date().getFullYear()-1 },
  { key: new Date().getFullYear()-2, name: new Date().getFullYear()-2 },
  { key: new Date().getFullYear()-3, name: new Date().getFullYear()-3 },
  { key: new Date().getFullYear()-4, name: new Date().getFullYear()-4 }
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
  const { colors } = useTheme();
  const [year, setYear] = useState({ key: new Date().getFullYear(), name: new Date().getFullYear() });
  const [yearId, setYearId] = useState(new Date().getFullYear());
  const [transportationType, setTransportationType] = useState();
  const [transportationTypeId, setTransportationTypeId] = useState();
  const [declarationType, setDeclarationType] = useState();
  const [declarationTypeId, setDeclarationTypeId] = useState();

  const { filter } = useSelector(state => state.dashboard);

  useEffect(() => {    
    if(filter) {
      if(filter["vf_Yıl"] || !isNullOrEmpty(filter["vf_Yıl"]) && !isNaN(filter["vf_Yıl"])) {
        setYear(years.filter(f => f.key == filter["vf_Yıl"])[0]);
      }

      if(filter["vf_Beyan Tipi"] || !isNullOrEmpty(filter["vf_Beyan Tipi"]) && !isNaN(filter["vf_Beyan Tipi"])) {
        setDeclarationType(declarationTypes.filter(f => f.key == filter["vf_Beyan Tipi"])[0]);
      }

      if(filter["vf_Taşıma Şekli"] || !isNullOrEmpty(filter["vf_Taşıma Şekli"]) && !isNaN(filter["vf_Taşıma Şekli"])) {
        setTransportationType(transportationTypes.filter(f => f.key == filter["vf_Taşıma Şekli"])[0]);
      }
    }
  }, [filter]);

  const onClear = () => {
    setYear(years[0]);
    setYearId(years[0].key)
    setDeclarationType();
    setDeclarationTypeId();
    setTransportationType();
    setTransportationTypeId();
  };

  const onFilter = () => {
    let filter = {};
    if(year) {
      filter["vf_Yıl"] = yearId;
    }
    else{
      filter["vf_Yıl"] = new Date().getFullYear();
    }

    if(transportationType) {
      filter["vf_Taşıma Şekli"] = transportationTypeId;
    }

    if(declarationType) {
      filter["vf_Beyan Tipi"] = declarationTypeId;
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
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>   
          <PickerSelect label={t('year')} value={year} onChange={(v) => { setYear(v); setYearId(v.key) }} options={years} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>   
          <PickerSelect label={t('transportation_type')} value={transportationType} onChange={(v) => { setTransportationType(v); setTransportationTypeId(v.key) }} options={transportationTypes} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>   
          <PickerSelect label={t('dec_type')} value={declarationType} onChange={(v) => { setDeclarationType(v); setDeclarationTypeId(v.key) }} options={declarationTypes} />
        </View>
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
