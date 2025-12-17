/* Bottom News Screen */
import PHome from '@/screens/PHome';
import PProject from '@/screens/PProject';
import PProjectView from '@/screens/PProjectView';
import PProjectCreate from '@/screens/PProjectCreate';
import PTaskCreate from '@/screens/PTaskCreate';
import PTaskView from '@/screens/PTaskView';
import PTask from '@/screens/PTask';
import PFilter from '@/screens/PFilter';
import PAuthorizedFirmFilter from '@/screens/PAuthorizedFirmFilter';
import PDeclarationFilter from '@/screens/PDeclarationFilter';
import Profile from '@/screens/Profile';
import PSelectAssignee from '@/screens/PSelectAssignee';
import { tabBarIcon, tabBarIconHaveNoty, BottomTabNavigatorMazi } from '@/navigation/components';

export const NewsTabScreens = {

  PHome: {
    component: PHome,
    options: {
      title: 'dashboard',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'chart-line' }),
    },
  },
  Project: {
    component: PProject,
    options: {
      title: 'declaration',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'file-invoice' }),
    },
  },
  Tasks: {
    component: PTask,
    options: {
      title: 'tasks',
      tabBarIcon: ({ color }) => tabBarIconHaveNoty({ color, name: 'check-circle' }),
    },
  },
  Profile: {
    component: Profile,
    options: {
      title: 'account',
      tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'user-circle' }),
    },
  },
};

const ProjectMenu = () => <BottomTabNavigatorMazi tabScreens={NewsTabScreens} />;

export default {

  ProjectMenu: {
    component: ProjectMenu,
    options: {
      title: 'home',
    },
  },
  PSelectAssignee: {
    component: PSelectAssignee,
    options: {
      title: 'select_assignee',
    },
  },
  PProjectView: {
    component: PProjectView,
    options: {
      title: 'project_view',
    },
  },
  PProjectCreate: {
    component: PProjectCreate,
    options: {
      title: 'create_project',
    },
  },
  PTaskCreate: {
    component: PTaskCreate,
    options: {
      title: 'create_task',
    },
  },
  PFilter: {
    component: PFilter,
    options: {
      title: 'filter',
    },
  },
  PAuthorizedFirmFilter: {
    component: PAuthorizedFirmFilter,
    options: {
      title: 'filter',
    },
  },
  PDeclarationFilter: {
    component: PDeclarationFilter,
    options: {
      title: 'filter',
    },
  },
  PTaskView: {
    component: PTaskView,
    options: {
      title: 'task_view',
    },
  },
};
