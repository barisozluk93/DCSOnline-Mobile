import ChangeLanguage from '@/screens/ChangeLanguage';
import ChangePassword from '@/screens/ChangePassword';
import ResetPassword from '@/screens/ResetPassword';
import Setting from '@/screens/Setting';
import SignIn from '@/screens/SignIn';
import SignUp from '@/screens/SignUp';
import ThemeSetting from '@/screens/ThemeSetting';
import Loading from '@/screens/Loading';

export default {
  Loading: {
    component: Loading,
    options: {
      title: 'loading',
      gestureEnabled: false,
    },
  },
  ChangeLanguage: {
    component: ChangeLanguage,
    options: {
      title: 'change_language',
    },
  },
  ChangePassword: {
    component: ChangePassword,
    options: {
      title: 'change_password',
    },
  },
  Setting: {
    component: Setting,
    options: {
      title: 'setting',
    },
  },
  SignIn: {
    component: SignIn,
    options: {
      title: 'sign_in',
    },
  },
  SignUp: {
    component: SignUp,
    options: {
      title: 'sign_out',
    },
  },
  ResetPassword: {
    component: ResetPassword,
    options: {
      title: 'reset_password',
    },
  },
  ThemeSetting: {
    component: ThemeSetting,
    options: {
      title: 'theme',
    },
  },
};
