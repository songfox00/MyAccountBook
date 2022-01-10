import React, {useCallback, useMemo,useEffect,useState} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import {useIsFocused, useTheme, useNavigation} from "@react-navigation/native";
import {Colors} from 'react-native-paper';
import axios from "axios";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome";

const {width, height}=Dimensions.get('window');
const Asset=()=>{
    const theme=useTheme();
    const {colors}=theme;

    const navigation=useNavigation();

    const [asset, setAsset]=useState<Object[]>(new Array<Object>());
    const [sum, setSum]=useState(0);

    const focused=useIsFocused();
    useEffect(()=>{
        setSum(0);
        const effect = async ()=>{
            const res = await axios.get('http://10.0.2.2:5000/assetList',{})
            .catch((err)=>console.log(err));
            setAsset(res.data);
        };
        effect();
    },[focused]);

    const total=useCallback((num)=>{
        return setSum((sum)=>{
            return sum+num;
        })
    },[]);

    const update=useCallback((object)=>{
        navigation.navigate("updateAsset",{object: object});
    },[]);

    const writeAss=useCallback(()=>{
        navigation.navigate("addAsset");
    },[])  

    const accountView=useMemo(()=>{return asset.map((chatItem, index)=>{
        total(chatItem.money);
        const moneyColor=chatItem.money<0? Colors.red300:Colors.blue300;
        const money=chatItem.money<0? chatItem.money*-1: chatItem.money;
        return (
            <View style={styles.record} key={index}>
                <TouchableOpacity onPress={()=>update(chatItem)}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'center'}}>
                        <Text style={{textAlign:'left', flex:1, marginLeft:10, fontSize:15, color:colors.text}}>{chatItem.name}</Text>
                        <Text style={{textAlign:'right', flex:1, marginRight:10, color: moneyColor, fontSize:15}}>{money}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    })},[asset]);

    return(
        <View style={styles.view}>
            <View style={styles.TopView}>
                <Text style={[styles.month]}>자산</Text>
            </View>
            <View style={{alignItems:'center', flex:2.3}}>
                <View style={styles.sum}>
                    <View>
                        <Text style={{fontSize: 30, color:Colors.black}}>{sum}</Text>
                    </View>
                </View>
            </View>
            <View style={{flex:9, alignItems:'center'}}>
                <ScrollView>
                    {accountView}
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity style={styles.add} onPress={writeAss}>
                    <FontawesomeIcon name="plus" size={25} color="white"></FontawesomeIcon>
                </TouchableOpacity>
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
        justifyContent: 'center',
        borderBottomWidth:1,
        borderBottomColor: Colors.deepPurple100
    },
    month:{
        fontSize: 20,
        color: Colors.deepPurple300,
        fontWeight: 'bold',
    },
    sum:{
        flex:1,
        backgroundColor: Colors.deepPurple100, 
        borderRadius: 25,
        width: width*0.8,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    record:{
        justifyContent:'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.deepPurple100,
        margin: 4,
        width: width*0.83,
        height: height*0.06
    },
    add:{
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: Colors.deepPurple100,
        borderRadius: 100,
    }
})

export default Asset;