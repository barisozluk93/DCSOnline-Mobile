import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { BaseColor, useTheme } from '@/config';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import ProgressBar from '@/components/Progress/Bar';
import styles from './styles';

const CardReport11 = ({
  style = {},
  name = '',
  numberOfDec = '',
  onPress = () => {},
  percent = '0',
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      
      <View
        style={{
          paddingLeft: 0,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text caption2 style={{ }}>
            {name.length > 20 && name.substring(0,30) + '...'}
            {name.length <= 20 && name}
          </Text>
          <Text headline style={[styles.text, {  }]}>
            {numberOfDec}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <ProgressBar style={{ flex: 1, paddingRight: 20 }} percent={percent} />
          <Text footnote light>
            {`${percent}%`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

CardReport11.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string,
  percent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
};

export default CardReport11;
