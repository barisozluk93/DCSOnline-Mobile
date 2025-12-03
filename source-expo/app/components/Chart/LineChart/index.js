import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getWidthDevice } from '@/utils';
import { useTheme } from '@/config';

const ChartLineChart = ({ data = {} }) => {
  const { colors } = useTheme();

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (_opacity = 1) => colors.primaryLight,
    labelColor: (_opacity = 1) => colors.text,
    //           decimalPlaces: 0,

    // backgroundGradientFrom: "#1E2923",
    // backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: "#08130D",
    // backgroundGradientToOpacity: 0.5,
    // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <LineChart
      style={{ position: 'absolute', top: 5, left: -10 }}
      data={data}
      width={getWidthDevice() - 40}
      height={220}
      chartConfig={chartConfig}
      withDots
      withShadow={false}
    />
  );
};


export default ChartLineChart;
