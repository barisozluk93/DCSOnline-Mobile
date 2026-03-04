import PropTypes from 'prop-types';
import { useTheme } from '@/config';
import { getWidthDevice } from '@/utils';
import ChartBarChart from '../BarChart';
import ChartLineChart from '../LineChart';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toFloat } from '@/utils/utility';

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

  return (
    !loading && data.data ? <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ChartLineChart data={data.data[1]} />
      {/* {data && data.length > 0 && <ChartBarChart data={data[0]} /> } */}
    </View > :
      <View style={{ height: 220, alignItems: "center" }}>
        <ActivityIndicator size={"large"} color={colors.primary} style={{ flex: 1 }} />
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
