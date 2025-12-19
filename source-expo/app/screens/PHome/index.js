import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme, BaseColor } from '@/config';
import * as Utils from '@/utils';
import { Header, Dashboard, SafeAreaView, Text, TabTag, HeaderLargeTitleBadge, Tag, Icon } from '@/components';
import styles from './styles';
import { useSelector } from 'react-redux';

const PHome = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { authorizedFirms, selectedAuthorizedFirm } = useSelector((state) => state.user);

  const DashboardData = [
    {
      type: 'declaration',
      data:
        [
          {
            chartType: 'card',
            title: 'Toplam Beyanname',
            description: '1.135',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "file-invoice",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#58D68D",
              marginRight: 8
            }
          },
          {
            chartType: 'card',
            title: 'Fatura Tutarı',
            description: '₺4.301M',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "receipt",
            style: {
              height: (Utils.heightTabView() - 140) / 4,
              width: (Utils.getWidthDevice() - 28) / 2,
              backgroundColor: "#E5634D"
            }
          },
          {
            chartType: 'card',
            title: 'Kıymet',
            description: '$121M',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "dollar-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#5DADE2",
              marginRight: 8

            }
          },
          {
            chartType: 'card',
            title: 'Toplam Vergi',
            description: '₺980M',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "lira-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#FDC60A"
            }
          },
          {
            chartType: 'bar',
            title: 'Fatura Tutarı',
            description: '',
            footer: '',
            byParameter: 'Aylara Göre - 2025',
            data: [
              {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                datasets: [
                  {
                    data: [6, 3, 2, 1, 2, 1, 1, 1, 1, 1]
                  }
                ]
              },
              {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                datasets: [
                  {
                    data: [79, 61, 69, 21, 7, 31, 14, 26, 4, 28]
                  }
                ],
                legend: ["₺M"]
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 140) / 2,
            }
          },
        ]
    },
    {
      type: 'declaration',
      data:
        [
          {
            chartType: 'pie',
            title: 'Toplam Beyanname',
            description: '',
            footer: '',
            byParameter: 'Beyan Tipine Göre - 2025',
            data: [
              {
                name: 'EX',
                population: 883,
                color: "#5DADE2",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'IM',
                population: 214,
                color: "#FF2D55",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'TR',
                population: 15,
                color: "#58D68D",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'AN',
                population: 13,
                color: "#e5634d",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'DI',
                population: 10,
                color: "#FDC60A",
                legendFontColor: '#7F7F7F',
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 120) / 2,
              marginRight: 8
            }
          },
          {
            chartType: 'pie',
            title: 'Toplam Beyanname',
            description: '',
            footer: '',
            byParameter: 'Taşıma Şekline Göre - 2025',
            data: [
              {
                name: 'DENİZ',
                population: 631,
                color: "#5DADE2",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'HAVA',
                population: 96,
                color: "#FF2D55",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'KARA',
                population: 408,
                color: "#58D68D",
                legendFontColor: '#7F7F7F',
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 120) / 2,
            }
          },
          {
            chartType: 'progress',
            title: 'Toplam Beyanname (Top 5)',
            description: '',
            footer: '',
            byParameter: 'Tedarikçilere Göre - 2025',
            data: [
              {
                id: 1,
                name: 'Penti Giyim Ticaret A.Ş.',
                percent: 89.78,
                numberOfDec: '896',
              },
              {
                id: 2,
                name: 'Yasmina Garments',
                percent: 4.91,
                numberOfDec: '49',
              },
              {
                id: 3,
                name: 'SHANGHAI LANSHENG LIGHT INDUSTRIAL PRODUCTS IMP. & EXP. CORP., LTD',
                percent: 2.10,
                numberOfDec: '21',
              },
              {
                id: 4,
                name: 'SUZHOU FOREFRONT GARMENTS TECHNOLOGY CO., LTD.',
                percent: 1.90,
                numberOfDec: '19',
              },
              {
                id: 5,
                name: 'PUNING JIJIE GARMENT MAKING CO.,LTD',
                percent: 1.30,
                numberOfDec: '13',
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 140) / 2
            }
          },
        ]
    },
    {
      type: 'item',
      data:
        [
          {
            chartType: 'card',
            title: 'Toplam Kalem',
            description: '15.652',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "pencil-ruler",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#58D68D",
              marginRight: 8
            }
          },
          {
            chartType: 'card',
            title: 'Fatura Tutarı',
            description: '₺17.252M',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "receipt",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#E5634D"
            }
          },
          {
            chartType: 'card',
            title: 'Kıymet',
            description: '$451M',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "dollar-sign",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#5DADE2",
              marginRight: 8

            }
          },
          {
            chartType: 'card',
            title: 'Toplam Kap',
            description: '21.462.196',
            footer: 'Son 5 yıllık',
            byParameter: '',
            icon: "box",
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 140) / 4,
              backgroundColor: "#FDC60A"
            }
          },
          {
            chartType: 'bar',
            title: 'Toplam Fatura',
            description: '',
            footer: '',
            byParameter: 'Aylara Göre - 2025',
            data: [
              {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
                datasets: [
                  {
                    data: [1464, 1364, 1657, 1198, 1759, 1078, 1559, 1593, 2278, 1700, 2]
                  }
                ]
              },
              {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
                datasets: [
                  {
                    data: [1225, 1741, 2089, 1637, 2428, 1626, 807, 1436, 1859, 2399, 5]
                  }
                ],
                legend: ["₺M"]
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 20),
              height: (Utils.heightTabView() - 140) / 2
            }
          },
        ]
    },
    {
      type: 'item',
      data:
        [
          {
            chartType: 'pie',
            title: 'Toplam Kalem',
            description: '',
            footer: '',
            byParameter: 'Beyan Tipine Göre - 2025',
            data: [
              {
                name: 'EX',
                population: 13669,
                color: "#5DADE2",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'IM',
                population: 1268,
                color: "#FF2D55",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'TR',
                population: 223,
                color: "#58D68D",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'AN',
                population: 482,
                color: "#e5634d",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'DI',
                population: 10,
                color: "#FDC60A",
                legendFontColor: '#7F7F7F',
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 120) / 2,
              marginRight: 8

            }
          },
          {
            chartType: 'pie',
            title: 'Toplam Kalem',
            description: '',
            footer: '',
            byParameter: 'Taşıma Şekline Göre - 2025',
            data: [
              {
                name: 'DENİZ',
                population: 5864,
                color: "#5DADE2",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'HAVA',
                population: 2224,
                color: "#FF2D55",
                legendFontColor: '#7F7F7F',
              },
              {
                name: 'KARA',
                population: 7654,
                color: "#58D68D",
                legendFontColor: '#7F7F7F',
              },
            ],
            style: {
              width: (Utils.getWidthDevice() - 28) / 2,
              height: (Utils.heightTabView() - 120) / 2
            }
          },
          {
            chartType: 'progress',
            title: 'Toplam Kalem (Top 5)',
            description: '',
            footer: '',
            byParameter: 'Tedarikçilere Göre - 2025',
            data: [
              {
                id: 1,
                name: 'Penti Giyim Ticaret A.Ş.',
                percent: 89.48,
                numberOfDec: '13.682',
              },
              {
                id: 2,
                name: 'ALPHA FASHION CO. LIMITED',
                percent: 4.14,
                numberOfDec: '633',
              },
              {
                id: 3,
                name: 'SC PENTI WORLD SRL',
                percent: 3.49,
                numberOfDec: '533',
              },
              {
                id: 4,
                name: 'YASMINA GARMENTS',
                percent: 2.41,
                numberOfDec: '368',
              },
              {
                id: 5,
                name: '',
                percent: 0.48,
                numberOfDec: '74',
              },
            ],
            style: {
              width: Utils.getWidthDevice() - 20,
              height: (Utils.heightTabView() - 140) / 2
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
  ];
  const [tab, setTab] = useState(tabs[0]);

  const dashboardData = useMemo(() => {
    return DashboardData.filter((data) => data.type === tab.id);
  }, [tab]);

  const goToPage = (pageName) => () => navigation.navigate(pageName);

  const renderContent = () => {
    return (
      <View style={{ flex: 1, marginTop: 10 }}>
        <TabTag
          style={{height: 30}}
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
                <Text style={{ width: 95 }}>{authorizedFirms.filter(f => f.musteriid == selectedAuthorizedFirm)[0].name}</Text>
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
