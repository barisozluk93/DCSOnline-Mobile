import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import * as Utils from '@/utils';
import { Header, Dashboard, SafeAreaView, Text, TabTag, HeaderLargeTitleBadge, Tag, Icon } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getRequestIdRequest, tableauLoginRequest } from '@/apis/reportApi';
import { useRef } from "react";
import WebView from 'react-native-webview';

const PHome = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState([]);
  const [requestId, setRequestId] = useState();
  const [tableauToken, setTableauToken] = useState();
  const { filter } = useSelector(state => state.dashboard);

  const DashboardData = [
    {
      type: 'declaration',
      data:
        [
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamBeyanname/YllaraGreBeyannameSaylar',
            chartType: 'card',
            title: t('total_number_of_decs'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamFaturaTutar/YllaraGreFaturaTutar',
            chartType: 'card',
            title: t('total_invoice_amount'),
            byParameter: t('last_five_years'),
            style: {
              height: (Utils.heightTabView() - 212) / 2,
              width: (Utils.getWidthDevice() - 28),
              backgroundColor: "#ffffff",
            }
          },
        ]
    },
    {
      type: 'declaration',
      data:
        [
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamKymet/YllaraGreKymet',
            chartType: 'card',
            title: t('total_value'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamVergi/YllaraGreToplamVergi',
            chartType: 'card',
            title: t('total_tax'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff",
            }
          },
        ]
    },
    {
      type: 'declaration',
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-BeyanTipineGreToplamBeyannameSaylarveFaturaTutarlar/BeyanTipineGreBeyannameSaylar',
          chartType: 'pie',
          title: t('total_number_of_decs'),
          byParameter: t('by_dec_type') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TamaeklineGreBeyannameSaylarveFaturaTutarlar/TamaeklineGreBeyannameSaylar',
          chartType: 'pie',
          title: t('total_number_of_decs'),
          byParameter: t('by_transportation_type') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        },
      ]
    },
    {
      type: 'declaration',
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-AylaraGreToplamBeyannameSaylarveFaturaTutarlar/AylaraGreToplamBeyannameSaylarveFaturaTutarlar',
          chartType: 'bar',
          title: t('total_invoice_amount'),
          byParameter: t('by_month') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: "#ffffff",
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TedarikilereGreBeyannameSaylarveFaturaTutarlar/TedarikilereGreBeyannameSaylar',
          chartType: 'progress',
          title: t('total_number_of_decs') + ' (Top 5)',
          byParameter: t('by_suppliers') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        }
      ]
    },
    {
      type: 'item',
      data:
        [
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreKalemSaylar/YllaraGreKalemSaylar",
            chartType: 'card',
            title: t('total_number_of_items'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreFaturaTutar/YllaraGreFaturaTutar",
            chartType: 'card',
            title: t('total_invoice_amount'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff"
            }
          },
        ]
    },
    {
      type: 'item',
      data:
        [
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreKymet/YllaraGreKymet",
            chartType: 'card',
            title: t('total_value'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreToplamKap/YllaraGreToplamKap",
            chartType: 'card',
            title: t('total_number_of_packages'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 212) / 2,
              backgroundColor: "#ffffff"
            }
          },
        ]
    },
    {
      type: 'item',
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/views/KalemListesi-BeyanTipineGreKalemSaylarveFaturaTutarlar/BeyanTipineGreKalemSaylar',
          chartType: 'pie',
          title: t('total_number_of_decs'),
          byParameter: t('by_dec_type') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/KalemListesi-TamaeklineGreKalemSaylarveFaturaTutarlar/TamaeklineGreKalemSaylar',
          chartType: 'pie',
          title: t('total_number_of_decs'),
          byParameter: t('by_transportation_type') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        },
      ]
    },
    {
      type: 'item',
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/KalemListesi-AylaraGreKalemSaylarveFaturaTutarlar/AylaraGreKalemSaylar',
          chartType: 'bar',
          title: t('total_invoice_amount'),
          byParameter: t('by_month') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: "#ffffff"
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/KalemListesi-TedarikilereGreKalemSaylarveFaturaTutarlar/TedarikilereGreKalemSaylar',
          chartType: 'progress',
          title: t('total_number_of_decs') + ' (Top 5)',
          byParameter: t('by_suppliers') + ' - ' + filter.vf_Yıl,
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 212) / 2,
            backgroundColor: '#ffffff'
          }
        }
      ]
    }
  ];

  const tabs = [
    {
      id: 'declaration',
      title: t('declaration'),
    },
    {
      id: 'item',
      title: t('item'),
    },
    {
      id: 'tareks',
      title: t('tareks'),
    },
  ];
  const [tab, setTab] = useState(tabs[0]);

  useFocusEffect(
    useCallback(() => {
      getRequestIdRequest(selectedAuthorizedFirm).then(requestIdResponse => {
        setRequestId(requestIdResponse.data.requestId)
        setTableauToken(requestIdResponse.data.token)
      })

      return () => {
        dispatch({ type: 'DASHBOARD_INIT' });
      };
    }, [tab, selectedAuthorizedFirm, filter])
  )

  useEffect(() => {
    setDashboardData(DashboardData.filter((data) => data.type === tab.id));
  }, [tab]);

  useEffect(() => {
    const onChange = () => {
      setDashboardData([]);
      setTab(tabs[0]);
    };
    i18n.on('languageChanged', onChange);
    return () => i18n.off('languageChanged', onChange);
  }, []);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  const renderContent = () => {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 16,
            paddingLeft: 8,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flex: 1, alignItems: "flex-start" }}>
            <Tag
              gray
              style={{
                borderRadius: 3,
                backgroundColor: BaseColor.kashmir,
                paddingVertical: 3,
              }}
              textStyle={{
                paddingHorizontal: 4,
                fontSize: 15,
                color: BaseColor.whiteColor,
              }}
              icon={<Icon name="sliders-h" color={BaseColor.whiteColor} size={15} />}
              onPress={() => navigation.navigate("PDashboardFilter")}
            >
              {t("filter")}
            </Tag>
          </View>
        </View>

        <TabTag
          style={{ height: 30, marginTop: 10 }}
          tabs={tabs}
          tab={tab}
          onChange={(tabData) => setTab(tabData)}
        />

        {dashboardData && <FlatList
          contentContainerStyle={styles.paddingFlatList}
          horizontal
          data={dashboardData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <Dashboard
              data={item.data}
              requestId={requestId}
              tableauToken={tableauToken}
              style={{
                margin: 10,
              }}
            />
          )}
        />}
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header title={t('dashboard')}
        renderLeft={() => {
          if (authorizedFirms) {
            return (
              <TouchableOpacity style={[styles.container, { borderColor: colors.border }]} onPress={() => navigation.navigate('PAuthorizedFirmFilter')}>
                <Text numberOfLines={2} style={{ width: 95 }}>{authorizedFirms.filter(f => f.musteriid == selectedAuthorizedFirm)[0].name}</Text>
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
          goToPage('MNotification');
        }} />
      {renderContent()}
    </SafeAreaView>
  );
};

export default PHome;
