import React, { useState, useEffect } from "react";
import {
  Text,
  Image,
  View,
  Platform,
  StyleSheet,
  Button,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Entypo, AntDesign } from "@expo/vector-icons";
import AppLoading from "expo-app-loading";

export default function App() {
  const [image, setImage] = useState(null);
  const [base64String, setBase64String] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 1,
    });

    if (result.cancelled === false) {
      setImage(result.uri);
      setBase64String(result.base64);
    }
    
  };

  const clickPhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status === "granted") {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });

      if (result.cancelled === false) {
        setImage(result.uri);
        setBase64String(result.base64);
      }
      
    }
  };

  const upload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", base64String);
    const response = await fetch("http://20.198.84.13//add", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.status === 200) {
      const text = await response.text();
      setIsLoading(false);
      alert(text);
    } else {
      console.log(response.status);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {!image && (
          <Text style={styles.text}>Your Image Will be shown here.</Text>
        )}
        {image && <Text style={styles.text}>Your Uploaded Image is</Text>}
        {image && <Image source={{ uri: image }} style={styles.images} />}
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonItems}>
          <View style={styles.buttonInner}>
            <Entypo.Button
              name="upload"
              size={32}
              color="black"
              onPress={() => pickImage()}
              style={styles.button}
            />
          </View>
        </View>
        <View style={styles.buttonItems}>
          <View style={styles.buttonInner}>
            <Entypo.Button
              name="camera"
              size={32}
              color="black"
              onPress={() => clickPhoto()}
              style={styles.button}
            />
          </View>
        </View>

        <View style={styles.buttonPredict}>
          <TouchableOpacity
            style={styles.buttonPredictInner}
            onPress={() => upload()}
          >
            {isLoading ? (
              <ActivityIndicator
                animating={isLoading}
                size="large"
                color="black"
              />
            ) : (
              <View style={styles.buttonPredictInner}>
                <AntDesign.Button
                  name="codesquareo"
                  size={32}
                  color="black"
                  onPress={upload}
                  style={styles.button}
                />
                <Text class = {styles.text}>Predict</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* <View style={styles.buttonPredictInner}>
            <AntDesign.Button
              name="codesquareo"
              size={32}
              color="black"
              onPress={apploading}
              style={styles.button}
            />
            
          </View> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  imageContainer: {
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  images: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  buttonContainer: {
    height: "40%",
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
  },
  buttonItems: {
    width: "50%",
    height: "50%",
    padding: 20,
  },
  buttonInner: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 50,
    justifyContent: "center",
  },
  buttonPredict: {
    width: "100%",
    height: "50%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonPredictInner: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 50,
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "normal",
    color: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
