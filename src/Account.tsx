import React, {useState, useEffect, useCallback, useMemo} from "react";
import {View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity} from "react-native";
import {useIsFocused, useTheme, useNavigation} from "@react-navigation/native";
import {Colors} from 'react-native-paper';
import axios from "axios";
import FontawesomeIcon from "react-native-vector-icons/FontAwesome";
import AntIcon from "react-native-vector-icons/AntDesign";

const {width, height}=Dimensions.get('window');

const Account=()=>{ 
    const navigation=useNavigation();
    const [info, setInfo]=useState<Object[]>(new Array<Object>());
    const [sum, setSum]=useState(0);
    const [spending, setSpeding]=useState(0);
    const [Income, setIncome]=useState(0);
    const thisMonth=new Date();
    const dateString=thisMonth.toLocaleDateString().split('/');
    const [month, setMonth]=useState(parseInt(dateString[0]));

    const theme=useTheme();
    const {colors}=theme;
    
    const plusMonth=useCallback(()=>{
        setMonth((month)=>{
            return month!=12? month+1: month;
        })
    },[]);

    const MinusMonth=useCallback(()=>{
        setMonth((month)=>{
            return month!=1? month-1: month;
        })
    },[]);

    const plus=useCallback((num)=>{
        return setIncome((Income)=>{
            return Income+num;
        })
      },[]);
    const minus=useCallback((num)=>{
    return setSpeding((spending)=>{
        return spending+num;
    })
    },[]);
    const total=useCallback((num,type)=>{
        return setSum((sum)=>{
            return type==0? sum-num:sum+num;
        })
    },[]);

    const focused=useIsFocused();
    useEffect(()=>{
            setSum(0);
            setSpeding(0);
            setIncome(0);
            const effect = async ()=>{
                const res = await axios.post('http://10.0.2.2:5000/list',{
                    month: month
                })
                .catch((err)=>console.log(err));
                // console.log(res.data);
                setInfo(res.data);
            };
            effect();
    },[focused, month]);

    const writeAcc=useCallback(()=>{
        navigation.navigate("book");
    },[])    

    const update=useCallback((object)=>{
        navigation.navigate("updateBook",{object: object});
    },[]);

    const accountView=useMemo(()=>{return info.map((chatItem, index)=>{
        const color=chatItem.type==0? Colors.red300: Colors.blue300;
        if(chatItem.type==0){   //지출
            minus(chatItem.money);
            total(chatItem.money,0);
        }
        else{   //수입
            plus(chatItem.money);
            total(chatItem.money,1);
        }
        const time=new Date(chatItem.dateString);

        return (
            <View style={styles.record} key={index}>
                <TouchableOpacity onPress={()=>update(chatItem)}>
                <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
                    <Text style={{textAlign: 'left', flex:1, marginLeft:10, color: Colors.blueGrey300, fontSize:13}}>{chatItem.month+'.'+chatItem.day}</Text>
                    <Text style={{textAlign: 'justify', flex:1, color: Colors.blueGrey300, fontSize:13}}>{time.toLocaleTimeString()}</Text>
                    <Text style={{textAlign: 'right', marginRight:10, flex:1, color: Colors.blueGrey300, fontSize:13}}>{chatItem.payment}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{textAlign:'left', flex:1, marginLeft:10, fontSize:15, color:colors.text}}>{chatItem.classi}</Text>
                    <Text style={{textAlign:'justify', flex:1, fontSize:15, color:colors.text}}>{chatItem.content}</Text>
                    <Text style={{textAlign:'right', flex:1, marginRight:10, color: color, fontSize:15}}>{chatItem.money}</Text>
                </View>
                </TouchableOpacity>
            </View>
        )
    })},[info]);

    return(
        <View style={styles.view}>
            <View style={styles.TopView}>
                <View style={{flex:1,flexDirection:'row', alignItems:'center', }}>
                    <TouchableOpacity style={styles.changeYear}>
                            <Text style={{color:colors.text}}>2021</Text>
                    </TouchableOpacity>
                    <View style={{flex:1,alignItems: 'center', justifyContent: 'center', flexDirection:'row'}}>
                        <AntIcon onPress={MinusMonth} name="left" size={20} color={colors.text}/>
                        <Text style={[styles.month, {marginLeft:10, marginRight: 5}]}>{month}</Text>
                        <Text style={[styles.month, {marginRight: 10}]}>월</Text>
                        <AntIcon onPress={plusMonth} name="right" size={20} color={colors.text}/>
                    </View>
                    <TouchableOpacity style={styles.changeTable}>
                        <Text style={{color:colors.text}}>기본</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{alignItems:'center', flex:2.3}}>
                <View style={styles.sum}>
                    <View>
                        <Text style={{fontSize: 30, marginBottom:10, color:colors.text}}>{sum}</Text>
                    </View>
                    <View style={{flexDirection: "row", }}>
                        <Text style={[styles.text, {textAlign: "left", marginRight: 10, color: Colors.red300}]}>{spending}</Text>
                        <Text style={[styles.text, {textAlign: "right", marginLeft: 10, color: Colors.blue300}]}>{Income}</Text>
                    </View>
                </View>
            </View>
            <View style={{flex:9, alignItems:'center'}}>
                <ScrollView>
                    {accountView}
                </ScrollView>
            </View>
            <View>
                <TouchableOpacity style={styles.add} onPress={writeAcc}>
                    <FontawesomeIcon name="plus" size={25} color="white"></FontawesomeIcon>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    view:{
        flex:1,
    },
    TopView: {
        flex:1,
        borderBottomWidth:1,
        borderBottomColor: Colors.deepPurple100,
    },
    changeYear:{
        marginLeft:10,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        backgroundColor: Colors.deepPurple100,
    },
    changeTable:{ 
        marginRight:10,
        justifyContent:'flex-end',
        paddingLeft:10,
        paddingRight:10,
        borderRadius:10,
        backgroundColor: Colors.deepPurple100,
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
        paddingBottom:12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.deepPurple100,
        margin: 4,
        width: width*0.83,
        height: height*0.07
    },
    text: {
        fontSize: 19
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
});

export default Account;