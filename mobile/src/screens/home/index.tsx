import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Divider, Layout, TopNavigation, TopNavigationAction, Icon, useTheme} from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../../contexts/theme.context";
import { FlatList } from "../../components/FlatList";

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

  const ThemeAction = (currTheme) => (
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
      <TopNavigation title='NSPM' subtitle="Folders" alignment='center' accessoryLeft={BackAction} accessoryRight={() => ThemeAction(currTheme)}/>
      <Divider />
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <FlatList data={folders.map(folder => {
           const fns = {onClickNavigate: handleClickFolder, onClickDelete: handleDelete, onClickEdit: handleEdit};
           return {...folder, ...fns};
         })}/>
      </Layout>
      <Divider />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  layout:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
});
