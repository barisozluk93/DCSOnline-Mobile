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
  requestId = null,
  tableauToken = null
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const { filter } = useSelector(state => state.dashboard);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const requestIdTag = requestId ? `<viz-filter field="requestid" value="${requestId}"></viz-filter>`: "";
        const yilTag = filter["vf_Yıl"] ? `<viz-filter field="Yıl" value="${filter["vf_Yıl"]}"></viz-filter>`: "";
        const tasimaSekliTag = filter["vf_Taşıma Şekli"] ? `<viz-filter field="Taşıma Şekli" value="${filter["vf_Taşıma Şekli"]}"></viz-filter>`: "";
        const beyanTipiTag = filter["vf_Beyan Tipi"] ? `<viz-filter field="Beyan Tipi" value="${filter["vf_Beyan Tipi"]}"></viz-filter>`: "";

        data.forEach(graphic => {
          if(graphic.chartType !== 'card') {
            graphic.byParameter = graphic.byParameter.split(' - ')[0] + " - " + filter.vf_Yıl;
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
  import { TableauViz } from 'https://reports.dcscustoms.com.tr/javascripts/api/tableau.embedding.3.latest.min.js';
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

  ${requestIdTag}
  ${graphic.chartType !== 'card' ? yilTag : ''}
  ${tasimaSekliTag}
  ${beyanTipiTag}

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


    if (data && data.length > 0 && filter && requestId, tableauToken) {
      let temp = [];
      for (let i = 0; i < data.length; i += 1) {
        temp.push(data.slice(i, i + 1));
      }
      setRows(temp);
      load();
    }
  }, [requestId, filter, tableauToken])

  return (
    <View style={[styles.container, style]}>
      {rows && rows.length && <View>
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
                  <Text caption3 style={{color: "#000000"}}>{item.title}</Text>
                  {item.byParameter && <Text style={{ fontSize: 14, color: "#000000"}} headline>{item.byParameter}</Text>}
                  
                  <WebView
                  style={{marginTop: 10}}
                  originWhitelist={['*']}
                  source={{ html: item.html }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  sharedCookiesEnabled={true}
                  thirdPartyCookiesEnabled={true}
                  incognito={false}
                  onMessage={(event) => {
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
  requestId: PropTypes.string,
  data: PropTypes.array,
};

export default Dashboard;
