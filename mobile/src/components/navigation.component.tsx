import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { SandboxScreen } from "../screens/sandbox.screen";
import { LandingScreen } from "../screens/landing";
import { LoginScreen } from "../screens/login";
import { HomeScreen } from "../screens/home";
import { RegisterScreen } from "../screens/register";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
  <Navigator
    initialRouteName="Sandbox"
    screenOptions={{
      headerShown: false,
    }}>
    <Screen name="Sandbox" component={SandboxScreen} />
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Landing" component={LandingScreen} />
    <Screen name="Login" component={LoginScreen} />
    <Screen name="Register" component={RegisterScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);