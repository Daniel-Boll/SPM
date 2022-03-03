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
import { FolderListSkeleton } from "./skeleton";
import { useTheme as useContextTheme } from "../../contexts/theme.context";
import { api } from "../../services/api.service";

const AddIcon = (props: any) => <Icon {...props} name="plus-square-outline" />;

const BackIcon = (props: any) => <Icon {...props} name="arrow-back" />;

const DarkIcon = (props: any) => <Icon {...props} name="moon-outline" />;

const LightIcon = (props: any) => <Icon {...props} name="sun-outline" />;

interface IFolder {
  name: string;
  description: string;
  _id: string;
}

export const HomeScreen = ({ navigation, route }: any) => {
  const domain = route.params?.domain;
  const { theme: currTheme, toggleTheme } = useContextTheme();
  const toast = useToast();
  const shakeIconRef = useRef();

  const [folders, setFolders] = useState<IFolder[]>([]);

  const styles = useStyleSheet(themedStyles);

  const handleDelete = async (folderName: string) => {
    const id = toast.show("Deleting...");
    const response = await api({
      method: "delete",
      resource: `folder/${folderName.sanitize()}`,
      data: {
        name: folderName.sanitize(),
      },
      scoped: { domain },
    }).catch((err) => {
      console.log(err.response.data);
      toast.update(id, "Cannot delete folder", { type: "danger" });
      return null;
    });

    if (!response) return;

    toast.update(id, "Folder deleted", { type: "success" });
    setFolders(folders.filter(({ name }) => name !== folderName));
  };

  const getFolders = async () => {
    const id = toast.show("Loading...", {
      duration: 1000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      method: "get",
      resource: "folder",
      scoped: { domain },
    }).catch((err) => {
      console.log(err.response.data);
      toast.update(id, "Cannot get folders", { type: "danger" });
      return null;
    });

    if (!response) return [];

    return response.data;
  };

  const handleEdit = (folder: IFolder) => {
    navigation.navigate("UpdateFolder", {
      folder,
      domain,
      refresh: () => getFolders().then(setFolders),
    });
  };

  const handleAdd = () => {
    navigation.navigate("AddFolder", { domain, refresh: () => getFolders().then(setFolders) });
  };

  const handleClick = () => {
    console.log("clicked");
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
    getFolders().then(setFolders);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title} category="h1" status="control">
          Folders
        </Text>
        <Text style={styles.label} category="s1" status="control">
          Here are all your saved folders
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
        {folders && folders.length !== 0 ? (
          <FolderList
            data={folders.map((folder) => {
              const fns = {
                onClickNavigate: () => {
                  navigation.navigate("Passwords", { folder, domain });
                },
                onClickDelete: handleDelete,
                onClickEdit: () => handleEdit(folder),
              };
              return { ...folder, ...fns };
            })}
          />
        ) : (
          <Button
            appearance="ghost"
            status="danger"
            style={styles.button}
            accessoryLeft={NotFoundIcon}
            onPress={() => shakeIconRef?.current.startAnimation()}>
            No Folders Found
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
