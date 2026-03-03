import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTheme } from '@/config';
import Text from '@/components/Text';
import styles from './styles';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import WebView from 'react-native-webview';

const Dashboard = ({
  style = {},
  data = [],
  tableauToken,
  requestId,
  tab
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const requestIdParam = requestId ? `<viz-parameter name="RequestParam" value="${requestId}"></viz-parameter>` : "";
        const requestIdFilter = requestId ? `<viz-filter field="requestid" value="${requestId}"></viz-filter>` : "";
        
        data.forEach(graphic => {
          if (graphic.chartType !== 'card' && tab !== 'tareks') {
            graphic.byParameter = graphic.byParameter.split(' - ')[0];
          }

          graphic.html = `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body { margin:0; padding:0; height:100%; overflow:hidden; }
    tableau-viz { width:100%; height:100%; display:block; }
  </style>
  <script type="module">
    import { TableauViz,  TableauEventType, FilterUpdateType } from 'https://reports.dcscustoms.com.tr/javascripts/api/tableau.embedding.3.latest.min.js';
  </script>
  </head>
  <body>
  <tableau-viz
    id="tableau-viz"
    src="${graphic.id}"
    token="${tableauToken}"
    hide-tabs
    toolbar="hidden"
    device="phone">
          
    ${graphic.type === "tareks" && requestIdParam}
    ${graphic.type !== "tareks" && requestIdFilter}
  </tableau-viz>
  </body>
  </html>`;

        });

        let temp = [];
        for (let i = 0; i < data.length; i += 1) {
          temp.push(data.slice(i, i + 1));
        }

        setRows(temp)

      } catch (err) {
      } finally {
        setLoading(false);
      }
    }


    if (data && data.length > 0 && requestId && tableauToken) {
      let temp = [];
      for (let i = 0; i < data.length; i += 1) {
        temp.push(data.slice(i, i + 1));
      }
      setRows(temp);
      load();
    }
  }, [data, requestId, tableauToken])

  return (
    <View style={[styles.container, style]}>
      {tableauToken && requestId && rows && rows.length && <View>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.content,
                  item.style,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.viewLeft}>
                  {item.title && <Text caption3 style={{ color: "#000000" }}>{item.title}</Text>}
                  {item.byParameter && <Text style={{ fontSize: 14, color: "#000000" }} headline>{item.byParameter}</Text>}

                  <WebView
                    style={{ marginTop: (item.title && item.byParameter) ? 10 : 0, }}
                    originWhitelist={['https://reports.dcscustoms.com.tr', 'file://']}
                    source={{
                      html: item.html,
                      baseUrl: 'https://reports.dcscustoms.com.tr'
                    }}
                    mixedContentMode="always"
                    allowUniversalAccessFromFileURLs={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    sharedCookiesEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    incognito={false}
                    saveFormDataDisabled={false}
                    allowsInlineMediaPlayback={true}
                     onMessage={(event) => {
                      const message = JSON.parse(event.nativeEvent.data);
                      console.log(message);
                      }}
                  />

                </View>
              </View>
            ))}
          </View>
        ))}
      </View>}
    </View>
  );
};

Dashboard.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
};

export default Dashboard;
