import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, View } from 'react-native';
import {
  Header,
  Icon,
  SafeAreaView
} from '@/components';
import { BaseStyle, useTheme } from '@/config';
import styles from './styles';
import { getDeclarationPDF } from '@/apis/declarationApi';
import { Buffer } from "buffer";
import PDF from "react-native-pdf";
import RNBlobUtil from 'react-native-blob-util';
import { Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';

 const PProjectView = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [filePath, setFilePath] = useState();
  const [item, setItem] = useState();
  const PDF_DIR = `${RNBlobUtil.fs.dirs.DocumentDir}/pdf-cache`;

  useEffect(() => {
    const loadPdf = async () => {
      const key = `${item.beyannameid}_${item.arsivid}`;

      const cached = await getCachedPdfPath(key);
      if (cached) {
        setFilePath(cached);
        return;
      }
      else {
        getDeclarationPDF(item.beyannameid, item.arsivid).then(async (response) => {
          const base64Pdf = Buffer.from(response).toString("base64");
          const newFilePath = await savePdfToCache(key, base64Pdf);
          setFilePath(newFilePath);
        })
          .catch((error) => {
            Toast.show({
              type: 'error',
              text1: t('error'),
              text2: t('error_file_message'),
            });

            setTimeout(() => {
              navigation.goBack();
            }, 250);
          });
      }
    }
    if (item) {
      loadPdf();
    }
  }, [item])

  const ensureDir = async () => {
    const exists = await RNBlobUtil.fs.exists(PDF_DIR);
    if (!exists) {
      RNBlobUtil.fs.mkdir(PDF_DIR);
    }
  }

  const getCachedPdfPath = async (key) => {
    await ensureDir();

    const path = `${PDF_DIR}/${key}.pdf`;
    const exists = await RNBlobUtil.fs.exists(path);

    return exists ? `file://${path}` : null;
  }

  const savePdfToCache = async (key, base64) => {
    await ensureDir();

    const path = `${PDF_DIR}/${key}.pdf`;
    await RNBlobUtil.fs.writeFile(path, base64, 'base64');

    return `file://${path}`;
  }

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

        {!filePath && <ActivityIndicator size="large" style={{ flex: 1 }} />}

        {filePath && <View
          style={styles.container}>
          <PDF
            source={{ uri: filePath, cache: true }}
            enablePaging={true}
            style={{
              flex: 1,
              backgroundColor: colors.background,
              width: Dimensions.get('window').width
            }}
            // onPageChanged={setPage}
            onLoadComplete={(numberOfPages) => {
            }}
            onError={(error) => {
            }}
            onPressLink={(uri) => {
            }}
          />

        </View>}
      </SafeAreaView >
    );
  }
 };

 export default PProjectView;
