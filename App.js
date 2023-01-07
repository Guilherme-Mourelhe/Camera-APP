import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal, 
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./components/MainStyles";

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPic, setCapturedPic] = useState(null);
  const [open, setOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return (
      <Text> Acesso negado, para utilizar a câmera autorize o acesso. </Text>
    );
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPic(data.uri);
      setOpen(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera type={type} style={styles.camera} ref={camRef} quality={1}>
        <View style={styles.contentButtons}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={23} color="red"></FontAwesome>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size= {23} color= {"#FFF"}></FontAwesome>

          </TouchableOpacity>

       </View>
      </Camera>

      {capturedPic &&(
      <Modal animationType="slide" transparent={true} visible={open}>
        <View style={styles.contentModal}>
      
        <TouchableOpacity style={styles.closeButton} onPress={() => {setOpen(false)}}> 
          <FontAwesome name="close" size ={50} color="#fff"> </FontAwesome>
         </TouchableOpacity>
      
          <Image style={styles.imgPhoto} source={{uri: capturedPic}}/>
      
         </View>
      </Modal>
  )}
    </SafeAreaView>
  );
}
