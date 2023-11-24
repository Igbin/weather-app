import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const currentCityName = ref('');
  const currentCityCoords = reactive({
    lat: '',
    long: ''
  });

  const detectCity = () => {
    return fetch(`https://api.ipdata.co?api-key=${process.env.VUE_APP_IP_DATA_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        currentCityName.value = data.city;
        currentCityCoords.lat = data.latitude;
        currentCityCoords.long = data.longitude;
      });
    }

  return { detectCity, currentCityName, currentCityCoords };
});
