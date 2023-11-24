import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const currentCity = ref('');

  const detectCity = () => {
    fetch(`https://api.ipdata.co?api-key=${process.env.VUE_APP_IP_DATA_API_KEY}`)
      .then(res => res.json())
      .then(data => currentCity.value = data.city);
    }

  return { detectCity, currentCity };
});
