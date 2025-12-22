import NewsScreens, { NewsTabScreens } from './news';
import ShareScreens from './share';
import ModalScreens from './modal';
import ProjectScreens from './project';
import MusicScreens from './music';
import ComponentScreens from './component';

const AllScreens = {
  ...ShareScreens,
  ...NewsScreens,
  ...ProjectScreens,
  ...MusicScreens,
  ...ComponentScreens,
};

export {
  NewsScreens,
  ShareScreens,
  ModalScreens,
  AllScreens,
  NewsTabScreens,
  ProjectScreens,
  MusicScreens,
};
