import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Button, Divider, Layout, TopNavigation, useTheme } from "@ui-kitten/components";
import { useTheme as useContextTheme } from "../contexts/theme.context";
import * as Linking from "expo-linking";

export const SandboxScreen = ({ navigation }: any) => {
  const { toggleTheme } = useContextTheme();
  const theme = useTheme();

  // const handleRedirect = (event: any) => {
  //   const { url } = event;
  //   const data = Linking.parse(url);
  //   const { path } = data;
  //
  //   console.log(data);
  //   console.log(path);
  //
  //   if (!path) return;
  //
  //   const [domain, ...resources] = path.split("/");
  //   const resource: string = resources.join("/");
  //
  //   console.log(domain, resource);
  //
  //   const paths = {
  //     "account/confirm": (domain: string) => navigation.navigate("Confirmation", { domain }),
  //   };
  //
  //   const availableResources = Object.keys(paths);
  //
  //   if (availableResources.includes(resource)) {
  //     paths[resource](domain);
  //   }
  // };
  //
  // useEffect(() => {
  //   Linking.addEventListener("url", handleRedirect);
  //   Linking.getInitialURL().then((value) => {
  //     if (value) handleRedirect({ url: value });
  //   });
  // }, []);

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
        <Button onPress={() => navigation.navigate("Confirmation")}>Confirmation</Button>
        <Button
          style={{ marginVertical: 4, backgroundColor: theme["color-primary-default"] }}
          onPress={toggleTheme}>
          TOGGLE THEME
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
