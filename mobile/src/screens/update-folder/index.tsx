import {
    Button, Icon, Input,
    Layout,
    StyleService,
    Text,
    useStyleSheet,
    useTheme,
    TopNavigation,
    TopNavigationAction,
} from "@ui-kitten/components";

import { useTheme as useContextTheme } from "../../contexts/theme.context";
import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { KeyboardAvoidingView } from "../../components/keyboard-avoiding-view.components";
import { api } from "../../services/api.service";

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const DarkIcon = (props) => (
  <Icon {...props} name='moon-outline' />
);

const LightIcon = (props) => (
  <Icon {...props} name='sun-outline' />
);

export const UpdateFolderScreen = ({ navigation, route }: any): JSX.Element => {
  const {name, description: folderDescription} = route.params?.folder;
  const [description, setDescription] = useState<string>(folderDescription);

  const styles = useStyleSheet(themedStyles);
  const toast = useToast();

  const { theme: currTheme, toggleTheme } = useContextTheme();
  const theme = useTheme();

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );

  const ThemeAction = () => (
    <TopNavigationAction icon={currTheme === "dark" ? LightIcon : DarkIcon} onPress={toggleTheme}/>
  );

  const onSaveButtonPress = async () => {
    const id = toast.show("Loading...", {
      duration: 5000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      method: "patch",
      resource: `folder/${name.sanitize}`,
      data: {
        description: description.sanitize()
      },
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Cannot Update the Folder", { type: "danger" });
      return null;
    });

    console.log(response);

    if (!response) return;


    toast.update(id, "Folder Updated!", { type: "success" });

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text category="h1" status="control">
            Update Folder
          </Text>

          <Text style={styles.signInLabel} category="s1" status="control">
            Please update the {name} Folder Data
          </Text>
        </View>

        <TopNavigation title="" subtitle="" alignment='center' accessoryLeft={BackAction} accessoryRight={ThemeAction}/>

        <Layout style={styles.formContainer} level="1">
        <View>
          <Input
            disabled
            placeholder="Name"
            accessoryRight={<Icon name="folder-outline" />}
            value={name}
            style={styles.nameInput}
            size="large"
          />
          <Input
            placeholder="Description"
            accessoryRight={<Icon name="info-outline" />}
            value={description}
            onChangeText={setDescription}
            style={styles.nameInput}
            size="large"
          />
          </View>

          <Button style={styles.signInButton} onPress={onSaveButtonPress} size="giant">
            Update
          </Button>
        </Layout>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundcolor: "background-basic-color-1",
    flex:1,
    flexGrow:1,
    flexDirection: 'column',
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    backgroundColor: "color-primary-default",
  },
  formContainer: {
    flex: 1,
    flexGrow:1,
    flexDirection: 'column',
    paddingTop: 32,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundcolor: "background-basic-color-1",
  },
  signInLabel: {
    marginTop: 16,
  },
  signInButton: {
    marginVertical: 16 ,
  },
  nameInput: {
    height: 40,
    marginBottom: 16,
  },
});
