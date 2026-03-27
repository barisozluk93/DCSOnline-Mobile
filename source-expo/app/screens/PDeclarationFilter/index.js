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
  ProfileGridSmall,
  SafeAreaView,
  Tag,
  Text,
  TextInput,
} from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';

export const PDeclarationStatus = [
    {
      value: 'complete',
      text: 'Bitti (Complete)',
    },
    {
      value: 'inprogress',
      text: 'Devam Ediyor (In Progress)',
    }
  ];

export  const PDeclarationType = [
    {
      value: 'EX',
      text: 'İhracat',
    },
    {
      value: 'IM',
      text: 'İthalat',
    },
    {
      value: 'AN',
      text: 'Antrepo'
    },
    {
      value: 'DI',
      text: 'Dahilde İşleme'
    },
    {
      value: 'DG',
      text: 'Gümrük İşlemleri'
    },
    {
      value: 'DP',
      text: 'Dahilde İşleme Prosedürü'
    },
    {
      value: 'MI',
      text: 'Hariçte İşleme'
    },
    {
      value: 'OB',
      text: 'Özet Beyan'
    },
    {
      value: 'SB',
      text: 'Serbest Bölge Beyannamesi'
    },
    {
      value: 'TE',
      text: 'Teminat İşlemi'
    },
    {
      value: 'TR',
      text: 'Transit Beyanname'
    },
    {
      value: 'UZ',
      text: 'Uzlaşma'
    },
  ];
const PDeclarationFilter = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [beyannameRefId, setBeyannameRefId] = useState();
  const [status, setStatus] = useState();
  const [type, setType] = useState([]);
  const { filters } = useSelector(state => state.declaration);

  useEffect(() => {
    if(filters && filters.length > 0) {
      filters.forEach(element => {
        if(element.field === "refid") {
          let value = element.value.substring(1, element.value.length-1);
          setBeyannameRefId(value);
        }

        if(element.field === "istakipdurum") {
          let value = element.value.substring(1, element.value.length-1);
          setStatus(value);
        }

        if(element.field === "beyan1") {
          let values = element.values;
          setType([...values]);
        }
      });
    }
  }, [filters]);

  const onClear = () => {
    setBeyannameRefId();
    setStatus();
    setType([]);
  };

  const renderItem = ({ item, checked, onPress }) => {
    return (
      <Tag
        key={item.id}
        icon={checked ? <Icon style={{ marginRight: 5 }} name="check" color={BaseColor.whiteColor} size={16} /> : null}
        primary={checked}
        outline={!checked}
        style={{
          marginTop: 8,
          marginRight: 8,
          height: 28,
          minWidth: 100,
        }}
        onPress={onPress}
      >
        {item.text}
      </Tag>
    );
  };

  const onTypeAdd = (item) => {
    let typeValue = item.value;
    let list = type;
    list.push(typeValue);
    setType([...list]);
  }

  const onFilter = () => {
    let filter = [];
    if(beyannameRefId) {
      filter.push({field: 'refid', op: 'like', value: '%' + beyannameRefId + '%'});
    }

    if(type && type.length > 0) {
      filter.push({field: 'beyan1', op: 'IN', values: type ,value: null});
    }

    if(status) {
      filter.push({field: 'istakipdurum', op: 'like', value: '%' + status + '%'});
    }

    dispatch({ type: 'DECLARATION_SET_FILTER', payload: filter.length > 0 ? filter : null });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[BaseStyle.safeAreaView]} edges={['right', 'top', 'left', 'bottom']}>
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
          <Text headline semibold>
            {t('beyannamerefid')}
          </Text>
          <View style={[styles.wrapContent, {marginTop: 8}]}>
            <TextInput
              value={beyannameRefId}
              onChangeText={(val) => setBeyannameRefId(val)}
              placeholder={t('beyannamerefid')}
              iconLeft={<Icon name="search" color={colors.border} style={{ marginRight: 8 }} size={18} />}
            />
          </View>
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('status')}
          </Text>
          <View style={styles.wrapContent}>
            {PDeclarationStatus.map((item, index) => (
              <Fragment key={index}>
                {renderItem({
                  item,
                  index,
                  checked: status ? item.text === status : false,
                  onPress: () => setStatus(item.text),
                })}
              </Fragment>
            ))}
          </View>
          <Text headline semibold style={{ marginTop: 20 }}>
            {t('type')}
          </Text>
          <View style={styles.wrapContent}>
            {PDeclarationType.map((item, index) => (
              <Fragment key={index}>
                {renderItem({
                  item,
                  index,
                  checked: type ? type.includes(item.value) : false,
                  onPress: () => onTypeAdd(item),
                })}
              </Fragment>
            ))}
          </View>
          
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

export default PDeclarationFilter;
