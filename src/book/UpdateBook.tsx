import React, {useState, useCallback} from "react";
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert} from "react-native";
import {useRoute, useTheme, useNavigation} from "@react-navigation/native";
import {Colors} from 'react-native-paper';
import axios from "axios";
import AntIcon from "react-native-vector-icons/AntDesign";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const {width, height}=Dimensions.get('window');

const UpdateBook=()=>{
    const theme=useTheme();
    const {colors}=theme;

    const route=useRoute();
    const navigation=useNavigation();
    const object=route.params;

    const [money, setMoney]=useState(object.object.money.toString());
    const [content, setContent]=useState(object.object.content);
    const [pay, setPay]=useState(object.object.payment);
    const [classi, setClassi]=useState(object.object.classi);
    const [memo, setMemo]=useState(object.object.memo);
    const [type, setType]=useState(object.object.type);

    const current=new Date(object.object.dateString);
    const [date, setDate]=useState(current);   
    const [time, setTime]=useState(current);   
    const id=object.object.id;

    const updateInfo = useCallback(()=>{
        const effect = async ()=>{
            const res = await axios.post('http://10.0.2.2:5000/updateBook',{
                id: id,
                date: date.toLocaleDateString(),
                dateString: date.toLocaleString(),
                time: time.toLocaleTimeString(),
                money: money,
                content: content,
                payment: pay,
                classi: classi,
                memo: memo,
                type: type
            })
            .catch((err)=>console.log(err));
        };
        effect();
        navigation.navigate("Account");
    },[{date, time, money,content,pay,classi,memo, type}]);


    const deleteAlert = useCallback(()=>{
        Alert.alert("알림", "삭제하시겠습니까?",[
            {text: "아니요", onPress: ()=>{console.log("no")}},
            {text: "예", onPress: deleteData}
        ]);
    },[]);

    const deleteData = useCallback(()=>{
        const effect = async ()=>{
            const res = await axios.post('http://10.0.2.2:5000/deleteBook',{
                id: id,
            })
            .catch((err)=>console.log(err));
        };
        effect();
        navigation.navigate("Account");
    },[]);

    const goBack = useCallback(()=>navigation.canGoBack() && navigation.goBack(),[]);
    
    const [color, setColor]=useState(type==0? Colors.white: Colors.blue300);
    const [color2, setColor2]=useState(type==1? Colors.white: Colors.red300);

    const changeColor=()=>{
        const check = color==Colors.blue300? Colors.white: Colors.blue300;
        setColor(check);
        setColor2(color2==Colors.red300? Colors.white: Colors.red300);
        setType(check==Colors.white? 0:1);
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimeVisible, setTimeVisibility]=useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const showTimePicker=()=>{
        setTimeVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideTimePicker=()=>{
        setTimeVisibility(false);
    }

    const handleConfirm = (date) => {
        hideDatePicker();
        setDate(date);
    };

    const handleTime=(time)=>{
        hideTimePicker();
        setTime(time);
    }
    
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.view}>
            <View style={styles.TopView}>
                <TouchableOpacity onPress={goBack}>
                    <AntIcon name="left" size={30} color={Colors.deepPurple300}></AntIcon>
                </TouchableOpacity>
            </View>
            <View style={styles.selectView}>
                <TouchableOpacity onPress={changeColor} style={styles.selection}>
                    <Text style={[styles.text, {color:color}]}>수입</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeColor} style={styles.selection}>
                    <Text style={[styles.text, {color:color2}]}>지출</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.record}>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>날짜</Text>
                    <View style={[styles.input, {flexDirection: 'row', alignItems: 'center'}]}>
                        <TouchableOpacity onPress={showDatePicker} style={{marginRight:10, marginLeft: 10}}>
                            <Text>
                                {date.toLocaleDateString()}
                            </Text>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimePicker}>
                        <Text>
                            {time.toLocaleTimeString()}
                        </Text>
                        <DateTimePickerModal
                                isVisible={isTimeVisible}
                                mode="time"
                                onConfirm={handleTime}
                                onCancel={hideTimePicker}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>금액</Text>
                    <TextInput value={money} onChangeText={(text)=>{setMoney(text)}} style={styles.input}></TextInput>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>내용</Text>
                    <TextInput value={content} onChangeText={(text)=>{setContent(text)}} style={styles.input}></TextInput>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>자산</Text>
                    <TextInput value={pay} onChangeText={(text)=>{setPay(text)}} style={styles.input}></TextInput>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>분류</Text>
                    <TextInput value={classi} onChangeText={(text)=>{setClassi(text)}} style={styles.input}></TextInput>
                </View>
                <View style={styles.inputView}>
                    <Text style={[styles.recordText,{color:colors.text}]}>메모</Text>
                    <TextInput value={memo} onChangeText={(text)=>{setMemo(text)}} style={styles.input}></TextInput>
                </View>
            </View>
            <View style={{flex:8}}>
                <View style={{flexDirection: 'row', justifyContent:'center'}}>
                    <TouchableOpacity onPress={deleteAlert} style={styles.write}>
                        <Text style={styles.text}>삭제</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={updateInfo} style={styles.write}>
                        <Text style={styles.text}>수정</Text>
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
    selectView:{
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin:10
    },
    selection:{
        backgroundColor: Colors.deepPurple100,
        borderRadius:10,
        width: width*0.4,
        height: height*0.06,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text:{
        fontSize:18,
        color: "white",
    },
    record:{
        flex:7
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

export default UpdateBook;