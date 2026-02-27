import PropTypes from 'prop-types';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { parseHexTransparency } from '@/utils';
import { useTheme } from '@/config';
import { Text } from '@/components';
import { useEffect, useState } from 'react';
import { tableauGetDataRequest } from '@/apis/tableauApi';
import { useSelector } from 'react-redux';

const ChartPieChart = ({
   data = {},
   tableauSiteId = null,
    tableauToken = null,
    requestId = null,
    signal = undefined 
  }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const { filter } = useSelector(state => state.dashboard);
  
    const parseData = (csvString) => {
      const lines = csvString.split(/\r?\n/).filter(line => line.trim() !== '');
  
      // Başlıkları al
      const headers = lines[0].split(';');
      // Objeleri oluştur
      const data = lines.slice(1).map(line => {
        const values = line.split(';');
        return headers.reduce((obj, header, idx) => {
          let value = values[idx];
  
          // Eğer sayıya çevrilebiliyorsa number yap
          if (value) {
            value = value.replace(/,/g, ''); // Binlik ayracı kaldır
            if (!isNaN(value)) {
              value = parseFloat(value);
            }
          }
  
          obj[header] = value || null;
          return obj;
        }, {});
      });
  
      return data;
    }
      
    useEffect(() => {
      const load = async () => {
        try {
          setLoading(true);
  
          const filter = { vf_requestid: requestId };
          const allRequests = [];
          
          if (data.chartType === "pie") {
            allRequests.push(
              tableauGetDataRequest(
                tableauSiteId,
                data.id,
                filter,
                tableauToken,
                signal
              ).then(result => ({ result }))
            );
          }
  
          const responses = await Promise.all(allRequests);
  
          if (signal?.aborted) {
            return;
          };
          responses.forEach(({ result }) => {
            if (!result || result === "\r\n") return;
  
            const parsedData = parseData(result);

            const satirlar = parsedData.filter(f => f["Yıl"] === filter.vf_Yıl);
            if (!satirlar) return;
  
            switch (data.id) {
            case "43d7498e-3b05-4e1c-be7c-723585352abb":
              let listBeyannameBeyanTipi = [];
              satirlar.forEach(satir => {
                let beyanTipi = satir["Beyan Tipi"];
                if (beyanTipi != null) {
                  listBeyannameBeyanTipi.push(
                    {
                      name: beyanTipi,
                      population: satir["Distinct count of beyannameid"],
                      color: beyanTipi === "AN" ? "#11b5ed" : (beyanTipi === "DI" ? "#115d78" : (beyanTipi === "EX" ? "#a7e0f7" : (beyanTipi === "IM" ? "#1387b0" : (beyanTipi === "TE" ? "#e7f5fc" : (beyanTipi === "TR" ? "#115d78" : "#17a1d6"))))),
                      legendFontColor: colors.text,
                    }
                  );
                }
              });

              data.data = listBeyannameBeyanTipi;
              break;
            case "918ddc29-f428-4a52-89f7-745568afd698":
              let listBeyannameTasimaSekli = [];
              satirlar.forEach(satir => {
                let tasimaSekli = satir["Taşıma Şekli"];
                if (tasimaSekli != null) {
                  listBeyannameTasimaSekli.push(
                    {
                      name: tasimaSekli,
                      population: satir["Distinct count of beyannameid"],
                      color: tasimaSekli === "KARA" ? "#11b5ed" : (tasimaSekli === "DENİZ" ? "#a7e0f7" : "#115d78"),
                      legendFontColor: colors.text,
                    }
                  );
                }
              });

              data.data = listBeyannameTasimaSekli;
              break;
            case "fa6f00d8-1de0-4868-bdbb-95b36c49c420":
              let listKalemBeyanTipi = [];
              satirlar.forEach(satir => {

                let kalemBeyanTipi = satir["Beyan Tipi"];
                if (kalemBeyanTipi != null) {

                  listKalemBeyanTipi.push(
                    {
                      name: kalemBeyanTipi,
                      population: satir["kalem sayısı"],
                      color: kalemBeyanTipi === "AN" ? "#11b5ed" : (kalemBeyanTipi === "DI" ? "#115d78" : (kalemBeyanTipi === "EX" ? "#a7e0f7" : (kalemBeyanTipi === "IM" ? "#1387b0" : (kalemBeyanTipi === "TE" ? "#e7f5fc" : (kalemBeyanTipi === "TR" ? "#115d78" : "#17a1d6"))))),
                      legendFontColor: colors.text,
                    }
                  );
                }
              });

              data.data = listKalemBeyanTipi;
              break;
            case "8ebb4376-4d5b-42af-8308-4f1a5586ce61":
              let listKalemTasimaSekli = [];
              satirlar.forEach(satir => {
                let kalemTasimaSekli = satir["Taşıma Şekli"];
                if (kalemTasimaSekli != null) {
                  listKalemTasimaSekli.push(
                    {
                      name: kalemTasimaSekli,
                      population: satir["kalem sayısı"],
                      color: kalemTasimaSekli === "KARA" ? "#11b5ed" : (kalemTasimaSekli === "DENİZ" ? "#a7e0f7" : "#115d78"),
                      legendFontColor: colors.text,
                    }
                  );
                }
              });

              data.data = listKalemTasimaSekli;
              break;
          }
  
          });
  
        } catch (err) {
          data.data = []
        } finally {
          setLoading(false);
        }
      }
  
      if (data) {
        load();
      }
    }, [tableauSiteId, tableauToken, requestId, filter])

  return (

    !loading && data.data && data.data.length > 0 ? <View
      style={{
        // alignItems: 'center',
        // position: 'relative',
        // justifyContent: 'center',
      }}
    >
      <PieChart
        data={data.data}
        width={Dimensions.get('window').width * 0.5} // from react-native
        height={150}
        yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          color: (_opacity = 1) => parseHexTransparency(colors.text, 30),
          labelColor: (_opacity = 1) => colors.text,
          decimalPlaces: 0,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={"0"}
        center={[40, 0]}
        // absolute
        hasLegend={false}
      />

      <View style={{
        flexDirection: 'row', // YAN YANA diz
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap', // Ekran daralırsa alt satıra geçsin
        marginTop: 10,
      }}>
        {data.data && data.data.length > 0 && data.data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}>
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: item.color,
                marginRight: 6,
                borderRadius: 3,
              }}
            />
            <Text style={{ color: item.legendFontColor, fontSize: 10 }}>
              {item.name} ({item.population})
            </Text>
          </View>
        ))}
      </View>
    </View>
      :
      <ActivityIndicator size={"large"} style={{ flex: 1 }} />
  );
};

ChartPieChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  chartConfig: PropTypes.object,
};

export default ChartPieChart;
