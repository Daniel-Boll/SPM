import {
  Button,
  Icon,
  Input,
  Layout,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
  useTheme,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { SafeAreaView, TouchableWithoutFeedback, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useTheme as useContextTheme } from "../../../contexts/theme.context";
import { api } from "../../../services/api.service";

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

const DarkIcon = (props: any) => <Icon {...props} name="moon-outline" />;

const LightIcon = (props: any) => <Icon {...props} name="sun-outline" />;

export const AddPasswordScreen = ({ navigation, route }: any): JSX.Element => {
  const { domain, refresh, folderId } = route.params;
  const [name, setName] = useState<string>("");
  const [priority, setPriority] = useState<string>("0");

  const styles = useStyleSheet(themedStyles);
  const toast = useToast();

  const { theme: currTheme, toggleTheme } = useContextTheme();

  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const ThemeAction = () => (
    <TopNavigationAction icon={currTheme === "dark" ? LightIcon : DarkIcon} onPress={toggleTheme} />
  );

  const onSaveButtonPress = async () => {
    const id = toast.show("Saving...");

    const response = await api({
      method: "post",
      resource: "password",
      data: {
        password,
        folder: folderId,
        metadata: {
          priority: parseInt(priority),
          name,
        },
      },
      scoped: { domain },
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Cannot add the password", { type: "danger" });
      return null;
    });

    if (!response) return;

    toast.update(id, "Password Added!", { type: "success" });
    refresh();
    navigation.goBack();
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          Add Password
        </Text>

        <Text style={styles.signInLabel} category="s1" status="control">
          Please add your new password
        </Text>
      </View>

      <TopNavigation
        title=""
        subtitle=""
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={ThemeAction}
      />

      <Layout style={styles.formContainer} level="1">
        <View>
          <Input
            placeholder="Name"
            accessoryRight={<Icon name="folder-outline" />}
            value={name}
            onChangeText={setName}
            style={styles.nameInput}
            size="large"
          />
          <Input
            style={styles.nameInput}
            placeholder="Password"
            accessoryRight={renderPasswordIcon}
            value={password}
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Priority"
            accessoryRight={<Icon name="folder-outline" />}
            value={priority}
            onChangeText={setPriority}
            style={styles.nameInput}
            size="large"
          />
        </View>

        <Button style={styles.signInButton} onPress={onSaveButtonPress} size="giant">
          Save
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundcolor: "background-basic-color-1",
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    backgroundColor: "color-primary-default",
  },
  formContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    paddingTop: 32,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundcolor: "background-basic-color-1",
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginVertical: 16,
  },
  nameInput: {
    height: 40,
    marginBottom: 16,
  },
});
