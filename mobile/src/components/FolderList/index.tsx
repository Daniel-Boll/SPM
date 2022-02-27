import React from 'react';
import { Button, Icon, List, ListItem, Divider } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';


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

const ListItemRender = (props: IListItem) => {
  const { item: {title, description, onClickEdit, onClickDelete, onClickNavigate} } = props;
  return <ListItem
    style={styles.item}
    title={`${title}`}
    description={`${description}`}
    onPress={onClickNavigate}
    accessoryLeft={() => <Button onPress={onClickEdit} status="primary" accessoryLeft={EditIcon}/>}
    accessoryRight={() => <Button onPress={onClickDelete} status="danger" accessoryLeft={DeleteIcon}/>}
  />
}

export const FolderList = (props) => {
  const {data} = props;

  return (
    <List
      style={styles.container}
      data={data}
      renderItem={ListItemRender}
      ItemSeparatorComponent={Divider}
    />
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
