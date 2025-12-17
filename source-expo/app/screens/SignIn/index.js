import { useEffect, useState } from 'react';
import { TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseColor, BaseStyle, useTheme, Images } from '@/config';
import { Button, Header, Image, SafeAreaView, Text, TextInput } from '@/components';
import styles from './styles';
import { login } from '@/actions/auth';
import { getUser, getUserAuthorizedFirms } from '@/actions/user';
import { loadToken } from '@/utils/storage';

const successInit = {
  id: true,
  password: true,
};

const SignIn = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [id, setId] = useState();
  const [password, setPassword] = useState();
  const [success, setSuccess] = useState(successInit);
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadToken = async () => {
      let access_token = await loadToken();
      if(access_token) {
        dispatch(getUser());
        dispatch(getUserAuthorizedFirms());
      }
      else{
        dispatch({type: "AUTH_LOGOUT"});
        dispatch({type: "USER_INIT"});
        dispatch({type: "DECLARATION_INIT"});
      }
    };

    loadToken();
  }, [navigation])

  useEffect(() => {
    if (token) {
      dispatch(getUser());
      dispatch(getUserAuthorizedFirms());

      navigation.navigate('ProjectMenu');
    }
    else{
      dispatch({type: "USER_INIT"});
      dispatch({type: "DECLARATION_INIT"});
    }
  }, [token]);

  const onLogin = async () => {
    if (id !== '' && password !== '') {
      dispatch(login(id, password));
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('sign_in')}
      />

      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.contain}>
          <View style={styles.contentTitle}>
            <Text headline>
              {t('email')}
            </Text>
          </View>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={(text) => setId(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                id: true,
              });
            }}
            autoCorrect={false}
            placeholder={t('email')}
            placeholderTextColor={success.id ? BaseColor.grayColor : colors.primary}
            value={id}
            selectionColor={colors.primary}
          />

          <View style={styles.contentTitle}>
            <Text headline>
              {t('password')}
            </Text>
          </View>
          <TextInput
            style={[BaseStyle.textInput, { marginTop: 10 }]}
            onChangeText={(text) => setPassword(text)}
            onFocus={() => {
              setSuccess({
                ...success,
                password: true,
              });
            }}
            autoCorrect={false}
            placeholder={t('password')}
            secureTextEntry={true}
            placeholderTextColor={success.password ? BaseColor.grayColor : colors.primary}
            value={password}
            selectionColor={colors.primary}
          />
          <View style={{ width: '100%', marginVertical: 16 }}>
            <Button full loading={loading} style={{ marginTop: 20 }} onPress={() => onLogin()}>
              {t('sign_in')}
            </Button>
          </View>
          <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text body2 primaryColor>
                {t('forgot_your_password')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
