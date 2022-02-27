import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View} from "react-native";
import { Button, Divider, Layout, TopNavigation, TopNavigationAction, Icon, useTheme, useStyleSheet, StyleService, Text} from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../../contexts/theme.context";
import { FolderList } from "../../components/FolderList";

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
    title: string;
    description: string;
}

export const HomeScreen = ({ navigation }: any) => {
  const { theme: currTheme, toggleTheme } = useContextTheme();
  const theme = useTheme();

  const [folders, setFolders] = useState<[IFolder]>([]);

  const styles = useStyleSheet(themedStyles);

  const handleDelete = () => {
      console.log("deleted")
  }

  const handleEdit = () => {
      console.log("edited")
  }

  const handleClickFolder = () => {
      console.log("clicked")
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

  const data: [IFolder] = new Array(50).fill({
    title: 'Title for Item',
    description: 'Description for Item',
  });

  // NOTE: fix when auth is done
  useEffect(() => {
    setFolders(data);
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text category="h1" status="control">
          Folders
        </Text>
        <Text style={styles.label} category="s1" status="control">
          Here are all your saved folders
        </Text>
      </View>

      <Divider />

      <TopNavigation title="" subtitle="" alignment='center' accessoryLeft={BackAction} accessoryRight={ThemeAction}/>
      <Divider />

      <Layout style={styles.listContainer} level="1">
         <FolderList data={folders.map(folder => {
           const fns = {onClickNavigate: handleClickFolder, onClickDelete: handleDelete, onClickEdit: handleEdit};
           return {...folder, ...fns};
         })}/>
      </Layout>
      <Divider />
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    backgroundColor: "background-basic-color-1",
    flex:1
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
    paddingTop: 32,
    paddingHorizontal: 16,
    justifyContent: "center"
  },
  label: {
    marginTop: 16,
  },
});
