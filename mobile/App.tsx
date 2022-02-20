import { IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import React from "react";
import { AppNavigator } from "./src/components/navigation.component";
import { ToastProvider } from "react-native-toast-notifications";
import { ThemeProvider } from "./src/contexts/theme.context";
import "./src/utils/string";

const App = () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ThemeProvider>
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </ThemeProvider>
  </>
);

export default App;
