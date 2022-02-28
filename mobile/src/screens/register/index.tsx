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
import { View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { KeyboardAvoidingView } from "../../components/keyboard-avoiding-view.components";
import { api } from "../../services/api.service";
import { createURL } from "expo-linking";

export const RegisterScreen = ({ navigation }: any): JSX.Element => {
  const [domain, setDomain] = useState<string>();
  const [email, setEmail] = useState<string>();

  const styles = useStyleSheet(themedStyles);
  const toast = useToast();

  const onSignUpButtonPress = async () => {
    const id = toast.show("Loading...", {
      duration: 5000,
      onPress: (id) => toast.hide(id),
    });

    const redirectURL = createURL(`${domain}/account/confirm`);

    const response = await api({
      method: "post",
      resource: "tenants",
      data: {
        subdomain: domain.sanitize(),
        ownerEmail: email.sanitize(),
        name: `${domain} tenant`,
        callback: redirectURL,
      },
      // callbackUrl:
    }).catch((err) => {
      console.log(err);
      toast.update(id, "The domain is already taken", { type: "danger" });
      return null;
    });

    if (!response) return;

    console.log(response);

    toast.update(id, "You will shortly receive an e-mail", { type: "success" });

    navigation.navigate("Landing");
  };

  const onSignInButtonPress = (): void => {
    navigation.navigate("Landing");
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          Register
        </Text>
        <Text style={styles.signInLabel} category="s1" status="control">
          Glad you are here!
        </Text>
        <Text style={styles.signInLabelSequence} category="s1" status="control">
          please enter a domain name
        </Text>
        <Text style={styles.signInLabelSequence} category="s1" status="control">
          and your e-mail address
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
        <Input
          placeholder="E-mail"
          accessoryRight={<Icon name="email-outline" />}
          value={email}
          onChangeText={setEmail}
          style={styles.domainInput}
          size="large"
        />
      </Layout>
      <Button style={styles.signInButton} onPress={onSignUpButtonPress} size="giant">
        REGISTER
      </Button>
      <Button
        style={styles.signUpButton}
        appearance="ghost"
        status="basic"
        onPress={onSignInButtonPress}>
        Already have an account? Sign In
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
