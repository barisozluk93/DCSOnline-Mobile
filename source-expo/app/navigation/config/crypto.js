import Profile from '@/screens/Profile';
import { BottomTabNavigatorMazi, tabBarIcon } from '@/navigation/components';

export const CryptoTabScreens = {
  Profile: {
    component: Profile,
    options: {
      title: 'setting',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'cog' }),
    },
  },
};

const CryptoMenu = () => <BottomTabNavigatorMazi tabScreens={CryptoTabScreens} />;

export default {
  CryptoMenu: {
    component: CryptoMenu,
    options: {
      title: 'home',
    },
  },
};
