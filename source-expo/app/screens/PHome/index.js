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
  const [tableauToken, setTableauToken] = useState();
  const [requestId, setRequestId] = useState();

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
              height: (Utils.heightTabView() - 140) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamFaturaTutar/YllaraGreFaturaTutar',
            chartType: 'card',
            title: t('total_invoice_amount'),
            byParameter: t('last_five_years'),
            style: {
              height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
          byParameter: t('by_dec_type'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: '#ffffff'
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TamaeklineGreBeyannameSaylarveFaturaTutarlar/TamaeklineGreBeyannameSaylar',
          chartType: 'pie',
          title: t('total_number_of_decs'),
          byParameter: t('by_transportation_type'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
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
          byParameter: t('by_month'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff",
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TedarikilereGreBeyannameSaylarveFaturaTutarlar/TedarikilereGreBeyannameSaylar',
          chartType: 'progress',
          title: t('total_number_of_decs') + ' (Top 5)',
          byParameter: t('by_suppliers'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
              height: (Utils.heightTabView() - 140) / 2,
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
          title: t('total_number_of_items'),
          byParameter: t('by_dec_type'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: '#ffffff'
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/KalemListesi-TamaeklineGreKalemSaylarveFaturaTutarlar/TamaeklineGreKalemSaylar',
          chartType: 'pie',
          title: t('total_number_of_items'),
          byParameter: t('by_transportation_type'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
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
          byParameter: t('by_month'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff"
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/KalemListesi-TedarikilereGreKalemSaylarveFaturaTutarlar/TedarikilereGreKalemSaylar',
          chartType: 'progress',
          title: t('total_number_of_items') + ' (Top 5)',
          byParameter: t('by_suppliers'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: '#ffffff'
          }
        }
      ]
    },
    {
      type: 'tareks',
      data:
        [
          {
            id: 'https://reports.dcscustoms.com.tr/#/views/TareksRaporu-ToplamBeyanname/BeyannameSays',
            chartType: 'card',
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 140) / 2,
              backgroundColor: "#ffffff",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/#/views/TareksRaporu-ToplamBavuru/ToplamBavuru',
            chartType: 'card',
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: (Utils.heightTabView() - 140) / 2,
              backgroundColor: "#ffffff",
            }
          }
        ]
    },
    {
      type: "tareks",
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/authoring/TareksRaporu-AylaraGreBavuruSaylarveDeiimOranlar/AylaraGreDeiimoran',
          chartType: 'bar',
          title: t('tareks_distribution'),
          byParameter: t('by_month'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff",
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/TareksRaporu-DurumlaraGreBavuruSaylarveYzdelikDalm/DurumlaraGreBavuruSaylar',
          chartType: 'bar',
          title: t('tareks_distribution'),
          byParameter: t('by_situation'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff",
          }
        },
      ]
    },
    {
      type: "tareks",
      data: [
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/TareksRaporu-AylaraGreBavuruSaylarveDeiimOranlar/AylaraGreDeiimoran',
          chartType: 'bar',
          title: t('tareks_change'),
          byParameter: t('by_month'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff",
          }
        },
        {
          id: 'https://reports.dcscustoms.com.tr/#/views/TareksRaporu-MenelkelerineGreYllkBavuruSaylarveYzdelikDalm/MeneBazlDeiimoran',
          chartType: 'bar',
          title: t('tareks_distribution'),
          byParameter: t('by_origin'),
          style: {
            width: (Utils.getWidthDevice() - 28),
            height: (Utils.heightTabView() - 140) / 2,
            backgroundColor: "#ffffff",
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

  const getRemainingTime = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));

      const currentTime = Math.floor(Date.now() / 1400);
      return payload.exp - currentTime; // Kalan saniye ⏱️
    } catch (e) {
      return 0;
    }
  };

  useFocusEffect(
    useCallback(() => {
      let timeoutId;

      const load = async () => {
        getRequestIdRequest(selectedAuthorizedFirm).then(requestIdResponse => {
          setTableauToken(requestIdResponse.data.token);
          setRequestId(requestIdResponse.data.requestId);

          const token = requestIdResponse.data.token;

          const remainingSeconds = getRemainingTime(token);

          const refreshIn = (remainingSeconds - 30) * 1400;

          if (refreshIn > 0) {
            timeoutId = setTimeout(() => {
              load();
            }, refreshIn);
          }
        });
      };

      load();

      return () => {
        clearTimeout(timeoutId);
      };
    }, [selectedAuthorizedFirm, tab])
  )

  useEffect(() => {
    setDashboardData([]);
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
        <TabTag
          style={{ height: 30, marginTop: 10}}
          tabs={tabs}
          tab={tab}
          onChange={(tabData) => setTab(tabData)}
        />

        {dashboardData && dashboardData.length > 0 && <FlatList
          contentContainerStyle={styles.paddingFlatList}
          horizontal
          data={dashboardData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <Dashboard
              data={item.data}
              tableauToken={tableauToken}
              requestId={requestId}
              tab={tab.id}
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
