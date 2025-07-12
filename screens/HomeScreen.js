import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { theme } from 'theme';
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLoacations, fetchWheatherForecast } from 'API/weather';
import { weatherImages } from 'Constants';
import * as Progress from 'react-native-progress';
import { getData, storeData } from 'utils/asyncStorage';

export const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    // console.log('location', loc);
    setLocation([]);
    toggleSearch(false);
    setLoading(true);
    fetchWheatherForecast({
      cityName: loc.name,
      days: '7',
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
      // console.log('got forecast', data);
    });
  };

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLoacations({ cityName: value }).then((data) => {
        setLocation(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  });
  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Delhi';
    if (myCity) cityName = myCity;

    fetchWheatherForecast({
      cityName,
      days: '7',
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 100), []);

  const { current, location } = weather;

  return (
    <View className="relative flex-1">
      <StatusBar style="light" />
      <Image
        blurRadius={70}
        source={require('../assets/main background.jpg')}
        className="absolute h-full w-full"
      />
      {loading ? (
        <View className="flex-1 flex-row items-center justify-center">
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex-1">
          {/* Search Section */}
          <View
            style={{ height: '7%', marginTop: Platform.OS === 'android' ? 40 : 0 }}
            className="relative z-50 mx-4 mt-10">
            <View
              className="flex-row items-center justify-end rounded-full "
              style={{
                backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
                borderRadius: 60,
              }}>
              {showSearch && (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search City"
                  placeholderTextColor={'lightgray'}
                  className="h-10 flex-1 pl-6 text-base text-white"
                />
              )}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="m-1 rounded-full p-3">
                <MagnifyingGlassIcon size={25} color={'white'} />
              </TouchableOpacity>
            </View>

            {locations.length > 0 && showSearch && (
              <View className="absolute top-16 w-full rounded-3xl bg-gray-300">
                {locations.map((loc, index) => {
                  const showBorder = index + 1 !== locations.length;
                  const borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={`mb-1 flex-row items-center border-0 p-3 px-4 ${borderClass}`}>
                      <MapPinIcon size={20} color={'gray'} />
                      <Text className="ml-2 text-lg text-black">
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
          {/* Forecast Section */}
          <View className="mx-4 mb-2 flex flex-1 justify-around">
            <Text className="text-center text-3xl font-bold text-white">
              {' ' + location?.name}
              <Text className="text-2xl font-semibold text-gray-300">
                {', ' + location?.country}
              </Text>
            </Text>

            {/* Weather Image */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                // source={{ uri: 'https:' + current?.condition?.icon }}
                className="h-60 w-60"
              />
            </View>

            {/* Temperature */}
            <View className="space-y-2">
              <Text className="ml-5 text-center text-6xl font-bold text-white">
                {current?.temp_c}&#176;
              </Text>
              <Text className="ml-5 text-center text-xl font-bold tracking-widest text-white">
                {current?.condition?.text}
              </Text>
            </View>

            {/* Stats Row */}
            <View className="mt-12 flex-row items-center justify-between px-10">
              <View className="items-center">
                <Image
                  source={require('../assets/Icons/wind-sign.png')} // wind icon
                  className="mb-1 h-6 w-6"
                />
                <Text className="text-sm font-medium text-white">{current?.wind_kph + 'Kph'}</Text>
              </View>
              <View className="items-center">
                <Image
                  source={require('../assets/Icons/drop.png')} // humidity icon
                  className="mb-1 h-6 w-6"
                />
                <Text className="text-sm font-medium text-white">{current?.humidity + '%'}</Text>
              </View>
              <View className="items-center">
                <Image
                  source={require('../assets/Icons/sun.png')} // sunrise icon
                  className="mb-1 h-6 w-6"
                />
                <Text className="text-sm font-medium text-white">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          {/* Forecast for next day */}
          <View className="mb-2 space-y-3">
            <View className="mx-5 flex-row items-center space-x-2">
              <CalendarDaysIcon size={22} color={'white'} />
              <Text className="text-base text-white">Daily Forecast</Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: 'long' };
                let dayName = date.toLocaleDateString('en-US', options);
                return (
                  <View
                    key={index}
                    className="mr-4 mt-2 flex w-24 items-center justify-center space-y-1 rounded-3xl py-3 "
                    style={{
                      backgroundColor: theme.bgWhite(0.15),
                      marginBottom: Platform.OS === 'android' ? 25 : 0,
                    }}>
                    <Image
                      source={weatherImages[item?.day?.condition?.text]}
                      className="h-11 w-11"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-xl font-semibold text-white">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
};
