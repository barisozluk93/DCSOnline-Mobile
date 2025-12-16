import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-end',
  },
  notification: {
    position: 'relative',
  },
  filter: {
    flexDirection: 'row',
    marginTop: 10,
    height: 20
  },
  container: {
    height: 50,
    width: 140,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingTop: 8,
    paddingLeft: 5,
    marginLeft: -15
  },
});
