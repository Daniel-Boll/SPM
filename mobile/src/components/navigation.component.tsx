import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { SandboxScreen } from "../screens/sandbox.screen";
import { LandingScreen } from "../screens/landing";
import { LoginScreen } from "../screens/login";
import { HomeScreen } from "../screens/home";
import { RegisterScreen } from "../screens/register";
import { ConfirmationScreen } from "../screens/confirmation";
import { AddFolderScreen } from "../screens/add-folder";
import { UpdateFolderScreen } from "../screens/update-folder";
import { PasswordsScreen } from "../screens/password";
import { AddPasswordScreen } from "../screens/password/add-password";

import * as Linking from "expo-linking";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
  <Navigator
    initialRouteName="Sandbox"
    screenOptions={{
      headerShown: false,
    }}>
    <Screen name="Sandbox" component={SandboxScreen} />
    <Screen name="Home" component={HomeScreen} />
    <Screen name="AddFolder" component={AddFolderScreen} />
    <Screen name="UpdateFolder" component={UpdateFolderScreen} />
    <Screen name="Landing" component={LandingScreen} />
    <Screen name="Login" component={LoginScreen} />
    <Screen name="Register" component={RegisterScreen} />
    <Screen name="Confirmation" component={ConfirmationScreen} />
    <Screen name="Passwords" component={PasswordsScreen} />
    <Screen name="AddPassword" component={AddPasswordScreen} />
  </Navigator>
);

const prefix = Linking.createURL("/");

export const AppNavigator = () => {
  return (
    <NavigationContainer
      linking={{
        prefixes: [prefix],
        getInitialURL: async () => {
          const url = await Linking.getInitialURL().then((url) => {
            if (url) {
              return url;
            }
            return prefix + "home";
          });

          console.log(url);
          return url;
        },
        config: {
          screens: {
            Confirmation: {
              path: ":domain/account/confirm",
            },
          },
        },
      }}>
      <HomeNavigator />
    </NavigationContainer>
  );
};
