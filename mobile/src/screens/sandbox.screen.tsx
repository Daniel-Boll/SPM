import React from "react";
import { SafeAreaView } from "react-native";
import { Button, Divider, Layout, TopNavigation, useTheme } from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../contexts/theme.context";

export const SandboxScreen = ({ navigation }: any) => {
  const { toggleTheme } = useContextTheme();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation title="Sandbox" alignment="center" />
      <Divider />
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button onPress={() => navigation.navigate("Landing")}>Landing</Button>
        <Button
          style={{ marginVertical: 4, backgroundColor: theme["color-primary-default"] }}
          onPress={toggleTheme}>
          TOGGLE THEME
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
