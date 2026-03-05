import PropTypes from "prop-types";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  AppState,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/config";
import Text from "@/components/Text";
import styles from "./styles";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import WebView from "react-native-webview";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Dashboard = ({
  style = {},
  data = [],
  tableauToken,
  requestId,
  tab,
  onAuthExpired,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { filter } = useSelector((state) => state.dashboard);

  const webViewRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Resume sonrası kontrollü remount
  const [wvNonce, setWvNonce] = useState(0);
  const appStateRef = useRef(AppState.currentState);

  // Auth refresh kilitleri
  const refreshLockRef = useRef(false);
  const authRefreshDoneForThisRequestRef = useRef(false);

  // stale mesajları ignore (key ile)
  const activeKeyRef = useRef("");

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;

      if ((prev === "background" || prev === "inactive") && nextState === "active") {
        setLoading(true);
        refreshLockRef.current = false;
        authRefreshDoneForThisRequestRef.current = false;
        setWvNonce((x) => x + 1);
      }
    });

    return () => sub.remove();
  }, []);

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

  // ✅ token yok (loop sebebi olmasın)
  const webViewKey = useMemo(() => {
    return `${tab}-${requestId}-${index}-${wvNonce}--${colors}-stable`;
  }, [tab, requestId, index, wvNonce, colors]);

  activeKeyRef.current = webViewKey;

  const currentHtml = useMemo(() => {
    if (!current || !tableauToken || !requestId) return "";

    const wvKey = webViewKey;

    const isTareks = tab === "tareks";
    const isDec = tab === "declaration";
    const isItem = tab === "item";

    const today = new Date();
    const bugunYmd = today.toISOString().split("T")[0];

    const f = {
      regStart: filter?.vf_RegisterationStartDate || "2025-01-01",
      regEnd: filter?.vf_RegisterationEndDate || bugunYmd,
      appStart: filter?.vf_ApplicationStartDate || "2025-01-01",
      appEnd: filter?.vf_ApplicationEndDate || bugunYmd,
    };

    const requestIdParam = `<viz-parameter name="RequestParam" value="${requestId}"></viz-parameter>`;
    const yilFilter = `<viz-filter field="Yıl" value="${filter?.["vf_Yıl"] || "2026"}"></viz-filter>`;
    const beyanTipiFilter = filter?.["vf_Beyan Tipi"]
      ? `<viz-filter field="Beyan Tipi" value="${filter["vf_Beyan Tipi"]}"></viz-filter>`
      : "";
    const tasimaFilter = filter?.["vf_Taşıma Şekli"]
      ? `<viz-filter field="Taşıma Şekli" value="${filter["vf_Taşıma Şekli"]}"></viz-filter>`
      : "";

    const pRequest = requestIdParam;
    const pYil = current.chartType !== "card" && (isDec || isItem) ? yilFilter : "";
    const pBeyanTipi = (isDec || isItem) ? beyanTipiFilter : "";
    const pTasima = (isDec || isItem) ? tasimaFilter : "";

    const embeddingScriptSrc =
      "https://reports.dcscustoms.com.tr/javascripts/api/tableau.embedding.3.latest.min.js";

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: ${colors.background}; }
    #vizWrap { position: fixed; inset: 0; width: 100%; height: 100%; background: ${colors.background}; }
    tableau-viz { width: 100% !important; height: 100% !important; display: block; }

    /* Dashboard.js içindeki style etiketi içine ekleyin */
    .tb-loader, .tb-loading-splash, .tb-opening-workbook {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }

    /* Bazen iframe içindeki ana div'ler için */
    div[role="progressbar"], .quantum-viz-loading {
      display: none !important;
    }

    /* Her ihtimale karşı tüm loading overlay'lerini hedef alalım */
    [class*="loading"], [id*="loading"] {
      background-color: transparent !important;
    }
  </style>

  <script>
    const __wvKey = ${JSON.stringify(wvKey)};
    function sendToRN(payload) {
      try {
        payload.__wvKey = __wvKey;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      } catch (e) {}
    }

    (function preflight() {
      var scriptEl = document.createElement('script');
      var supportsModule = ('noModule' in scriptEl);
      var supportsCE = !!window.customElements;

      sendToRN({
        type: "WV_PREFLIGHT",
        supportsModule: supportsModule,
        supportsCustomElements: supportsCE,
        ua: navigator.userAgent
      });
    })();

    window.onerror = function (message, source, lineno, colno, error) {
      sendToRN({
        type: "WV_JS_ERROR",
        message: String(message),
        source: String(source || ""),
        line: lineno,
        col: colno,
        stack: error && error.stack ? String(error.stack) : "",
      });
    };

    window.addEventListener("unhandledrejection", function (event) {
      sendToRN({
        type: "WV_UNHANDLED_REJECTION",
        reason: event && event.reason ? String(event.reason) : "",
      });
    });

    sendToRN({ type: "WV_STAGE", stage: "HTML_BOOT", href: location.href });
  </script>
</head>

<body>
  <div id="vizWrap"></div>

  <script>
    (function loadEmbedding() {
      sendToRN({ type: "WV_STAGE", stage: "EMBED_SCRIPT_LOADING", src: "${embeddingScriptSrc}" });

      var s = document.createElement("script");
      s.type = "module";
      s.src = "${embeddingScriptSrc}";
      s.onload = function() {
        sendToRN({ type: "WV_STAGE", stage: "EMBED_SCRIPT_LOADED", src: s.src });
      };
      s.onerror = function(e) {
        sendToRN({ type: "WV_STAGE", stage: "EMBED_SCRIPT_ERROR", src: s.src, err: String(e) });
      };
      document.head.appendChild(s);
    })();
  </script>

  <script>
    (async function waitDefine() {
      sendToRN({ type: "WV_STAGE", stage: "WAIT_CUSTOM_ELEMENT" });
      try {
        await customElements.whenDefined("tableau-viz");
        sendToRN({ type: "WV_STAGE", stage: "CUSTOM_ELEMENT_DEFINED" });
      } catch (e) {
        sendToRN({ type: "WV_STAGE", stage: "CUSTOM_ELEMENT_DEFINE_ERROR", err: String(e) });
      }
    })();
  </script>

  <script>
    (function createViz() {
      sendToRN({ type: "WV_STAGE", stage: "CREATE_VIZ_START" });

      var wrap = document.getElementById("vizWrap");
      var viz = document.createElement("tableau-viz");
      viz.id = "tableau-viz";

      // ✅ token/src güvenli
      viz.setAttribute("src", ${JSON.stringify(current.id)});
      viz.setAttribute("token", ${JSON.stringify(tableauToken)});
      viz.setAttribute("background", "${colors.background}");
      viz.setAttribute("hide-tabs", "");
      viz.setAttribute("toolbar", "hidden");
      viz.setAttribute("device", "phone");

      function appendChildHtml(html) {
        if (!html) return;
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        while (tmp.firstChild) viz.appendChild(tmp.firstChild);
      }

      appendChildHtml(${JSON.stringify(pRequest)});
      appendChildHtml(${JSON.stringify(pYil)});
      appendChildHtml(${JSON.stringify(pBeyanTipi)});
      appendChildHtml(${JSON.stringify(pTasima)});

      wrap.appendChild(viz);

      var timer = setTimeout(function() {
        sendToRN({ type: "FIRSTINTERACTIVE_TIMEOUT" });
      }, 20000);

      viz.addEventListener("firstinteractive", function() {
        clearTimeout(timer);
        sendToRN({ type: "WV_STAGE", stage: "FIRSTINTERACTIVE_FIRED" });

        // declaration/item ise direkt hazır say
        var isTareks = ${isTareks ? "true" : "false"};
        if (!isTareks) {
          sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
          return;
        }

        function toUtcDate(ymd) {
          var parts = ymd.split("-");
          return new Date(Date.UTC(parts[0], parts[1]-1, parts[2]));
        }

        (async function applyInitialFilters() {
          try {
            if (!viz.workbook) {
              sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
              return;
            }

            var sheet = viz.workbook.activeSheet;
            var worksheets = (sheet.worksheets && sheet.worksheets.length) ? sheet.worksheets : [sheet];

            var rangeFilters = [
              { field: "Tescil Tarihi", min: "${f.regStart}", max: "${f.regEnd}" },
              { field: "Başvuru Tarihi", min: "${f.appStart}", max: "${f.appEnd}" }
            ];

            for (var wi=0; wi<worksheets.length; wi++) {
              var ws = worksheets[wi];
              for (var ri=0; ri<rangeFilters.length; ri++) {
                var rf = rangeFilters[ri];
                try {
                  await ws.applyRangeFilterAsync(rf.field, { min: toUtcDate(rf.min), max: toUtcDate(rf.max) });
                } catch (e) {}
              }
            }

            sendToRN({ type: "VIZ_WORKBOOK_READY", ok: true });
          } catch (err) {
            sendToRN({ type: "VIZ_WORKBOOK_READY", ok: false, error: String(err) });
          }
        })();
      });
    })();
  </script>
</body>
</html>`;
  }, [current, tableauToken, requestId, tab, filter, webViewKey]);

  // ✅ source objesini memoize et (bazı cihazlarda gereksiz reload’ı azaltır)
  const webViewSource = useMemo(() => {
    return { html: currentHtml, baseUrl: "https://reports.dcscustoms.com.tr" };
  }, [currentHtml]);

  const onMessage = useCallback(
    async (event) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);

        if (msg.__wvKey && msg.__wvKey !== activeKeyRef.current) return;

        if (msg.type === "WV_STAGE") console.log("WV_STAGE:", msg);
        if (msg.type === "WV_PREFLIGHT") console.log("WV_PREFLIGHT:", msg);
        if (msg.type === "WV_JS_ERROR") console.log("WV_JS_ERROR:", msg);
        if (msg.type === "WV_UNHANDLED_REJECTION") console.log("WV_UNHANDLED_REJECTION:", msg);

        if (msg.type === "VIZ_WORKBOOK_READY") {
          console.log("READY OK:", msg.ok);
          setLoading(false);
          return;
        }

        if (msg.type === "FIRSTINTERACTIVE_TIMEOUT") {
          console.log("FIRSTINTERACTIVE_TIMEOUT");
          setLoading(false);
          return;
        }

        if (msg.type === "AUTH_EXPIRED") {
          if (authRefreshDoneForThisRequestRef.current || refreshLockRef.current) return;
          authRefreshDoneForThisRequestRef.current = true;
          refreshLockRef.current = true;
          await onAuthExpired?.();
          setWvNonce((x) => x + 1);
        }
      } catch (e) { }
    },
    [onAuthExpired]
  );

  const handle401 = useCallback(async () => {
    if (authRefreshDoneForThisRequestRef.current || refreshLockRef.current) return;
    authRefreshDoneForThisRequestRef.current = true;
    refreshLockRef.current = true;
    try {
      await onAuthExpired?.();
    } finally {
      setWvNonce((x) => x + 1);
    }
  }, [onAuthExpired]);

  const onWebViewHttpError = useCallback(
    async (e) => {
      console.log("WV_httpError:", e?.nativeEvent);
      const status = e?.nativeEvent?.statusCode;
      if (status === 401) await handle401();
      else setLoading(false);
    },
    [handle401]
  );

  const onWebViewError = useCallback((e) => {
    console.log("WV_error:", e?.nativeEvent);
    setLoading(false);
  }, []);

  if (!current || !tableauToken || !requestId) return null;

  const Dots = ({ count, activeIndex, onPressDot }) => {
    if (!count || count <= 1) return null;
    return (
      <View style={{ backgroundColor: colors.background, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 20 }}>
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

  const androidProps =
    Platform.OS === "android"
      ? {
        originWhitelist: ["*"],
        thirdPartyCookiesEnabled: true,
        sharedCookiesEnabled: true,
        javaScriptCanOpenWindowsAutomatically: true,
        setSupportMultipleWindows: false,
        mixedContentMode: "always",
      }
      : {
        originWhitelist: ["https://reports.dcscustoms.com.tr"],
      };


  return (
    <View style={[styles.container, style]}>
      <View style={[styles.content, current.style, { borderColor: colors.border }]}>
        <View style={styles.viewLeft}>
          {!!current.title && <Text caption3 style={{ color: colors.text }}>{current.title}</Text>}

          {!!current.byParameter && (
            <Text style={{ fontSize: 14, color: colors.text }} headline>
              {current.byParameter}
            </Text>
          )}

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              width: "100%",
              marginVertical: 10
            }}
          />

          <WebView
            ref={webViewRef}
            key={webViewKey}
            style={{ marginVertical: current.title || current.byParameter ? 10 : 0, height: current?.style?.height || 420, width: "100%" }}
            source={webViewSource}
            javaScriptEnabled
            domStorageEnabled
            onLoadStart={() => setLoading(true)}
            onMessage={onMessage}
            onError={onWebViewError}
            onHttpError={onWebViewHttpError}
            onNavigationStateChange={(nav) => {
              console.log("WV_NAV:", {
                url: nav?.url,
                loading: nav?.loading,
                title: nav?.title,
                canGoBack: nav?.canGoBack,
              });
            }}
            {...androidProps}
          />

          {loading && (
            <View style={{ position: "absolute", inset: 0, backgroundColor: colors.background, justifyContent: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              width: "100%",
              marginVertical: 10
            }}
          />

          <Dots
            count={data?.length || 0}
            activeIndex={index}
            onPressDot={(i) => {
              setLoading(true);
              refreshLockRef.current = false;
              authRefreshDoneForThisRequestRef.current = false;
              setIndex(i);
            }}
          />
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between", // Butonları iki uca yaslar
            alignItems: "center",
            marginTop: 10,
            width: "100%",
            backgroundColor: colors.background
          }}>
            <TouchableOpacity
              onPress={() => setIndex((prev) => (prev - 1 + data.length) % data.length)}
              style={{
                flex: 1, // Eşit genişlik sağlar
                maxWidth: "45%", // Çok yayılmaması için sınır
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: colors.primary,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: colors.text }}>◀︎ {t("prev")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIndex((prev) => (prev + 1) % data.length)}
              style={{
                flex: 1,
                maxWidth: "45%",
                paddingVertical: 12,
                borderRadius: 10,
                backgroundColor: colors.primary,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ color: colors.text }}>{t("next")} ▶︎</Text>
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