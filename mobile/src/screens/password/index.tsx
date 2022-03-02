import {
  Button,
  Divider,
  Icon,
  Layout,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  useStyleSheet,
} from "@ui-kitten/components";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { FolderList } from "../../components/FolderList";
import { useTheme as useContextTheme } from "../../contexts/theme.context";
import { api } from "../../services/api.service";
import * as Clipboard from "expo-clipboard";

const AddIcon = (props: any) => <Icon {...props} name="plus-square-outline" />;

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

const DarkIcon = (props: any) => <Icon {...props} name="moon-outline" />;

const LightIcon = (props: any) => <Icon {...props} name="sun-outline" />;

interface IFolder {
  name: string;
  description: string;
  _id: string;
}

interface IPassword {
  password: string;
  metadata: {
    name: string;
    priority: number;
  };
  _id: string;
}

export const PasswordsScreen = ({ navigation, route }: any) => {
  const { domain, folder }: { domain: string; folder: IFolder } = route.params;
  const { theme: currTheme, toggleTheme } = useContextTheme();
  const toast = useToast();
  const shakeIconRef = useRef();

  const [passwords, setPasswords] = useState<IPassword[]>([]);

  const styles = useStyleSheet(themedStyles);

  const getPasswords = async () => {
    const id = toast.show("Loading...", {
      duration: 1000,
      onPress: (id) => toast.hide(id),
    });

    console.log(folder);
    console.log(`password/${folder._id}`);

    const response = await api({
      method: "get",
      resource: `password/${folder._id}`,
      scoped: { domain },
    }).catch((err) => {
      console.log(err.response.data);
      toast.update(id, "Cannot get passwords", { type: "danger" });
      return null;
    });

    if (!response) return [];

    return response.data;
  };

  const handleAdd = () => {
    navigation.navigate("AddPassword", {
      domain,
      refresh: () => getPasswords().then(setPasswords),
      folderId: folder._id,
    });
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const ThemeAction = () => (
    <TopNavigationAction icon={currTheme === "dark" ? LightIcon : DarkIcon} onPress={toggleTheme} />
  );

  const NotFoundIcon = (props: any) => (
    <Icon {...props} ref={shakeIconRef} animation="shake" name="minus-circle-outline" />
  );

  useEffect(() => {
    getPasswords().then(setPasswords);
    console.log(passwords);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title} category="h1" status="control">
          {folder.name}
        </Text>
        <Text style={styles.label} category="s1" status="control">
          Here are all your passwords from {folder.name}
        </Text>
        <Divider />
      </View>

      <Divider />

      <TopNavigation
        title=""
        subtitle=""
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={ThemeAction}
      />

      <Layout style={styles.listContainer} level="1">
        {passwords?.length !== 0 ? (
          <FolderList
            data={passwords.map((password) => {
              const fns = {
                onClickNavigate: () => {
                  Clipboard.setString(password.password);
                },
                onClickDelete: () => {},
                onClickEdit: () => {},
              };
              return {
                ...{
                  name: password.metadata.name,
                  description: "Only password",
                },
                ...fns,
              };
            })}
          />
        ) : (
          <Button
            appearance="ghost"
            status="danger"
            style={styles.button}
            accessoryLeft={NotFoundIcon}
            onPress={() => shakeIconRef?.current.startAnimation()}>
            No Passwords Found
          </Button>
        )}
      </Layout>
      <Divider />
      <Button
        onPress={handleAdd}
        style={styles.addButton}
        accessoryLeft={AddIcon}
        size="giant"
        status="success"
      />
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    backgroundColor: "color-primary-default",
  },
  listContainer: {
    flex: 1,
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "background-basic-color-1",
  },
  title: {
    paddingTop: 16,
  },
  label: {
    paddingTop: 16,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 10,
    right: 10,
    height: 70,
    borderRadius: 100,
  },
  card: {
    margin: 64,
  },
  button: {
    margin: 64,
  },
});
