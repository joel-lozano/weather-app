import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WEATHER_API_KEY } from '@env';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

function App() {
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [weather, setWeather] = useState<any>(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            (data) => {
                setLocation(data);
            },
            (err) => {
                console.log(err);
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
    }, []);

    useEffect(() => {
        (async () => {
            if (location) {
                try {
                    const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&exclude=current,minutely,hourly&appid=${WEATHER_API_KEY}`);
                    setWeather(response.data.daily);
                } catch (err: any) {
                    setErrorMsg(err);
                }
            }
        })();
    }, [location]);

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    } else if (!location) {
        return (
            <View style={styles.container}>
                <Text>Loading location...</Text>
            </View>
        );
    } else if (!weather) {
        return (
            <View style={styles.container}>
                <Text>Loading weather...</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Weather for {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}</Text>
                {weather.map((day: any) => (
                    <View key={day.dt} style={styles.day}>
                        <Text style={styles.date}>{new Date(day.dt * 1000).toLocaleDateString()}</Text>
                        <Text style={styles.temperature}>{(day.temp.day - 273.15).toFixed(1)}&deg;C</Text>
                        <Text>{day.weather[0].description}</Text>
                    </View>
                ))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    day: {
        marginBottom: 10,
    },
    date: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    temperature: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default App;
