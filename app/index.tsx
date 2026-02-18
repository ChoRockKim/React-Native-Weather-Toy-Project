import * as Location from "expo-location";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const icons = {
  Clouds: "cloudy",
};

export default function Index() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (location[0]?.city) {
      setCity(location[0].city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
      );
      const json = await response.json();
      console.log(json);
      setDays(json);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>

        <ScrollView
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weather}
        >
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator
                color={"white"}
                size={"large"}
                style={{ marginTop: 10 }}
              />
            </View>
          ) : (
            <View style={styles.day}>
              <Text style={styles.temp}>
                {parseFloat(days?.main?.temp).toFixed(1)}
              </Text>
              <Text style={styles.description}>{days?.weather[0]?.main}</Text>
              <Text style={styles.tinyText}>
                {days?.weather[0].description}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,45,86,1)",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 58,
    fontWeight: "600",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 168,
    marginTop: 50,
    color: "white",
  },
  description: {
    marginTop: -30,
    fontSize: 60,
    color: "white",
  },
  tinyText: {
    fontSize: 25,
    color: "white",
  },
});
