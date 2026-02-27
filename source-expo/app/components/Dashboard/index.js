import PropTypes from 'prop-types';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/config';
import PieChart from '@/components/Chart/PieChart';
import Text from '@/components/Text';
import styles from './styles';
import { CardReport11, Icon } from '@/components';
import CombinedChart from '../Chart/CombinedChart';
import { useEffect, useState } from 'react';
import { tableauGetDataRequest } from '@/apis/tableauApi';
import { useSelector } from 'react-redux';

const Dashboard = ({
  style = {},
  data = [],
  tableauSiteId = null,
  tableauToken = null,
  requestId = null,
  signal = undefined
}) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
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

        filter.vf_requestid = requestId;
        const allRequests = [];

        data.forEach(graphic => {
            if(graphic.chartType === "card") {
              graphic.footer = filter.vf_Yıl;
            }
            else if(graphic.chartType === "bar") {
              graphic.byParameter = graphic.byParameter.split(' - ')[0] + " - " + filter.vf_Yıl;
            }
            else if(graphic.chartType === "pie") {
              graphic.byParameter = graphic.byParameter.split(' - ')[0] + " - " + filter.vf_Yıl;
            }
            else if(graphic.chartType === "progress") {
              graphic.byParameter = graphic.byParameter.split(' - ')[0] + " - " + filter.vf_Yıl;
            }

          if (graphic.chartType === "card" || graphic.chartType === "progress") {
            allRequests.push(
              tableauGetDataRequest(
                tableauSiteId,
                graphic.id,
                filter,
                tableauToken,
                signal
              ).then(result => ({ result, graphic }))
            );
          }
        });

        const responses = await Promise.all(allRequests);

        if (signal?.aborted) {
          return;
        };

        responses.forEach(({ result, graphic }) => {
          if (!result || result === "\r\n") return;

          const parsedData = parseData(result);

          const satir = parsedData.find(r => r["Yıl"] === filter.vf_Yıl);
          if (!satir) return;

          if (graphic.chartType === "card") {
            switch (graphic.id) {
              case "1030b0e3-af70-4298-ad3e-abef7e32ec8f":
              case "f297e87a-997e-44cd-a0c6-da0ca280669e":
                graphic.description = "₺" + (satir["Fatura Tutarı TL"] / 1000000).toFixed(0) + "M";
                break;

              case "e7ddb0b1-7a43-4d60-af4b-938e943bed52":
                graphic.description = "$" + (satir["Kıymet"] / 1000000).toFixed(0) + "M";
                break;
              case "fc187c3a-c2ce-4809-af12-d92fe971862c":
                graphic.description = "$" + (satir["İstatistiki Kıymet"] / 1000000).toFixed(0) + "M";
                break;

              case "32cda9a8-03a4-4125-a14b-b0eec40bf1e3":
                graphic.description = "₺" + (satir["Toplam Vergi"] / 1000000).toFixed(0) + "M";
                break;

              case "46a86dcd-b116-4b9d-b424-852f92ad317e":
                graphic.description = satir["kalem sayısı"];
                break;

              case "87151237-af5c-4581-a57a-40149acbb09e":
                graphic.description = satir["Toplam Kap"];
                break;
              case "351056cc-f486-4217-8b29-4d76f36347b9":
                graphic.description = satir["beyanname sayısı"];
                break;
            }
          }
          else if (graphic.chartType === "progress") {
            const satirlar = parsedData.filter(f => f["Yıl"] === filter.vf_Yıl);
            switch (graphic.id) {
              case "0c0cb4da-cce1-4a63-b0ed-0872d53cd168":
                const uniqueSorted = satirlar.sort((a, b) =>
                (b["% of Total Distinct count of beyannameid"] -
                  a["% of Total Distinct count of beyannameid"])
                );
                let listBeyannameProgress = [];
                let id = 1;
                uniqueSorted.forEach(satir => {
                  let name = satir["Gönderici Fix"];

                  if (!listBeyannameProgress.find(f => f.name === name) || listBeyannameProgress.find(f => f.name === name).length === 0) {
                    let percentage = satir["% of Total Distinct count of beyannameid"];
                    listBeyannameProgress.push(
                      {
                        id: id,
                        name: satir["Gönderici Fix"],
                        numberOfDec: satir["Distinct count of beyannameid"],
                        percent: parseFloat(percentage.substring(0, percentage.length - 1)).toFixed(2)
                      }
                    );

                    id++;
                  }
                });

                graphic.data = listBeyannameProgress;
                break;
              case "a97658f5-2588-4c99-b2ee-776875cc9418":
                let listKalemProgress = [];
                let idKalem = 1;
                satirlar.forEach(satir => {
                  listKalemProgress.push(
                    {
                      id: idKalem,
                      name: satir["Gönderici Fix"],
                      numberOfDec: satir["Distinct count of kalemid"],
                      percent: satir["% of Total kalem sayısı"]
                    }
                  );

                  idKalem++;
                });

                graphic.data = listKalemProgress;
                break;
            }
          }
        });

        let temp = [];
        for (let i = 0; i < data.length; i += 2) {
          temp.push(data.slice(i, i + 2));
        }

        setRows(temp)

      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    if (data && data.length > 0) {
      let temp = [];
      for (let i = 0; i < data.length; i += 2) {
        temp.push(data.slice(i, i + 2));
      }
      setRows(temp);

      load();
    }
  }, [tableauSiteId, tableauToken, requestId, filter])

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
                  <Text caption3>{item.title}</Text>
                  {item.byParameter && <Text style={{ fontSize: 14 }} headline>{item.byParameter}</Text>}
                  {!loading && item.chartType === 'card' && <Text headline style={styles.description}>
                    {item.description}
                  </Text>}
                  {loading && item.chartType === 'card' && <ActivityIndicator size={"large"} style={{ flex: 1, alignItems: "center" }} />}

                  {!item.description && item.chartType === 'pie' &&
                    <PieChart
                      data={item}
                      tableauSiteId={tableauSiteId}
                      tableauToken={tableauToken}
                      requestId={requestId}
                      signal={signal} />
                  }
                  {!loading && !item.description && item.chartType === 'progress' &&
                    item.data.map((item, index) => (
                      <CardReport11
                        key={index}
                        name={item.name}
                        percent={item.percent}
                        numberOfDec={item.numberOfDec}
                      />
                    ))
                  }
                  {loading && item.chartType === 'progress' && <ActivityIndicator size={"large"} style={{ flex: 1, alignItems: "center" }} />}

                  {!item.description && item.chartType === 'bar' &&
                    <CombinedChart
                      data={item}
                      tableauSiteId={tableauSiteId}
                      tableauToken={tableauToken}
                      requestId={requestId}
                      signal={signal}
                    />
                  }
                </View>
                <View style={styles.viewRight}>
                  <Icon name={item.icon} size={30} color={"white"} />
                </View>
                <View>
                  <Text light caption3 style={styles.footer}>{item.footer}</Text>
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
  tableauSiteId: PropTypes.string,
  tableauToken: PropTypes.string,
  data: PropTypes.array,
};

export default Dashboard;
