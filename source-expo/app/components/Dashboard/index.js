import PropTypes from "prop-types";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/config";
import Text from "@/components/Text";
import styles from "./styles";
import { useEffect, useMemo, useRef, useState } from "react";
import WebView from "react-native-webview";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Dashboard = ({ style = {}, data = [], tableauToken, requestId, tab, onAuthExpired }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { filter } = useSelector((state) => state.dashboard);

  const webViewRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Auth refresh kilitleri
  const refreshLockRef = useRef(false);
  const authRefreshDoneForThisRequestRef = useRef(false);

  useEffect(() => {
    setIndex(0);
    setLoading(true);
    refreshLockRef.current = false;
    authRefreshDoneForThisRequestRef.current = false;
  }, [tab, requestId]);

  const current = useMemo(() => {
    if (!data?.length) return null;
    const safeIndex = Math.min(Math.max(index, 0), data.length - 1);
    return data[safeIndex];
  }, [data, index]);

  const currentHtml = useMemo(() => {
    if (!current || !tableauToken || !requestId) return "";

    const isTareks = tab === "tareks";
    const isDec = tab === "declaration";
    const isItem = tab === "item";

    // Tarih hazırlığı
    const today = new Date();
    const bugunYmd = today.toISOString().split('T')[0];
    
    // Filtre değerlerini JS içine güvenli aktarmak için hazırlıyoruz
    const f = {
      regStart: filter?.vf_RegisterationStartDate || '2025-01-01',
      regEnd: filter?.vf_RegisterationEndDate || bugunYmd,
      appStart: filter?.vf_ApplicationStartDate || '2025-01-01',
      appEnd: filter?.vf_ApplicationEndDate || bugunYmd
    };

    const requestIdParam = `<viz-parameter name="RequestParam" value="${requestId}"></viz-parameter>`;
    const requestIdFilter = `<viz-filter field="requestid" value="${requestId}"></viz-filter>`;
    const yilFilter = `<viz-filter field="Yıl" value="${filter?.["vf_Yıl"] || "2026"}"></viz-filter>`;
    const beyanTipiFilter = filter?.["vf_Beyan Tipi"] ? `<viz-filter field="Beyan Tipi" value="${filter["vf_Beyan Tipi"]}"></viz-filter>` : "";
    const tasimaFilter = filter?.["vf_Taşıma Şekli"] ? `<viz-filter field="Taşıma Şekli" value="${filter["vf_Taşıma Şekli"]}"></viz-filter>` : "";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
    #vizWrap { position: fixed; inset: 0; width: 100%; height: 100%; background: #fff; }
    tableau-viz { width: 100% !important; height: 100% !important; display: block; }
  </style>
  <script type="module" src="https://reports.dcscustoms.com.tr/javascripts/api/tableau.embedding.3.latest.min.js"></script>
</head>
<body>
  <div id="vizWrap">
    <tableau-viz id="tableau-viz" src="${current.id}" token="${tableauToken}" hide-tabs toolbar="hidden" device="phone">
      ${isTareks ? requestIdParam : requestIdFilter}
      ${((current.chartType !== "card") && (isDec || isItem)) ? yilFilter : ""}
      ${(isDec || isItem) ? beyanTipiFilter : ""}
      ${(isDec || isItem) ? tasimaFilter : ""}
    </tableau-viz>
  </div>

  <script type="module">
    const viz = document.getElementById('tableau-viz');
    
    function sendToRN(payload) {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(payload));
    }

    function toUtcDate(ymd) {
      const parts = ymd.split('-');
      return new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
    }

    async function applyInitialFilters() {
      if (!viz.workbook) return;
      
      const isTareks = ${isTareks};
      if (!isTareks) {
        sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
        return;
      }

      try {
        const sheet = viz.workbook.activeSheet;
        const worksheets = sheet.worksheets && sheet.worksheets.length ? sheet.worksheets : [sheet];
        
        const rangeFilters = [
          { field: "Tescil Tarihi", min: "${f.regStart}", max: "${f.regEnd}" },
          { field: "Başvuru Tarihi", min: "${f.appStart}", max: "${f.appEnd}" }
        ];

        for (const ws of worksheets) {
          for (const rf of rangeFilters) {
            try {
              await ws.applyRangeFilterAsync(rf.field, { 
                min: toUtcDate(rf.min), 
                max: toUtcDate(rf.max) 
              });
            } catch (e) { console.warn(rf.field + " uygulanamadı"); }
          }
        }
        sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
      } catch (err) {
        if (String(err).includes("401")) {
          sendToRN({ type: "AUTH_EXPIRED", error: "401 during filter" });
        } else {
          sendToRN({ type: "VIZ_WORKBOOK_READY", ok: false, error: String(err) });
        }
      }
    }

    viz.addEventListener('firstinteractive', () => {
      applyInitialFilters();
    });
  </script>
</body>
</html>`;
  }, [current, tableauToken, requestId, tab, filter]);

  const onMessage = async (event) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "VIZ_WORKBOOK_READY") {
        setLoading(false);
      } else if (msg.type === "AUTH_EXPIRED") {
        if (authRefreshDoneForThisRequestRef.current || refreshLockRef.current) return;
        authRefreshDoneForThisRequestRef.current = true;
        refreshLockRef.current = true;
        await onAuthExpired?.();
      }
    } catch (e) {}
  };

  if (!current || !tableauToken || !requestId) return null;

  const Dots = ({ count, activeIndex, onPressDot }) => { if (!count || count <= 1) return null; return ( <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 20, }} > {Array.from({ length: count }).map((_, i) => { const active = i === activeIndex; return ( <TouchableOpacity key={i} onPress={() => onPressDot(i)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: active ? 18 : 8, height: 8, borderRadius: 999, backgroundColor: active ? colors.primary : colors.border, opacity: active ? 1 : 0.7, }} /> ); })} </View> ); };
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, current.style, { borderColor: colors.border }]}>
        <View style={styles.viewLeft}>
          {!!current.title && <Text caption3 style={{ color: "#000" }}>{current.title}</Text>}
          {!!current.byParameter && (
            <Text style={{ fontSize: 14, color: "#000000" }} headline>
              {current.byParameter}
            </Text>
          )}

          <WebView
            ref={webViewRef}
            style={{ marginTop: 0, height: current?.style?.height || 420, width: "100%" }}
            originWhitelist={["https://reports.dcscustoms.com.tr"]}
            source={{ html: currentHtml, baseUrl: "https://reports.dcscustoms.com.tr" }}
            key={`${tab}-${requestId}-${index}-${tableauToken}`}
            javaScriptEnabled
            domStorageEnabled
            onLoadStart={() => setLoading(true)}
            onMessage={onMessage}
          />

          {loading && (
            <View style={{ position: "absolute", inset: 0, backgroundColor: "#fff", justifyContent: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          <Dots count={data?.length || 0} activeIndex={index} onPressDot={(i) => { setWorkbookReady(false); setLoading(true); refreshLockRef.current = false; setIndex(i); }} />

          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
             <TouchableOpacity onPress={() => setIndex(prev => (prev - 1 + data.length) % data.length)} style={{ width: "30%", padding: 10, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}>
               <Text>◀︎ {t("prev")}</Text>
             </TouchableOpacity>
             <View style={{ width: "35%" }} />
             <TouchableOpacity onPress={() => setIndex(prev => (prev + 1) % data.length)} style={{ width: "30%", padding: 10, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}>
               <Text>{t("next")} ▶︎</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

Dashboard.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
  tableauToken: PropTypes.string,
  requestId: PropTypes.string,
  tab: PropTypes.string,
  onAuthExpired: PropTypes.func,
};

export default Dashboard;