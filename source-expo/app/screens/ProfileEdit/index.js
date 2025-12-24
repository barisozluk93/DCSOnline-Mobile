import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput } from '@/components';
import { BaseColor, BaseStyle, useTheme } from '@/config';
// Load sample data
import { UserData } from '@/data';
import styles from './styles';
import { useSelector } from 'react-redux';

const ProfileEdit = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { loading, user } = useSelector((state) => state.user);
  const [name] = useState(user.given_name + " " + user.family_name);
  const [email] = useState(user.email);
  const [username] = useState(user.preferred_username);
  const [image] = useState(UserData[0].image);
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      <Header
        title={t('edit_profile')}
        renderLeft={() => {
          return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <ScrollView>
        <View style={styles.contain}>
          <View>
            <Image source={image} style={styles.thumb} borderRadius={50} />
          </View>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('fullname')}
            </Text>
          </View>
          <TextInput
            style={BaseStyle.textInput}
            autoCorrect={false}
            editable={false}
            placeholderTextColor={BaseColor.grayColor}
            value={name}
            selectionColor={colors.primary}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            editable={false}
            style={BaseStyle.textInput}
            autoCorrect={false}
            placeholderTextColor={BaseColor.grayColor}
            value={email}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('username')}
            </Text>
          </View>
          <TextInput
            editable={false}
            style={BaseStyle.textInput}
            autoCorrect={false}
            placeholderTextColor={BaseColor.grayColor}
            value={username}
            selectionColor={colors.primary}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEdit;
