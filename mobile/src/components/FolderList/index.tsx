import React from 'react';
import { Button, Icon, List, ListItem, Divider, StyleService, useStyleSheet } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import {useConfirm} from "react-native-confirm-dialog";

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

const ConfirmableButton = (props) => {
  const {onPress} = props;
  const styles = useStyleSheet(dialogStyles);
  const confirm = useConfirm();
  const handlePress = () => {
    confirm({theme:styles.confirmDialog, onConfirm: onPress, cancelButtonStyle: styles.cancelDialog, cancelButtonLabelStyle: styles.cancelDialogLabel});
  }
  
  return <Button {...props} onPress={ handlePress } />
}

const EditIcon = (props) => (
  <Icon {...props} name='edit-outline' />
);

const DeleteIcon = (props) => (
  <Icon {...props} name='trash-outline' />
);

const ListItemRender = (props: IListItem) => {
  const { item: {name, description, onClickEdit, onClickDelete, onClickNavigate} } = props;
  return <ListItem
    style={styles.item}
    title={`${name}`}
    description={`${description}`}
    onPress={onClickNavigate}
    accessoryLeft={() => <Button onPress={onClickEdit} status="primary" accessoryLeft={EditIcon}/>}
    accessoryRight={() => <ConfirmableButton onPress={() => onClickDelete(name)} status="danger" accessoryLeft={DeleteIcon}/>}
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

const styles = StyleService.create({
  container: {
    flex:1,
    backgroundColor: "background-basic-color-1",
  },
  item: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "background-basic-color-1",
  }
});

const dialogStyles = StyleService.create({
  confirmDialog: {
    primaryColor: "color-primary-default"
  },
  cancelDialog: {
    backgroundColor: "color-danger-default",
    borderWidth:0
  },
  cancelDialogLabel: {
    color: "color-basic-100",
  }
});
