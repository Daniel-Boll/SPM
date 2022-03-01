import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Button, Divider, Layout, TopNavigation, useTheme } from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../contexts/theme.context";
import * as Linking from "expo-linking";
import { api } from "../services/api.service";

export const SandboxScreen = ({ navigation }: any) => {
  const { toggleTheme } = useContextTheme();
  const theme = useTheme();

  const onToggleTheme = async () => {
    await api({
      method: "post",
      resource: "account/create/user",
      data: {
        name: "John Doe2",
        email: "jh@jh.com2",
        masterPassword: "123456",
      },
      scoped: {
        domain: "teste",
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        style={{
          backgroundColor: theme["color-primary-default"],
          minHeight: 80,
        }}
        title="Sandbox"
        alignment="center"
      />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("Landing")}>Landing</Button>
        <Button onPress={() => navigation.navigate("Home")}>Home</Button>
        <Button onPress={() => navigation.navigate("Confirmation")}>Confirmation</Button>
        <Button
          style={{ marginVertical: 4, backgroundColor: theme["color-primary-default"] }}
          onPress={onToggleTheme}>
          TOGGLE THEME
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
