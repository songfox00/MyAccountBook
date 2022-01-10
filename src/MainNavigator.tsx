import React, {useCallback} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AntIcon from "react-native-vector-icons/AntDesign";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome";
import {RouteProp, ParamListBase, NavigationContainer} from "@react-navigation/native";

import Account from "./Account";
import Asset from "./asset/Asset";
import Setting from "./Setting";
import book from "./book/book";
import updateBook from "./book/UpdateBook"
import addAsset from "./asset/AddAsset"
import updateAsset from "./asset/UpdateAsset";

type TabBarIconProps = {focused: boolean, color: string, size:number};
const Tab = createBottomTabNavigator();
const Stack=createStackNavigator();

const MainNavigator = () => {
    const screenOptions = useCallback(({route}: {route:RouteProp<ParamListBase, string>})=>{
        return {
            tabBarIcon:({focused, color, size}:TabBarIconProps) => {
            const {name} = route;
                switch(name){
                    case 'Asset':
                        return <FontawesomeIcon name = "dollar" size = {size} color = {color}/>;
                    case 'Setting':
                        return <AntIcon name = "setting" size = {size} color = {color}/>;
                }
                return <FontawesomeIcon name = "book" size = {size} color = {color}/>;
            }
        }
    },[]);
    const TabNavigator=()=>{
        return (
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen name = "Account" component = {Account} options={{headerShown: false, tabBarLabel: "가계부"}}/>
                <Tab.Screen name = "Asset" component = {Asset} options={{headerShown: false, tabBarLabel: "자산"}}/>
                <Tab.Screen name = "Setting" component = {Setting} options={{headerShown: false, tabBarLabel: "설정"}}/>
            </Tab.Navigator>
            );
    }
    return (
        <Stack.Navigator>
            <Stack.Screen name="tab" component={TabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="book" component={book} options={{headerShown: false}}/>
            <Stack.Screen name="updateBook" component={updateBook} options={{headerShown: false}}/>
            <Stack.Screen name="addAsset" component={addAsset} options={{headerShown: false}}/>
            <Stack.Screen name="updateAsset" component={updateAsset} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

export default MainNavigator