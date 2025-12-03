import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, ScrollView, View } from 'react-native';
import {
  Header,
  Icon,
  SafeAreaView
} from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { getDeclarationPDF, listDeclarationArchieveRequest } from '@/apis/declarationApi';
import WebView from 'react-native-webview';
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";

const PProjectView = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [item, setItem] = useState();
  const [html, setHtml] = useState(undefined);

  useEffect(() => {
    if (item) {
      console.log(item)
      getDeclarationPDF(item.beyannameid, item.arsivid).then(response => {
        const base64Pdf = Buffer.from(response, "binary").toString("base64");
        setHtml(`
    <html>
      <body style="margin:0;padding:0;">
        <embed
          type="application/pdf"
          src="data:application/pdf;base64,${base64Pdf}"
          width="100%"
          height="100%"
        />
      </body>
    </html>
  `);
      })
    }
  }, [item])

useEffect(() => {
  if (route?.params?.item) {
    setItem(route?.params?.item);
  }
}, [route?.params?.item]);

if (item) {
  return (
    <SafeAreaView style={[BaseStyle.safeAreaView, { flex: 1 }]} edges={['right', 'top', 'left']}>
      <Header
        title={item.refid}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.text} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <View
        style={styles.container}>

        {!html && <ActivityIndicator />}
        {html && <WebView source={{ html }} style={{ flex: 1 }} />}
      </View>
    </SafeAreaView >
  );
}
};

export default PProjectView;
