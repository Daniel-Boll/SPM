import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, View} from "react-native";
import { Button, Divider, Layout, TopNavigation, TopNavigationAction, Icon, useTheme, useStyleSheet, StyleService, Text, Card} from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../../contexts/theme.context";
import { FolderList } from "../../components/FolderList";
import { useConfirm } from "react-native-confirm-dialog";
import { api } from "../../services/api.service";
import { useToast } from "react-native-toast-notifications";


const AddIcon = (props) => (
  <Icon {...props} name='plus-square-outline' />
);

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back' />
);

const DarkIcon = (props) => (
  <Icon {...props} name='moon-outline' />
);

const LightIcon = (props) => (
  <Icon {...props} name='sun-outline' />
);

interface IFolder {
    name: string;
    description: string;
}

export const HomeScreen = ({ navigation }: any) => {
  const { theme: currTheme, toggleTheme } = useContextTheme();
  const theme = useTheme();
  const toast = useToast();
  const shakeIconRef = useRef();

  const [folders, setFolders] = useState<IFolder[]>([]);

  const styles = useStyleSheet(themedStyles);

  const handleDelete = async (folderName) => {
    console.log(folderName);
    const id = toast.show("Loading...", {
      duration: 5000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      method: "delete",
      resource: `folder/${name.sanitize()}`,
      data: {
        name: folderName.sanitize(),
      },
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Cannot delete folder", { type: "danger" });
      return null;
    });

    console.log(response);

    if (!response) return;

    setFolders(folders.filter(({name}) => name !== folderName));
  }

  const getFolders = async () => {
    const id = toast.show("Loading...", {
      duration: 5000,
      onPress: (id) => toast.hide(id),
    });

    const response = await api({
      method: "get",
      resource: `folder`,
    }).catch((err) => {
      console.log(err);
      toast.update(id, "Cannot get folders", { type: "danger" });
      return [];
    });

    return response;
  }

  const handleEdit = (folder) => {
    navigation.navigate("UpdateFolder", {folder});
  }

  const handleAdd = () => {
    navigation.navigate("AddFolder");
  }

  const handleClick = () => {
    console.log("clicked");
  }
 
  const navigateBack = () => {
    navigation.goBack();
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );

  const ThemeAction = () => (
    <TopNavigationAction icon={currTheme === "dark" ? LightIcon : DarkIcon} onPress={toggleTheme}/>
  );

  const NotFoundIcon = (props) => (
    <Icon {...props} ref={shakeIconRef} animation="shake" name='minus-circle-outline' />
  );

  const data: [IFolder] = new Array(50).fill({
    name: 'Title for Item',
    description: 'Description for Item',
  });

  // NOTE: fix when auth is done
  useEffect(() => {
    getFolders().then(setFolders);
    // setFolders(data);
  },[])

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

      <TopNavigation title="" subtitle="" alignment='center' accessoryLeft={BackAction} accessoryRight={ThemeAction}/>

      <Layout style={styles.listContainer} level="1">
         {
           folders.length !== 0 ?
         <FolderList data={folders.map(folder => {
           const fns = {onClickNavigate: handleClick, onClickDelete:() => handleDelete(folder.name), onClickEdit: () => handleEdit(folder)};
           return {...folder, ...fns};
         })}/> :

         <Button
           appearance='ghost'
           status='danger'
           style={styles.button}
           accessoryLeft={NotFoundIcon}
           onPress={() => shakeIconRef.current.startAnimation()}>
         No Folders Found
         </Button>
         }
      </Layout>
      <Divider />
      <Button onPress={handleAdd} style={styles.addButton} accessoryLeft={AddIcon} size="giant" status="success"/>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
    flex:1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    backgroundColor: "color-primary-default",
  },
  listContainer: {
    flex: 1,
    flexGrow:1,
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 70,
    borderRadius: 100,
  },
  card: {
    margin: 64,
  },
  button: {
    margin:64,
  },
});
