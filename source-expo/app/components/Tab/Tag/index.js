import { View } from 'react-native';
import { useTheme, BaseColor } from '@/config';
import Tag from '@/components/Tag';
import styles from './styles';

const TabTag = ({ tabs = [], tab = {}, onChange = () => {}, style = {}, disabled }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.tabBar, style]}>
      {tabs.map((item, index) => (
        <Tag
          key={index}
          primary
          disabled={disabled}
          style={{
            marginHorizontal: 5,
            flex: 1,
            backgroundColor: tab.id === item.id ? colors.primary : 'transparent',
          }}
          textStyle={{
            color: colors.text,
          }}
          onPress={() => onChange(item)}
        >
          {item.title}
        </Tag>
      ))}
    </View>
  );
};

export default TabTag;
