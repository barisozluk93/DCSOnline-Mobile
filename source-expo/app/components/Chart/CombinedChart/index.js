import PropTypes from 'prop-types';
import { useTheme } from '@/config';
import { getWidthDevice } from '@/utils';
import ChartBarChart from '../BarChart';
import ChartLineChart from '../LineChart';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { tableauGetDataRequest } from '@/apis/tableauApi';
import { useSelector } from 'react-redux';

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const CombinedChart = ({
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
        
        if (data.chartType === "bar") {            
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
            case "711969e1-e2f5-4332-ab93-d09e0a01fee2":
            case "743f4fab-887e-4379-bd86-ae6d78de7ea0":
              let labels = [];
              let datasets2 = [];

              const uniqueSorted = [
                ...new Map(
                  satirlar.map(s => [s["Month of Tescil Tarihi"], s])
                ).values()
              ].sort((a, b) =>
                (monthMap[a["Month of Tescil Tarihi"]] || 0) -
                (monthMap[b["Month of Tescil Tarihi"]] || 0)
              );

              labels = uniqueSorted.map(
                s => monthMap[s["Month of Tescil Tarihi"]] || 0
              );

              datasets2 = uniqueSorted.map(s => {
                const numeric = Number(s["Fatura Tutarı TL"] ?? 0);
                return Number.isFinite(numeric)
                  ? Math.round(numeric / 1000000)
                  : 0;
              });

              data.data = [
                {
                  labels: [0],
                  datasets: [{ data: [0] }]
                },
                {
                  labels: labels,
                  datasets: [{ data: datasets2 }],
                  legend: ["₺M"]
                }
              ]

              break;
          }

        });

      } catch (err) {
        data.data = [
          {
            labels: [0],
            datasets: [{ data: [0] }]
          },
          {
            labels: [0],
            datasets: [{ data: [0] }],
            legend: ["₺M"]
          }
        ]
      } finally {
        setLoading(false);
      }
    }

    if (data) {
      load();
    }
  }, [tableauSiteId, tableauToken, requestId, filter])

  return (
    !loading && data.data ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ChartLineChart data={data.data[1]} />
      {/* {data && data.length > 0 && <ChartBarChart data={data[0]} /> } */}
    </View > :
    <View style={{height: 220, alignItems: "center"}}>
      <ActivityIndicator size={"large"} style={{flex: 1}} />
    </View>


  );
};

CombinedChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  value: PropTypes.string,
  onPress: PropTypes.func,
};

export default CombinedChart;
