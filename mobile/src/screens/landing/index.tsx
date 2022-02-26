import React, { useState } from "react";
import { View } from "react-native";
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

export const LandingScreen = ({ navigation }: any): JSX.Element => {
  const [domain, setDomain] = useState<string>();

  const styles = useStyleSheet(themedStyles);
  const toast = useToast();

  const onSignInButtonPress = async () => {
    const id = toast.show("Loading...", {
      duration: 2000,
      onPress: (id) => toast.hide(id),
    });
    const response = await api({
      method: "get",
      resource: `tenants/validate/${domain}`,
    }).catch(({ response: { data } }) => {
      toast.update(id, data.message, { type: "danger" });
      return null;
    });

    if (!response) return;

    toast.update(id, "Success!", { type: "success" });

    navigation.navigate("Login", {
      domain,
    });
  };

  const onSignUpButtonPress = (): void => {
    navigation.navigate("Register");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          Hello
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Welcome back
        </Text>
        <Text style={styles.signInLabelSequence} category="s1" status="control">
          please enter your domain and proceed to login.
        </Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Domain"
          accessoryRight={<Icon name="globe-2" />}
          value={domain}
          onChangeText={setDomain}
          style={styles.domainInput}
          size="large"
        />
      </Layout>
      <Button style={styles.signInButton} onPress={onSignInButtonPress} size="giant">
        BEGIN
      </Button>
      <Button
        style={styles.signUpButton}
        appearance="ghost"
        status="basic"
        onPress={onSignUpButtonPress}>
        Don't have an account? Create
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
    minHeight: 200,
    backgroundColor: "color-primary-default",
  },
  formContainer: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  signInLabel: {
    marginTop: 16,
  },
  signInLabelSequence: {
    marginTop: 0,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  signUpButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  domainInput: {
    height: 40,
    marginBottom: 16,
  },
});
