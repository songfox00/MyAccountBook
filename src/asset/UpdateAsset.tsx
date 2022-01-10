import React, {useState, useCallback} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert} from "react-native";
import {useRoute, useTheme, useNavigation} from "@react-navigation/native";
import {Colors} from 'react-native-paper';
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";

const {width, height}=Dimensions.get('window');

const UpdateAsset=()=>{
    const theme=useTheme();
    const {colors}=theme;

    const route=useRoute();
    const navigation=useNavigation();
    const object=route.params;

    const [money, setMoney]=useState(object.object.money.toString());
    const [name, setName]=useState(object.object.name);

    const passInfo = useCallback(()=>{
        const effect = async ()=>{
            const res = await axios.post('http://10.0.2.2:5000/updateAsset',{
                name: name,
                money: money
            })
            .catch((err)=>console.log(err));
        };
        effect();
        navigation.navigate("Asset");
        },[{name, money}]);
    
    const goBack = useCallback(()=>navigation.canGoBack() && navigation.goBack(),[]);
 
    const deleteAlert = useCallback(()=>{
        Alert.alert("알림", "삭제하시겠습니까?",[
            {text: "아니요", onPress: ()=>{console.log("no")}},
            {text: "예", onPress: deleteData}
        ]);
    },[]);

    const deleteData = useCallback(()=>{
        const effect = async ()=>{
            const res = await axios.post('http://10.0.2.2:5000/deleteAsset',{
                id: object.object.id,
            })
            .catch((err)=>console.log(err));
        };
        effect();
        navigation.navigate("Asset");
    },[]);

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
            <View style={styles.TopView}>
                <TouchableOpacity onPress={goBack}>
                    <AntIcon name="left" size={30} color={Colors.deepPurple300}></AntIcon>
                </TouchableOpacity>
            </View>
            <View style={styles.record}>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>자산</Text>
                    <TextInput value={name} onChangeText={(text)=>{setName(text)}} style={styles.input}></TextInput>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>금액</Text>
                    <TextInput value={money} onChangeText={(text)=>{setMoney(text)}} style={styles.input}></TextInput>
                </View>
            </View>
            <View style={{flex:10, marginTop:40}}>
                <View style={{flexDirection: 'row', justifyContent:'center'}}>
                    <TouchableOpacity onPress={deleteAlert} style={styles.write}>
                        <Text style={styles.text}>삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={passInfo} style={styles.write}>
                        <Text style={styles.text}>저장</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles=StyleSheet.create({
    view:{
        flex:1,
    },
    TopView: {
        padding:5,
        flex:1,
        borderBottomWidth:1,
        borderBottomColor: Colors.deepPurple100,
        justifyContent: 'center',
        paddingLeft: 10
    },   
    text:{
        fontSize:18,
        color: "white",
    },
    record:{
        flex:1,
        margin:20
    },
    recordText:{
        fontSize:15,
        marginRight:10,
        color: "black"
    },
    inputView:{
        margin:5,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'center'
    },
    input:{
        borderBottomWidth: 1,
        borderRadius: 10,
        borderColor: Colors.deepPurple300,
        width: width*0.6,
        height: height*0.05
    },
    write:{
        backgroundColor: Colors.deepPurple200,
        borderRadius:5,
        width: width*0.32,
        height: height*0.06,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default UpdateAsset;