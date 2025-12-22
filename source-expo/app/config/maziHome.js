import {
  ModalScreens,
  NewsScreens,
  ShareScreens,
  ProjectScreens,
  MusicScreens,
} from '@/navigation/config';
import { parseHexTransparency } from '@/utils';
import { Images, BaseColor } from '@/config';

const CommonScreens = { ...ShareScreens, ...ModalScreens };

export const MaziListApp = [
  {
    id: 'NewsMenu',
    title: 'news_app',
    image: Images.dashboardNews,
    subtitle: `${Object.keys(NewsScreens).length}+ UI KITs`,
    screens: NewsScreens,
    icon: 'newspaper',
    backgroundColor: parseHexTransparency(BaseColor.kashmir, 75),
  },
  {
    id: 'ProjectMenu',
    title: 'project_management',
    image: Images.dashboardProject,
    subtitle: `${Object.keys(ProjectScreens).length}+ UI KITs`,
    screens: ProjectScreens,
    icon: 'project-diagram',
    backgroundColor: parseHexTransparency(BaseColor.greenColor, 75),
  },
  {
    id: 'MusicMenu',
    title: 'music_app',
    image: Images.dashboardMusic,
    subtitle: `${Object.keys(MusicScreens).length}+ UI KITs`,
    screens: MusicScreens,
    icon: 'music',
    backgroundColor: parseHexTransparency(BaseColor.navyBlue, 75),
  },
  {
    id: 'Common',
    description:
      'Fully completed react-native news app that provides most common screens required by any E-commerce app.',
    title: 'Common',
    image: Images.logo,
    subtitle: `${Object.keys(CommonScreens).length}+ UI KITs`,
    screens: CommonScreens,
    icon: '',
    isHideInHome: true,
    isHideInScreens: false,
  },
];
