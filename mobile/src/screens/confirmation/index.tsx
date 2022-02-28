import {
  Button,
  Icon,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { KeyboardAvoidingView } from "../../components/keyboard-avoiding-view.components";
import { api } from "../../services/api.service";

export const ConfirmationScreen = ({ navigation, route }: any): JSX.Element => {
  const domain = route.params?.domain?.toLowerCase();
  const styles = useStyleSheet(themedStyles);
  const toast = useToast();

  const [name, setName] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const onSignInButtonPress = async () => {
    const id = toast.show("Loading...", {
      duration: 3000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      resource: `account/activate/${domain}`,
      method: "post",
      data: {
        user: {
          name,
          masterPassword: password,
        },
      },
      scoped: {
        domain,
      },
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Error activating your account, try again later", { type: "danger" });
      return null;
    });

    if (!response) return;

    toast.update(id, "Activated!", { type: "success" });

    const { data } = response;

    navigation.navigate("Login", {
      domain,
    });
  };

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const renderPasswordIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h2" status="control">
          Welcome to NSPM 🔑
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Confirm your account ({domain})
        </Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Name"
          accessoryRight={<Icon name="person" />}
          value={name}
          onChangeText={setName}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          accessoryRight={renderPasswordIcon}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
        />
      </Layout>
      <View style={styles.buttonContainer}>
        <Button style={styles.signInButton} onPress={onSignInButtonPress} size="giant">
          BEGIN
        </Button>
      </View>
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
    backgroundColor: "color-primary-default",
    minHeight: 216,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 32,
    paddingHorizontal: 16,
    width: "100%",
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: "color-success-600",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  input: {
    height: 40,
    marginBottom: 16,
    marginTop: 16,
  },
});
