import axios from 'axios';
import { apiKey } from 'Constants';

const forecastEndpoint = (params) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&alerts=no`;

const locationsEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
  const options = {
    method: 'GET',
    url: endpoint,
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (err) {
    console.log('error', err);
  }
};

export const fetchWheatherForecast = (params) => {
  return apiCall(forecastEndpoint(params));
};
export const fetchLoacations = (params) => {
  return apiCall(locationsEndpoint(params));
};
