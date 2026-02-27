import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import * as Utils from '@/utils';
import { Header, Dashboard, SafeAreaView, Text, TabTag, HeaderLargeTitleBadge, Tag, Icon } from '@/components';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { getRequestIdRequest, tableauLoginRequest } from '@/apis/reportApi';
import { useRef } from "react";

const PHome = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState([]);
  const [requestId, setRequestId] = useState();
  const [tableauToken, setTableauToken] = useState([]);
  const [tableauSiteId, setTableauSiteId] = useState([]);
  const controllerRef = useRef(null);
  const { filter } = useSelector(state => state.dashboard);

  const DashboardData = [
    {
      type: 'declaration',
      data:
        [
          {
            id: '351056cc-f486-4217-8b29-4d76f36347b9',
            chartType: 'card',
            title: t('total_number_of_decs'),
            description: null,
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "file-invoice",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#58D68D",
              marginRight: 8
            }
          },
          {
            id: '1030b0e3-af70-4298-ad3e-abef7e32ec8f',
            chartType: 'card',
            title: t('total_invoice_amount'),
            description: null,
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "receipt",
            style: {
              height: (Utils.heightTabView() - 212) / 4,
              width: (Utils.getWidthDevice() - 28) / 2,
              backgroundColor: "#E5634D"
            }
          },
          {
            id: 'fc187c3a-c2ce-4809-af12-d92fe971862c',
            chartType: 'card',
            title: t('total_value'),
            description: null,
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "dollar-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#5DADE2",
              marginRight: 8

            }
          },
          {
            id: '32cda9a8-03a4-4125-a14b-b0eec40bf1e3',
            chartType: 'card',
            title: t('total_tax'),
            description: null,
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "lira-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#FDC60A"
            }
          },
          {
            id: '743f4fab-887e-4379-bd86-ae6d78de7ea0',
            chartType: 'bar',
            title: t('total_invoice_amount'),
            description: null,
            footer: '',
            byParameter: t('by_month') + ' - ' + filter.vf_Yıl,
            data: [
              {
                labels: [0],
                datasets: [
                  {
                    data: [0]
                  }
                ]
              },
              {
                labels: [],
                datasets: [
                  {
                    data: []
                  }
                ],
                legend: ["₺M"]
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 212) / 2,
            }
          },
        ]
    },
    {
      type: 'declaration',
      data:
        [
          {
            id: '43d7498e-3b05-4e1c-be7c-723585352abb',
            chartType: 'pie',
            title: t('total_number_of_decs'),
            description: null,
            footer: '',
            byParameter: t('by_dec_type') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 192) / 2,
              marginRight: 8
            }
          },
          {
            id: '918ddc29-f428-4a52-89f7-745568afd698',
            chartType: 'pie',
            title: t('total_number_of_decs'),
            description: null,
            footer: '',
            byParameter: t('by_transportation_type') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 192) / 2,
            }
          },
          {
            id: '0c0cb4da-cce1-4a63-b0ed-0872d53cd168',
            chartType: 'progress',
            title: t('total_number_of_decs') + ' (Top 5)',
            description: null,
            footer: '',
            byParameter: t('by_suppliers') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 212) / 2
            }
          },
        ]
    },
    {
      type: 'item',
      data:
        [
          {
            id: "46a86dcd-b116-4b9d-b424-852f92ad317e",
            chartType: 'card',
            title: t('total_number_of_items'),
            description: '15.652',
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "pencil-ruler",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#58D68D",
              marginRight: 8
            }
          },
          {
            id: "f297e87a-997e-44cd-a0c6-da0ca280669e",
            chartType: 'card',
            title: t('total_invoice_amount'),
            description: '₺17.252M',
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "receipt",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#E5634D"
            }
          },
          {
            id: "e7ddb0b1-7a43-4d60-af4b-938e943bed52",
            chartType: 'card',
            title: t('total_value'),
            description: '$451M',
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "dollar-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#5DADE2",
              marginRight: 8

            }
          },
          {
            id: "87151237-af5c-4581-a57a-40149acbb09e",
            chartType: 'card',
            title: t('total_number_of_packages'),
            description: '21.462.196',
            footer: filter.vf_Yıl,
            byParameter: '',
            icon: "box",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 212) / 4,
              backgroundColor: "#FDC60A"
            }
          },
          {
            id: '711969e1-e2f5-4332-ab93-d09e0a01fee2',
            chartType: 'bar',
            title: t('total_invoice_amount'),
            description: '',
            footer: '',
            byParameter: t('by_month') + ' - ' + filter.vf_Yıl,
            data: [
              {
                labels: [0],
                datasets: [
                  {
                    data: [0]
                  }
                ]
              },
              {
                labels: [],
                datasets: [
                  {
                    data: []
                  }
                ],
                legend: ["₺M"]
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 212) / 2
            }
          },
        ]
    },
    {
      type: 'item',
      data:
        [
          {
            id: 'fa6f00d8-1de0-4868-bdbb-95b36c49c420',
            chartType: 'pie',
            title: t('total_number_of_items'),
            description: '',
            footer: '',
            byParameter: t('by_dec_type') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 192) / 2,
              marginRight: 8

            }
          },
          {
            id: '8ebb4376-4d5b-42af-8308-4f1a5586ce61',
            chartType: 'pie',
            title: t('total_number_of_items'),
            description: '',
            footer: '',
            byParameter: t('by_transportation_type') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 192) / 2
            }
          },
          {
            id: "a97658f5-2588-4c99-b2ee-776875cc9418",
            chartType: 'progress',
            title: t('total_number_of_items') + " (Top 5)",
            description: '',
            footer: '',
            byParameter: t('by_suppliers') + ' - ' + filter.vf_Yıl,
            data: [],
            style: {
              width: Utils.getWidthDevice() - 20,
              height: (Utils.heightTabView() - 212) / 2
            }
          },
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
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      getRequestIdRequest(selectedAuthorizedFirm).then(requestIdResponse => {
        setRequestId(requestIdResponse.data.requestId)
        tableauLoginRequest().then(loginResponse => {
          setTableauToken(loginResponse.token)
          setTableauSiteId(loginResponse.siteId)
        })
      })

      return () => {
        dispatch({ type: 'DASHBOARD_INIT' });
        controller.abort();
      };
    }, [tab, selectedAuthorizedFirm])
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

        <FlatList
          contentContainerStyle={styles.paddingFlatList}
          horizontal
          data={dashboardData}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => (
            <Dashboard
              data={item.data}
              tableauSiteId={tableauSiteId}
              tableauToken={tableauToken}
              requestId={requestId}
              signal={controllerRef.current.signal}
              style={{
                margin: 10,
              }}
            />
          )}
        />
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
