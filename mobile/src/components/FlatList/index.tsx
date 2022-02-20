import React from 'react';
import { Button, Icon, List, ListItem } from '@ui-kitten/components';
import { StyleSheet, View, Dimensions } from 'react-native';

const {width, height} = Dimensions.get("window");

// Interface para ambos folder e password
// NOTE: futuramente dividir para ListItemFolder e ListItemPassword
interface IListItem {
  title: string,
  description: string,
  onClickNavigate: () => {}
  onClickDelete: () => {}
  onClickEdit: () => {}
}

interface IListButton {
  onClick: () => {}
  iconName: string
  buttonStatus: string
}

const EditIcon = (props) => (
  <Icon {...props} name='edit-outline' />
);

const DeleteIcon = (props) => (
  <Icon {...props} name='trash-outline' />
);


const ListButton = (props: IListButton) => {
  const {onClick, iconName, buttonStatus} = props;
  return <Button onPress={onClick} status={buttonStatus}>{}</Button>
}

const ListItemRender = (props: IListItem) => {
  const { item: {title, description, onClickEdit, onClickDelete, onClickNavigate} } = props;
  return <ListItem
    style={styles.item}
    title={`${title}`}
    description={`${description}`}
    onPress={onClickNavigate}
    accessoryLeft={() => <Button onPress={onClickEdit} status="primary" >Edit</Button>}
    accessoryRight={() => <Button onPress={onClickDelete} status="danger">Delete</Button>}
  />
}

export const FlatList = (props) => {
  const {data} = props  

  return (
    <View style={{ width, height}}>
      <List
        style={styles.container}
        data={data}
        renderItem={ListItemRender}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 8
  }
});
