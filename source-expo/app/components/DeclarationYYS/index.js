import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { BaseColor, useTheme } from '@/config';
import Icon from '@/components/Icon';
import Tag from '@/components/Tag';
import Text from '@/components/Text';
import styles from './styles';

const DeclarationYYS = ({
  style,
  onPress,
  beyannameRefId,
  rejimTip,
  gonderici,
  alici,
  onOption,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { statusName, statusColor } = useMemo(() => {
    switch (rejimTip) {
      case 'EX':
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.blueColor,
        };
      case 'IM':
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.pinkDarkColor,
        };
      case 'TR':
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.greenColor,
        };
      case 'AN':
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.orangeColor,
        };
      case 'DI':
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.yellowColor,
        };
      default:
        return {
          statusName: t(rejimTip),
          statusColor: BaseColor.greenColor,
        };
    }
  }, [rejimTip]);

  return (
    <View style={[styles.contain, style]}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <Text headline numberOfLines={2}>
              {beyannameRefId}
            </Text>
          </TouchableOpacity>
          <View
          style={{
            flexDirection: 'row',
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Tag
            light
            textStyle={{
              color: BaseColor.whiteColor,
            }}
            style={{
              backgroundColor: statusColor,
              paddingHorizontal: 10,
              minWidth: 80,
            }}
          >
            {statusName}
          </Tag>
        </View>
          <View style={{ alignItems: 'flex-end', paddingLeft: 5 }}>
            <TouchableOpacity hitSlop={{ top: 10, right: 10, left: 10 }} style={{ paddingLeft: 16 }} onPress={onOption}>
              <Icon name="ellipsis-h" size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          caption2
          light
          style={{
            paddingTop: 10,
          }}
        >
          <Icon name="paper-plane" solid />&nbsp;{gonderici}
        </Text>
        <Text
          caption2
          light
          style={{
            paddingTop: 10,
          }}
        >
          <Icon name="box" solid />&nbsp;{alici}
        </Text>
        <View
          style={[
            styles.footer,
            {
              borderColor: colors.border,
            },
          ]}
        >
        </View>
      </View>
    </View>
  );
};

DeclarationYYS.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  completedTickets: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onOption: PropTypes.func,
};

export default DeclarationYYS;
