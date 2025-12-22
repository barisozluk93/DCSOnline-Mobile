import FinanceScreens, { WalletTabScreens } from './finance';
import NewsScreens, { NewsTabScreens } from './news';
import ShareScreens from './share';
import ModalScreens from './modal';
import FryptoScreens from './crypto';
import ProjectScreens from './project';
import MusicScreens from './music';
import ComponentScreens from './component';

const AllScreens = {
  ...ShareScreens,
  ...FinanceScreens,
  ...NewsScreens,
  ...FryptoScreens,
  ...ProjectScreens,
  ...MusicScreens,
  ...ComponentScreens,
};

export {
  WalletTabScreens,
  FryptoScreens,
  FinanceScreens,
  NewsScreens,
  ShareScreens,
  ModalScreens,
  AllScreens,
  NewsTabScreens,
  ProjectScreens,
  MusicScreens,
};
