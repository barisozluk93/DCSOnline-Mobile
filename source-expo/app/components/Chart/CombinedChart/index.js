import PropTypes from 'prop-types';
import { useTheme } from '@/config';
import { getWidthDevice } from '@/utils';
import ChartBarChart from '../BarChart';
import ChartLineChart from '../LineChart';
import { View } from 'react-native';

const CombinedChart = ({ data = {} }) => {
  const { colors } = useTheme();

  const screenWidth = getWidthDevice();


  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ChartLineChart data={data[1]} /> 
  </View >
  );
};

CombinedChart.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  label: PropTypes.string,
  value: PropTypes.string,
  onPress: PropTypes.func,
};

export default CombinedChart;
