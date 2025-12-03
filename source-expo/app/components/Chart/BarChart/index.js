import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useTheme } from '@/config';
import { getWidthDevice } from '@/utils';

const ChartBarChart = ({ data = {} }) => {
  const { colors } = useTheme();

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  return (
    <BarChart
      // style={graphStyle}
                style={{ position: 'absolute', top: 0, left: 0 }}
      data={data}
      width={getWidthDevice() - 40}
      height={220}
      yAxisLabel="$"
      chartConfig={chartConfig}
      verticalLabelRotation={30}
                showValuesOnTopOfBars={false}
    />

  );
};

ChartBarChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  value: PropTypes.string,
  onPress: PropTypes.func,
};

export default ChartBarChart;
