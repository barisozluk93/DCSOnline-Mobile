import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme } from '@/config';
import { Button, Header, Icon, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { changePasswordRequest } from '@/apis/userApi';

const ChangePassword = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onPasswordChange = () => {
    if (password === repassword) {
      console.log("assadas");

      changePasswordRequest(password).then(response => {
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: t('success'),
            text2: t('success_message'),
          });
        }
      }).catch((error) => {
        Toast.show({
                  type: 'error',
                  text1: t('error'),
                  text2: error.response.data.error,
                });
      })
    }
    else {
      Toast.show({
        type: 'info',
        text1: t('warning'),
        text2: t('change_password_warning_message'),
      });
    }
  }

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('change_password')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.contain}>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setPassword(text)}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('password')}
            placeholderTextColor={BaseColor.grayColor}
            value={password}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('re_password')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            onChangeText={(text) => setRepassword(text)}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder={t('password_confirm')}
            placeholderTextColor={BaseColor.grayColor}
            value={repassword}
            selectionColor={colors.primary}
          />
        </View>
      </ScrollView>
      <View style={{ padding: 20 }}>
        <Button
          loading={loading}
          full
          onPress={() => {
            onPasswordChange();
          }}
        >
          {t('confirm')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
