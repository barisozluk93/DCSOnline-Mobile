import { StyleSheet } from 'react-native';
import { BaseColor } from '@/config';

export default StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    marginTop: 65,
    padding: 10,
    width: '100%',
  },
  contentTitle: {
    marginTop: 65,
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    padding: 20,
    paddingTop: 0,
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
