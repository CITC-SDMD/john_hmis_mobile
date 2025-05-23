import { StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import background from "../assets/test12.png";
import dcho from "../assets/dcho.png";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={background}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={3}
      />
      <View style={styles.contentContainer}>
        <Image source={dcho} style={styles.dcho} />
        <View style={styles.textContainer}>
          <Text style={styles.heading}>HMIS</Text>
          <Text style={styles.subheading}>Mobile App</Text>
          {isLoading && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={styles.loader}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.6,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    zIndex: 1,
  },
  textContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 70,
    color: "#e0e0e0",
    fontWeight: "900",
    letterSpacing: 1,
    opacity: 0.5,
  },
  subheading: {
    fontSize: 25,
    color: "#e0e0e0",
    textTransform: "uppercase",
    fontWeight: "500",
    lineHeight: 25,
    opacity: 0.5,
  },
  dcho: {
    width: 100,
    height: 100,
    marginVertical: 60,
    opacity: 0.5,
  },
});
