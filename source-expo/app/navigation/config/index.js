import ShareScreens from './share';
import ModalScreens from './modal';
import ProjectScreens from './project';
import ComponentScreens from './component';

const AllScreens = {
  ...ShareScreens,
  ...ProjectScreens,
  ...ComponentScreens,
};

export {
  ShareScreens,
  ModalScreens,
  AllScreens,
  ProjectScreens,
};
