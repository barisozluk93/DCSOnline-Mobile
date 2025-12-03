import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/config';
import PieChart from '@/components/Chart/PieChart';
import Text from '@/components/Text';
import styles from './styles';
import { CardReport11, Icon } from '@/components';
import CombinedChart from '../Chart/CombinedChart';

const Dashboard = ({
  style = {},
  onPress = () => { },
  disabled = true,
  data = [],
}) => {
  const { colors } = useTheme();

  const rows = [];
  for (let i = 0; i < data.length; i += 2) {
    rows.push(data.slice(i, i + 2));
  }


  return (
    <View style={[styles.container, style]}>
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
                {item.description && <Text headline style={styles.description}>
                  {item.description}
                </Text>}
                {!item.description && item.chartType === 'pie' &&
                  <PieChart data={item.data} />
                }
                {!item.description && item.chartType === 'progress' &&
                  item.data.map((item, index) => (
                    <CardReport11
                      key={index}
                      name={item.name}
                      percent={item.percent}
                      numberOfDec={item.numberOfDec}
                    />
                  ))
                }
                {!item.description && item.chartType === 'bar' &&
                  <CombinedChart
                    data={item.data}
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
    </View>
  );
};

Dashboard.propTypes = {
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  progress: PropTypes.number,
  days: PropTypes.string,
  members: PropTypes.array,
};

export default Dashboard;
