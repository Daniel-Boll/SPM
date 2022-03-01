import React, { ReactElement } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import {
  Button,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  Icon,
} from "@ui-kitten/components";
import { KeyboardAvoidingView } from "../../components/keyboard-avoiding-view.components";
import { api } from "../../services/api.service";
import { useToast } from "react-native-toast-notifications";

export const LoginScreen = ({ navigation, route }): React.ReactElement => {
  const domain = route.params?.domain?.toLowerCase();
  const toast = useToast();

  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  const styles = useStyleSheet(themedStyles);

  const onSignInButtonPress = async () => {
    const id = toast.show("Loading...", {
      duration: 3000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      resource: "auth/login",
      method: "post",
      data: {
        email: email?.sanitize(),
        password,
      },
      scoped: {
        domain,
      },
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Error logging in", { type: "danger" });
      return null;
    });

    if (!response) return;

    toast.update(id, "Logged in", { type: "success" });

    navigation.navigate("Home", { domain });
  };

  const onForgotPasswordButtonPress = (): void => {
    navigation && navigation.navigate("ForgotPassword");
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const renderPasswordIcon = (props): ReactElement => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          {domain.toTitleCase()}
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Sign in to your account
        </Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Email"
          accessoryRight={<Icon name="email-outline" />}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          style={styles.passwordInput}
          placeholder="Password"
          accessoryRight={renderPasswordIcon}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
        />
        <View style={styles.forgotPasswordContainer}>
          <Button
            style={styles.forgotPasswordButton}
            appearance="ghost"
            status="basic"
            onPress={onForgotPasswordButtonPress}>
            Forgot your password?
          </Button>
        </View>
      </Layout>
      <Button style={styles.signInButton} size="giant" onPress={onSignInButtonPress}>
        SIGN IN
      </Button>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 216,
    backgroundColor: "color-primary-default",
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  passwordInput: {
    marginTop: 16,
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
});

export default LoginScreen;
