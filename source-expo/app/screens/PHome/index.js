import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import { BaseColor, BaseStyle, useTheme } from "@/config";
import * as Utils from "@/utils";
import { Header, Dashboard, SafeAreaView, Text, TabTag, Tag, Icon } from "@/components";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getRequestIdRequest } from "@/apis/reportApi";

const PHome = (props) => {
  const dispatch = useDispatch();
  const { navigation } = props;
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);
  const [dashboardData, setDashboardData] = useState([]);
  const [tableauToken, setTableauToken] = useState();
  const [requestId, setRequestId] = useState();
  const skipNextResetRef = useRef(false);

  const DashboardData = useMemo(() => [
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
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamFaturaTutar/YllaraGreFaturaTutar',
            chartType: 'card',
            title: t('total_invoice_amount'),
            byParameter: t('last_five_years'),
            style: {
              height: "100%",
              width: (Utils.getWidthDevice() - 28),
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamKymet/YllaraGreKymet',
            chartType: 'card',
            title: t('total_value'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-ToplamVergi/YllaraGreToplamVergi',
            chartType: 'card',
            title: t('total_tax'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-BeyanTipineGreToplamBeyannameSaylarveFaturaTutarlar/BeyanTipineGreBeyannameSaylar',
            chartType: 'pie',
            title: t('total_number_of_decs'),
            byParameter: t('by_dec_type'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TamaeklineGreBeyannameSaylarveFaturaTutarlar/TamaeklineGreBeyannameSaylar',
            chartType: 'pie',
            title: t('total_number_of_decs'),
            byParameter: t('by_transportation_type'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-AylaraGreToplamBeyannameSaylarveFaturaTutarlar/AylaraGreToplamBeyannameSaylarveFaturaTutarlar',
            chartType: 'bar',
            title: t('total_invoice_amount'),
            byParameter: t('by_month'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/BeyannameListesi-TedarikilereGreBeyannameSaylarveFaturaTutarlar/TedarikilereGreBeyannameSaylar',
            chartType: 'progress',
            title: t('total_number_of_decs') + ' (Top 5)',
            byParameter: t('by_suppliers'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
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
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreFaturaTutar/YllaraGreFaturaTutar",
            chartType: 'card',
            title: t('total_invoice_amount'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreKymet/YllaraGreKymet",
            chartType: 'card',
            title: t('total_value'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: "https://reports.dcscustoms.com.tr/views/KalemListesi-YllaraGreToplamKap/YllaraGreToplamKap",
            chartType: 'card',
            title: t('total_number_of_packages'),
            byParameter: t('last_five_years'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/KalemListesi-BeyanTipineGreKalemSaylarveFaturaTutarlar/BeyanTipineGreKalemSaylar',
            chartType: 'pie',
            title: t('total_number_of_items'),
            byParameter: t('by_dec_type'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/KalemListesi-TamaeklineGreKalemSaylarveFaturaTutarlar/TamaeklineGreKalemSaylar',
            chartType: 'pie',
            title: t('total_number_of_items'),
            byParameter: t('by_transportation_type'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/KalemListesi-AylaraGreKalemSaylarveFaturaTutarlar/AylaraGreKalemSaylar',
            chartType: 'bar',
            title: t('total_invoice_amount'),
            byParameter: t('by_month'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/KalemListesi-TedarikilereGreKalemSaylarveFaturaTutarlar/TedarikilereGreKalemSaylar',
            chartType: 'progress',
            title: t('total_number_of_items') + ' (Top 5)',
            byParameter: t('by_suppliers'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent"
            }
          }
        ]
    },
    {
      type: 'tareks',
      data:
        [
          {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-ToplamBeyanname/BeyannameSays',
            chartType: 'card',
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-ToplamBavuru/ToplamBavuru',
            chartType: 'card',
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          }, {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-AylaraGreBavuruSaylarveYzdelikDalm/AylaraGreBavuruSaylar',
            chartType: 'bar',
            title: t('tareks_distribution'),
            byParameter: t('by_month'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-DurumlaraGreBavuruSaylarveYzdelikDalm/DurumlaraGreBavuruSaylar',
            chartType: 'bar',
            title: t('tareks_distribution'),
            byParameter: t('by_situation'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-AylaraGreBavuruSaylarveDeiimOranlar/AylaraGreDeiimoran',
            chartType: 'bar',
            title: t('tareks_change'),
            byParameter: t('by_month'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          },
          {
            id: 'https://reports.dcscustoms.com.tr/views/TareksRaporu-MenelkelerineGreYllkBavuruSaylarveYzdelikDalm/MeneBazlDeiimoran',
            chartType: 'bar',
            title: t('tareks_distribution'),
            byParameter: t('by_origin'),
            style: {
              width: (Utils.getWidthDevice() - 28),
              height: "100%",
              backgroundColor: "transparent",
            }
          }
        ]
    },
  ]);

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


  // ✅ token refresh spam engelleri
  const refreshInFlight = useRef(false);
  const lastRefreshAtRef = useRef(0);
  const timerRef = useRef(null);

  const getRemainingTime = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp - currentTime;
    } catch {
      return 0;
    }
  };

  const refreshToken = useCallback(async () => {
    const now = Date.now();

    if (now - lastRefreshAtRef.current < 10_000) return;

    if (refreshInFlight.current) return;
    refreshInFlight.current = true;

    try {
      const res = await getRequestIdRequest(selectedAuthorizedFirm);
      setTableauToken(res.data.token);
      setRequestId(res.data.requestId);
      lastRefreshAtRef.current = Date.now();
    } finally {
      refreshInFlight.current = false;
    }
  }, [selectedAuthorizedFirm]);

  useFocusEffect(
    useCallback(() => {
      if (skipNextResetRef.current) {
        skipNextResetRef.current = false;
        return;
      }
      dispatch({ type: "DASHBOARD_INIT" });
    }, [dispatch])
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const clearTimer = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };

      const scheduleNext = (token) => {
        const remainingSeconds = getRemainingTime(token);

        const safeRemaining = Number.isFinite(remainingSeconds) ? remainingSeconds : 0;
        const refreshInMs =
          safeRemaining > 90 ? (safeRemaining - 60) * 1000 : 60 * 1000;

        clearTimer();
        timerRef.current = setTimeout(async () => {
          if (cancelled) return;
          await refreshToken();
        }, refreshInMs);
      };

      const load = async () => {
        try {
          const res = await getRequestIdRequest(selectedAuthorizedFirm);
          if (cancelled) return;

          setTableauToken(res.data.token);
          setRequestId(res.data.requestId);
          lastRefreshAtRef.current = Date.now();

          scheduleNext(res.data.token);
        } catch (e) {
          // istersen logla
        }
      };

      load();

      return () => {
        cancelled = true;
        clearTimer();
      };
    }, [selectedAuthorizedFirm, refreshToken])
  );

  useEffect(() => {
    if (dashboardData && dashboardData[0] && (dashboardData[0].type === 'declaration' || dashboardData[0].type === 'item') && tab.id === 'tarkes') {
      dispatch({ type: 'DASHBOARD_INIT' });
    }
    else if (dashboardData && dashboardData[0] && dashboardData[0].type === 'tareks' && (tab.id === 'declaration' || tab.id === 'item')) {
      dispatch({ type: 'DASHBOARD_INIT' });
    }

    setDashboardData(DashboardData.filter((d) => d.type === tab.id));
  }, [tab]);

  useEffect(() => {
    const onChange = () => {
      setDashboardData([]);
      setTab(tabs[0]);
    };
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, []);

  const renderContent = () => (
    <View style={{ flex: 1, backgroundColor: colors.card }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingLeft: 8,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          backgroundColor: colors.background
        }}
      >
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Tag
            gray
            style={{
              borderRadius: 3,
              backgroundColor: colors.primary,
              paddingVertical: 3,
              height: 25,
            }}
            textStyle={{
              paddingHorizontal: 4,
              fontSize: 15,
              color: BaseColor.whiteColor,
            }}
            icon={<Icon name="filter" color={BaseColor.whiteColor} size={15} />}
            onPress={() => { skipNextResetRef.current = true; navigation.navigate("PDashboardFilter", { item: { tab: tab.id } }) }}
          >
            {t("filter")}
          </Tag>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
          height: 40
        }}
      >
        <TabTag
          style={{}}
          tabs={tabs}
          tab={tab}
          onChange={(tabData) => setTab(tabData)}
        />
      </View>

      {!!dashboardData?.length && (
        <FlatList
          contentContainerStyle={styles.paddingFlatList}
          horizontal
          data={dashboardData}
          keyExtractor={(_item, index) => index.toString()}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          renderItem={({ item }) => (
            <Dashboard
              data={item.data}
              tableauToken={tableauToken}
              requestId={requestId}
              tab={tab.id}
              onAuthExpired={refreshToken}
              style={{ margin: 10, backgroundColor: colors.background, borderRadius: 10 }}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={["right", "top", "left"]}>
      <Header
        title={t("dashboard")}
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
      />
      {renderContent()}
    </SafeAreaView>
  );
};

export default PHome;