import React, {useState, useCallback} from "react";
import {NavigationContainer, DefaultTheme, DarkTheme} from "@react-navigation/native";
import MainNavigator from "./src/MainNavigator";
import {useColorScheme} from "react-native";
import { ToggleThemeProvider } from "./src/ToggleThemeProvider";

const App = () => {
  const scheme = useColorScheme();
  const [theme, setTheme]=useState(scheme=="dark"? DarkTheme: DefaultTheme);
  const toggleTheme=useCallback(()=>{
    setTheme(({dark})=>{
      return dark? DefaultTheme: DarkTheme;
    })
  },[]);

  return (
    <ToggleThemeProvider toggle={toggleTheme}>
      <NavigationContainer theme={theme}>
        <MainNavigator/>
      </NavigationContainer>
    </ToggleThemeProvider>);
}
export default App;