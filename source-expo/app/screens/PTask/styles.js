import { getWidthDevice } from '@/utils';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';

export default StyleSheet.create({
    notification: {
      position: 'relative',
    },
    filter: {
      flexDirection: 'row',
      marginTop: 10,
      height: 20
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // İkon ve metni iki uca yayar
      height: 40,
      width: getWidthDevice() * 0.3, // Ekranın neredeyse yarısı kadar yer açar
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 10,
      marginLeft: -15, // Sol kenara (Filtre butonu hizasına) yaslar
      backgroundColor: 'transparent',
    },
    firmText: {
      fontSize: 13,
      fontWeight: '600',
      flex: 1, // Metnin sığdığı kadar uzamasını sağlar
      marginRight: 5,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    }
});
