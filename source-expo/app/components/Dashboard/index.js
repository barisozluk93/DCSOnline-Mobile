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

  const [workbookReady, setWorkbookReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ aynı viz için AUTH_EXPIRED spam engeli
  const refreshLockRef = useRef(false);

  // ✅ requestId başına 1 kere refresh
  const authRefreshDoneForThisRequestRef = useRef(false);

  useEffect(() => {
    setIndex(0);
    setWorkbookReady(false);
    setLoading(true);

    refreshLockRef.current = false;
    authRefreshDoneForThisRequestRef.current = false; // ✅ requestId değişince reset
  }, [tab, requestId]);

  const current = useMemo(() => {
    if (!data?.length) return null;
    const safeIndex = Math.min(Math.max(index, 0), data.length - 1);
    return data[safeIndex];
  }, [data, index]);

  const postRange = (field, min, max) => {
    if (tab !== "tareks") return;
    if (!webViewRef.current) return;
    if (!min || !max) return;

    webViewRef.current.postMessage(
      JSON.stringify({ __rn: true, type: "APPLY_RANGE", field, min, max })
    );
  };

  useEffect(() => {
    if (!workbookReady) return;
    if (tab !== "tareks") return;

    const today = new Date();
    const yıl = today.getFullYear();
    const ay = String(today.getMonth()+1).padStart(2, '0');
    const gun = String(today.getDate()).padStart(2, '0');

    console.log('2025-01-01');

    postRange("Tescil Tarihi", filter?.vf_RegisterationStartDate ? filter?.vf_RegisterationStartDate : '2025-01-01', filter?.vf_RegisterationEndDate ? filter?.vf_RegisterationEndDate : (yıl + "-" + ay + "-" + gun));
    postRange("Başvuru Tarihi", filter?.vf_ApplicationStartDate ? filter?.vf_ApplicationStartDate : '2025-01-01' , filter?.vf_ApplicationEndDate ? filter?.vf_ApplicationEndDate : (yıl + "-" + ay + "-" + gun));
  }, [workbookReady, tab, filter, index]);

  const currentHtml = useMemo(() => {
    if (!current || !tableauToken || !requestId) return "";

    const isTareks = tab === "tareks";
    const isDec = tab === "declaration";
    const isItem = tab === "item";

    const requestIdParam = requestId
      ? `<viz-parameter name="RequestParam" value="${requestId}"></viz-parameter>`
      : "";
      
      const requestIdFilter = requestId
        ? `<viz-filter field="requestid" value="${requestId}"></viz-filter>`
        : "";

      const yilFilter = filter?.["vf_Yıl"]
          ? `<viz-filter field="Yıl" value="${filter["vf_Yıl"]}"></viz-filter>`
          : `<viz-filter field="Yıl" value="2026"></viz-filter>`;
      

      const beyanTipiFilter = filter?.["vf_Beyan Tipi"]
        ? `<viz-filter field="Beyan Tipi" value="${filter["vf_Beyan Tipi"]}"></viz-filter>`
        : "";

      const tasimaFilter = filter?.["vf_Taşıma Şekli"]
        ? `<viz-filter field="Taşıma Şekli" value="${filter["vf_Taşıma Şekli"]}"></viz-filter>`
        : "";

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  html, body {
    margin: 0; padding: 0; width: 100%; height: 100%;
    overflow: hidden; background: #fff !important;
  }
  #vizWrap {
    position: fixed; inset: 0; width: 100%; height: 100%;
    overflow: hidden; background: #fff !important;
  }
  tableau-viz {
    width: 100% !important; 
    height: 100% !important;
    display: block; background: #fff !important;
  }
  iframe {
    width: 100% !important; height: 100% !important;
    border: 0 !important; background: #fff !important;
  }
</style>

<script type="module" src="https://reports.dcscustoms.com.tr/javascripts/api/tableau.embedding.3.latest.min.js"></script>

<script type="module">
  function sendToRN(payload) {
    try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload)); } catch (_) {}
  }

  function getViz() { return document.getElementById('tableau-viz'); }

  function toUtcDateFromYmd(ymd) {
    if (typeof ymd !== 'string') return null;
    const m = ymd.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
    if (!m) return null;
    return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }

  function normalizeDate(v) {
    if (typeof v === 'string') {
      const utc = toUtcDateFromYmd(v);
      if (utc) return utc;
      const dt = new Date(v);
      return isNaN(dt.getTime()) ? v : dt;
    }
    return v;
  }

  function getAllWorksheets(activeSheet) {
    if (!activeSheet) return [];
    if (activeSheet.worksheets && activeSheet.worksheets.length) return activeSheet.worksheets;
    return [activeSheet];
  }

  const pending = [];
  let workbookReady = false;

  const fieldToSheets = new Map();

  async function discoverWorksheetsForField(field) {
    if (fieldToSheets.has(field)) return fieldToSheets.get(field);

    const viz = getViz();
    const activeSheet = viz && viz.workbook ? viz.workbook.activeSheet : null;
    const sheets = getAllWorksheets(activeSheet);

    const matched = [];
    for (let i = 0; i < sheets.length; i++) {
      const ws = sheets[i];
      try {
        if (!ws || typeof ws.getFiltersAsync !== 'function') continue;
        const filters = await ws.getFiltersAsync();
        const has = (filters || []).some(function (f) {
          const name = ((f && (f.fieldName || f.fieldCaption)) ? (f.fieldName || f.fieldCaption) : "") + "";
          return name.toLowerCase() === (field + "").toLowerCase();
        });
        if (has) matched.push(ws.name);
      } catch (_) {}
    }

    fieldToSheets.set(field, matched);
    return matched;
  }

  async function applyRangeNow(field, rawMin, rawMax) {
    const viz = getViz();
    if (!viz || !viz.workbook) throw new Error('workbook not ready');

    const activeSheet = viz.workbook.activeSheet;
    if (!activeSheet) throw new Error('activeSheet not ready');

    const min = normalizeDate(rawMin);
    const max = normalizeDate(rawMax);

    const allSheets = getAllWorksheets(activeSheet);

    let matchedNames = [];
    try { matchedNames = await discoverWorksheetsForField(field); } catch (_) { matchedNames = []; }

    let targetSheets = [];
    if (matchedNames && matchedNames.length) {
      targetSheets = allSheets.filter(function (ws) { return matchedNames.indexOf(ws.name) >= 0; });
    } else {
      if (allSheets[0]) targetSheets = [allSheets[0]];
    }

    let successCount = 0;
    const errors = [];

    for (let i = 0; i < targetSheets.length; i++) {
      const ws = targetSheets[i];
      try {
        await ws.applyRangeFilterAsync(field, { min: min, max: max });
        successCount += 1;
      } catch (e) {
        errors.push(String(e && e.message ? e.message : e));
      }
    }

    if (successCount === 0) {
      const firstErr = errors[0] || "unknown";
      throw new Error('Range filter failed for field="' + field + '". First error: ' + firstErr);
    }
  }

  async function flush() {
    if (!workbookReady) return;

    while (pending.length) {
      const job = pending.shift();

      try {
        await applyRangeNow(job.field, job.min, job.max);
      } catch (e) {
        const errStr = String(e && (e.message || e) ? (e.message || e) : e);

        if (errStr.indexOf("status: 401") >= 0 || errStr.indexOf(" 401") >= 0) {
          sendToRN({ type: "AUTH_EXPIRED", error: errStr });
          continue;
        }

        sendToRN({ type: "RANGE_FILTER_RESULT", ok: false, field: job.field, error: errStr });
      }
    }
  }

  function waitForWorkbook(maxTry) {
    let tries = 0;
    const limit = typeof maxTry === 'number' ? maxTry : 60;

    const tick = function () {
      tries += 1;
      const viz = getViz();
      const ok = !!(viz && viz.workbook && viz.workbook.activeSheet);

      if (ok) {
        workbookReady = true;
        sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
        flush();
        return;
      }

      if (tries >= limit) {
        sendToRN({ type: "VIZ_WORKBOOK_READY", ok: false, error: "timeout" });
        return;
      }

      setTimeout(tick, 150);
    };

    tick();
  }

  function onMsg(raw) {
    if (typeof raw !== 'string') return;
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (!msg || msg.__rn !== true) return;

    if (msg.type === "APPLY_RANGE") {
      pending.push({ field: msg.field, min: msg.min, max: msg.max });
      flush();
    }
  }

  document.addEventListener('message', function (e) { onMsg(e.data); });
  window.addEventListener('message', function (e) { onMsg(e.data); });

  function bindFirstInteractive() {
    const viz = getViz();
    if (!viz) { setTimeout(bindFirstInteractive, 50); return; }

    viz.addEventListener('firstinteractive', function () {
      waitForWorkbook(60);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindFirstInteractive);
  } else {
    bindFirstInteractive();
  }
</script>
</head>

<body>
  <div id="vizWrap">
    <tableau-viz
      id="tableau-viz"
      src="${current.id}"
      token="${tableauToken}"
      hide-tabs
      toolbar="hidden"
      device="phone">

      ${isTareks ? requestIdParam : requestIdFilter}
      ${((current.chartType !== "card") && (isDec || isItem)) && yilFilter}

      ${(isDec || isItem) && beyanTipiFilter}
      ${(isDec || isItem) && tasimaFilter}
    </tableau-viz>
  </div>
</body>
</html>`;
  }, [current, tableauToken, requestId, tab, filter]);



  const Dots = ({ count, activeIndex, onPressDot }) => {
    if (!count || count <= 1) return null;

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
          const active = i === activeIndex;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPressDot(i)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: active ? 18 : 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: active ? colors.primary : colors.border,
                opacity: active ? 1 : 0.7,
              }}
            />
          );
        })}
      </View>
    );
  };

  const onPrev = () => {
    if (!data?.length) return;
    setWorkbookReady(false);
    setLoading(true);
    refreshLockRef.current = false;
    setIndex((prev) => (prev - 1 + data.length) % data.length);
  };

  const onNext = () => {
    if (!data?.length) return;
    setWorkbookReady(false);
    setLoading(true);
    refreshLockRef.current = false;
    setIndex((prev) => (prev + 1) % data.length);
  };

  if (!current || !tableauToken || !requestId) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, current.style, { borderColor: colors.border }]}>
        <View style={styles.viewLeft}>
          {!!current.title && <Text caption3 style={{ color: "#000" }}>{current.title}</Text>}

          <WebView
            ref={webViewRef}
            style={{ marginTop: 0, height: current?.style?.height || 420, width: "100%" }}
            originWhitelist={["https://reports.dcscustoms.com.tr", "file://"]}
            source={{ html: currentHtml, baseUrl: "https://reports.dcscustoms.com.tr" }}
            mixedContentMode="always"
            allowUniversalAccessFromFileURLs
            javaScriptEnabled
            domStorageEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            onLoadStart={() => setLoading(true)}
            onMessage={async (event) => {
              try {
                const msg = JSON.parse(event.nativeEvent.data);

                if (msg.type === "VIZ_WORKBOOK_READY") {
                  setWorkbookReady(!!msg.ok);
                  setLoading(false);
                  return;
                }

                if (msg.type === "AUTH_EXPIRED") {
                  // ✅ aynı requestId için sadece 1 kere refresh
                  if (authRefreshDoneForThisRequestRef.current) return;
                  authRefreshDoneForThisRequestRef.current = true;

                  // ✅ ekstra spam engeli (aynı ekranda hızlı hızlı gelirse)
                  if (refreshLockRef.current) return;
                  refreshLockRef.current = true;

                  await onAuthExpired?.();
                  return;
                }
              } catch {
                // ignore
              }
            }}
          />

          {loading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#ffffff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1 }} />
            </View>
          )}

          <Dots
            count={data?.length || 0}
            activeIndex={index}
            onPressDot={(i) => {
              setWorkbookReady(false);
              setLoading(true);
              refreshLockRef.current = false;
              setIndex(i);
            }}
          />

          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            <TouchableOpacity
              onPress={onPrev}
              style={{ width: "30%", padding: 10, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}
            >
              <Text>◀︎ {t("prev")}</Text>
            </TouchableOpacity>

            <View style={{ width: "35%" }} />

            <TouchableOpacity
              onPress={onNext}
              style={{ width: "30%", padding: 10, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center" }}
            >
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