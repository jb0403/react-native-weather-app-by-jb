import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import WeatherInfo from "./components/WeatherInfo";
import UnitsPicker from "./components/UnitsPicker";
import { colors } from "./utils/index";
import ReloadIcon from "./components/ReloadIcon";
import WeatherDetails from "./components/WeatherDetails";
// import { WEATHER_API_KEY } from "react-native-dotenv";

const WEATHER_API_KEY = "73d6761160eb41c0ce654173f4d3ac48";

const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

// const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    load();
  }, [unitSystem]);

  async function load() {
    setCurrentWeather(null);
    setErrorMessage(null);

    try {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== "granted") {
        setErrorMessage("Acces to location is needed to run the app");
      }
      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      // console.log("latitude", latitude);
      // console.log("longitude", longitude);

      // const latitude = 21.092159;
      // const longitude = 71.770462;

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(weatherUrl);
      const result = await response.json();

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMessage(result.message);
      }

      // alert(`Latitude : ${latitude}, Longitude  : ${longitude}`);
    } catch (error) {
      setErrorMessage(error);
    }
  }

  if (currentWeather) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <View style={styles.main}>
          <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails
          currentWeather={currentWeather}
          unitSystem={unitSystem}
        />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.screen}>
        <StatusBar style="dark" />
        <ReloadIcon load={load} />
        <Text style={{ textAlign: "center" }}>{errorMessage}</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <StatusBar style="dark" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
});

export default App;
