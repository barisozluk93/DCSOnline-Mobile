import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { Icon, Text } from '@/components';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getMenuRequest } from '@/apis/menuApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const tabBarIcon = ({ color, name }) => (
  <Icon name={name} size={20} solid color={color} />
);

export const tabBarIconHaveNoty = ({ color, name }) => {
  const { declarations } = useSelector((state) => state.declarationYYS);

  return (
    <View>
      {tabBarIcon({ color, name })}
      {declarations && declarations.length > 0 && (
        <View
          style={{
            borderWidth: 1,
            borderColor: BaseColor.whiteColor,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: 20,
            height: 20,
            backgroundColor: 'red',
            top: -5,
            right: -12,
            borderRadius: 10,
          }}
        >
          <Text whiteColor caption2>
            {declarations.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const BottomTab = createBottomTabNavigator();

export const BottomTabNavigatorMazi = ({ tabScreens = {} }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { selectedAuthorizedFirm } = useSelector((state) => state.user);
  const [dashboardVisibility, setDashboardVisibility] = useState(true);
  const [yysVisibility, setYYSVisibility] = useState(true);

  const fetchMenuData = () => {
    console.log('firm' + selectedAuthorizedFirm);

    getMenuRequest(selectedAuthorizedFirm).then((response) => {
      console.log('response' + response);

      if (!response.data || response.data.length === 0) {
        setDashboardVisibility(false);
        setYYSVisibility(false);
      } else {
        setDashboardVisibility(true);
        setYYSVisibility(true);
      }
    });
  };

  useEffect(() => {
    // fetchMenuData();
  }, [selectedAuthorizedFirm]);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: colors.primaryColor,
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: [
          BaseStyle.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 8),
            height: 60 + insets.bottom,
          },
        ],
      }}
    >
      {Object.keys(tabScreens).map((name, index) => {
        const { options, component } = tabScreens[name];

        if (options.title === 'dashboard' && !dashboardVisibility) {
          return null;
        }

        if (options.title === 'tasks' && !yysVisibility) {
          return null;
        }

        return (
          <BottomTab.Screen
            key={index}
            name={name}
            component={component}
            options={{
              ...options,
              title: t(options.title),
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
};