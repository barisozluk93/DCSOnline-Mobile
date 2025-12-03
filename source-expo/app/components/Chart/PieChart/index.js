import PropTypes from 'prop-types';
import { Dimensions, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { parseHexTransparency } from '@/utils';
import { useTheme } from '@/config';
import { Text } from '@/components';

const ChartPieChart = ({ data = {} }) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        // alignItems: 'center',
        // position: 'relative',
        // justifyContent: 'center',
      }}
    >
      <PieChart
        data={data}
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
        {data.map((item, index) => (
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

    
  );
};

ChartPieChart.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  chartConfig: PropTypes.object,
};

export default ChartPieChart;
