import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Icon, Input, StyleService, useStyleSheet } from "@ui-kitten/components";
import Constants from "expo-constants";
import React, { useState } from "react";
import { View } from "react-native";
import { KeyboardAvoidingView } from "../../components/keyboard-avoiding-view.components";

const { manifest } = Constants;

const url =
  typeof manifest?.packagerOpts === `object` && manifest?.packagerOpts.dev
    ? manifest?.debuggerHost?.split(`:`)?.shift()?.concat(`:3000`)
    : `localhost:3000`;

export const SetApiScreen = ({ navigation }: any) => {
  const styles = useStyleSheet(themedStyles);

  const [apiUrl, setApiUrl] = useState<string>(url || "");

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <Input
          placeholder="API Url"
          accessoryRight={<Icon name="checkmark-outline" />}
          value={apiUrl}
          onChangeText={setApiUrl}
          style={styles.input}
          size="large"
        />
        <Button
          style={styles.button}
          size="large"
          onPress={() => {
            AsyncStorage.setItem("apiUrl", apiUrl);
            navigation.navigate("Landing");
          }}>
          Done
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    marginTop: 60,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  button: {
    marginHorizontal: 16,
    width: "40%",
  },
});
