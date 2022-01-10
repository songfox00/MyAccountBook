import React from "react";
import {View, Text,StyleSheet,Dimensions, Switch} from "react-native";
import {useTheme} from "@react-navigation/native";
import {Colors} from 'react-native-paper';
import {useToggleThemeContext} from "./ToggleThemeProvider";

const {width, height}=Dimensions.get('window');

const Setting=()=>{
    const theme=useTheme();
    const {colors}=theme;
    const {toggle} = useToggleThemeContext();

    return(
        <View style={styles.view}>
            <View style={styles.TopView}>
                <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
                <Text style={[styles.month]}>설정</Text>
                </View>
            </View>
            <View style={{flex:12, alignItems:'center', paddingTop:20}}>
                <View style={styles.record}>
                    <Text style={{fontSize: 18, justifyContent:'flex-start', marginLeft:10, color:colors.text}}>다크모드</Text>
                    <Switch value={theme.dark} onValueChange={toggle}/>
                </View>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    view:{
        flex:1
    },
    TopView: {
        flexDirection:'row',
        flex:1,
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor: Colors.deepPurple100
    },
    month:{
        fontSize: 20,
        color: Colors.deepPurple300,
        fontWeight: 'bold',
    },
    record:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.deepPurple100,
        margin: 4,
        width: width*0.83,
        height: height*0.07
    },
})

export default Setting;