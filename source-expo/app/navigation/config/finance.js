import Profile from '@/screens/Profile';
import { BottomTabNavigatorMazi, tabBarIcon } from '@/navigation/components';

export const WalletTabScreens = {
  Profile: {
    component: Profile,
    options: {
      title: 'account',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'cog' }),
    },
  },
};

const WalletMenu = () => <BottomTabNavigatorMazi tabScreens={WalletTabScreens} />;

export default {
  WalletMenu: {
    component: WalletMenu,
    options: {
      title: 'home',
    },
  },
};
