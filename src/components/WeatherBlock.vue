<template>
  <div class="weather-block-container">
    <nav>
      <div v-if="props.mode === 'main'" class="autocomplete">
        <GMapAutocomplete
          :placeholder="`${$t('autocomplete.placeholder')}`"
          :class="{ 'empty': true }"
          @place_changed="onPlaceChanged"
          :select-first-on-enter="true"
        />
      </div>
      <div class="favorite-toggler">
        <h3 class="favorite-toggler-title">{{  isInFavorites ? `${$t('base.fromFav')}` : `${$t('base.toFav')}` }}</h3>
        <button
          class="favorite-icon-button"
          :class="{ 'filled': isInFavorites }"
          @click="toggleFavorites"
        />
      </div>
    </nav>
    <nav>
      <ul class="tab-list">
        <li class="tab-item">
          <button
            class="tab-button"
            :class="{ active: currentMode === WeatherCard }"
            @click="currentMode = WeatherCard"
          >
            {{ $t('navigation.today') }}
          </button>
        </li>
        <li class="tab-item">
          <button
            class="tab-button"
            :class="{ active: currentMode === WeatherWeek }"
            @click="currentMode = WeatherWeek"
          >
            {{ $t('navigation.week') }}
          </button>
        </li>
      </ul>
    </nav>
    <base-toggler
      v-if="currentMode === WeatherWeek"
      v-model="isDay"
      :default-value="`${$t('navigation.day')}`"
      :second-value="`${$t('navigation.night')}`"
    />
    <component
      :is="currentMode"
      :data="currentMode === WeatherCard ? weatherData.current : weatherData.daily.slice(0, DAYS_IN_WEEK)"
      :period="period"
      :city="currentCity.name"
      :in-favorites="isInFavorites"
      :isLoading="isLoading"
    />
    <weather-chart
      :data="chartData"
      :isLoading="isLoading"
    />
    <button
      v-if="key !== 1 && props.mode === 'main'"
      class="remove-block-button"
      @click="$emit('remove', key)"
    />
  </div>
</template>

<script setup>
import { reactive, shallowRef, ref, onMounted, onUnmounted, computed, watch, defineProps, defineEmits } from 'vue';
import { useGlobalStore } from '@/store';
import { useI18n } from 'vue-i18n';
import WeatherCard from '@/components/WeatherCard';
import WeatherWeek from '@/components/WeatherWeek';
import WeatherChart from '@/components/WeatherChart';
import BaseToggler from '@/components/BaseToggler';
import { getApiWeatherData } from '@/helpers/mainRequest';
import { getCurrentPosition } from '@/helpers/getCurrentPosition.js';

const { tm } = useI18n();
const { locale } = useI18n({ useScope: 'global' });

watch(locale, (val) => {
  getData({ coords: { latitude: currentCity.latitude, longitude: currentCity.longitude } }, val)
});

const store = useGlobalStore();
const props = defineProps(['data', 'mode', 'favorites']);
const emits = defineEmits(['remove', 'placeChanged', 'toggleFavorite']);

const key = ref(props.data.key);

const DAYS_IN_WEEK = 5;

const currentMode = shallowRef(WeatherCard);
const weatherData = ref({});
const averageForecastData = ref([]);
const currentCity = reactive({ name: '', latitude: '', longitude: '' });
const isDay = ref(true);
const isLoading = ref(false);
let updateWidgetIntervalId;

const isInFavorites = computed(() => {
  return props?.favorites?.map(city => city = city.name).includes(currentCity.name);
});

onMounted(async () => {
  currentCity.name = props.data?.name || store.currentCityName;

  getData(
    props.data.latitude && props.data.longitude ?
      { coords: { latitude: props.data.latitude, longitude: props.data.longitude }}
      : undefined
  );
  updateWidgetIntervalId = setInterval(getData, 600000);
});

watch(() => store.currentCityName, () => {
  currentCity.name = store.currentCityName;
}, { immediate: true });

const getData = async (coords, lang) => {
  let currentPosition;
  let permissionStatus = await navigator?.permissions?.query({ name: 'geolocation' });

  if (props.mode === 'main' && !coords && navigator.geolocation && permissionStatus?.state === 'granted') {
    currentPosition = await getCurrentPosition();
  } else {
    currentPosition = coords;
  }

  currentCity.latitude = currentPosition?.coords?.latitude || store.currentCityCoords.lat;
  currentCity.longitude = currentPosition?.coords?.longitude || store.currentCityCoords.long;

  isLoading.value = true;
  getApiWeatherData(currentCity.latitude, currentCity.longitude, lang || locale.value)
    .then(response => response.json())
    .then(data => weatherData.value = data)
    .then(() => calculateAverageForecastData())
    .finally(() =>  isLoading.value = false);
};

const calculateAverageForecastData = () => {
  averageForecastData.value = weatherData.value.daily.slice(0, DAYS_IN_WEEK).map(day => {
    const daySum = Object.values(day.temp).reduce((acc, sum) => acc + sum);

    return (daySum / Object.values(day.temp).length).toFixed(1);
  });
};

const onPlaceChanged = (args) => {
  currentCity.name = args.name;
  currentCity.latitude = args.geometry.location.lat();
  currentCity.longitude = args.geometry.location.lng();

  emits('placeChanged', { key, name: currentCity.name, latitude: currentCity.latitude, longitude: currentCity.longitude });

  getData({ coords: { latitude: currentCity.latitude, longitude: currentCity.longitude } });
};

const period = computed(() => {
  return isDay.value ? 'day' : 'night';
});

const chartData = computed(() => {
  const data = { labels: '', data: '', title: '' };

  if (currentMode.value === WeatherCard) {
    const actualData = weatherData.value?.hourly?.filter(hour => {
      return new Date(hour.dt * 1000).getDate() === new Date().getDate();
    });

    data.labels = actualData?.map(hour => hour =  new Date(hour.dt * 1000).getHours());
    data.data = actualData?.map(hour => hour = hour.temp);
    data.title = `${tm('chart.dayTitle')} C\u00B0`;
  } else {
    data.labels = weatherData.value?.daily?.slice(0, DAYS_IN_WEEK).map(day => day = new Date(day.dt * 1000).getDate());
    data.data = averageForecastData.value;
    data.title = `${tm('chart.weekTitle')} C\u00B0`;
  }
  return data;
});

const toggleFavorites = () => {
  const newFavorite = {
    name: currentCity.name,
    latitude: currentCity.latitude,
    longitude: currentCity.longitude
  };
  emits('toggleFavorite', newFavorite);
};

onUnmounted(() => {
  clearInterval(updateWidgetIntervalId);
});
</script>

<style scoped lang="scss">

.weather-block-container {
  margin-top: 15px;
  padding: 15px;
  border-radius: 20px;
  background: #ffffff;

  nav {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;

    .autocomplete {
      width: 300px;

      :deep(input) {
        width: 100%;
        resize: none;
        padding: 0 27px 0 15px;
        height: 45px;
        border: 1px solid grey;
        border-radius: 8px;
        font-size: 15px;
        line-height: 20px;
        color: grey;

        @media only screen and (max-width: 480px) {
          width: 80%;
        }
      }
    }

    .favorite-toggler {
      width: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .favorite-toggler-title {
        position: absolute;
        margin: 0;
        color: #555555;

        @media only screen and (max-width: 480px) {
          font-size: 16px;
        }
      }
    }

    .tab-list {
      @include tab-list;
    }
  }

  .remove-block-button, .favorite-icon-button {
    width: 40px;
    height: 40px;
    background: url("../assets/icon/trash.svg"), #ffffff;
    background-size: contain;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }

  .favorite-icon-button {
    margin-top: 30px;
    background: no-repeat url("../assets/icon/heart.svg"), #ffffff; ;

    &.filled {
      background: no-repeat url("../assets/icon/heart-filled.svg"), #ffffff; ;
    }
  }
}

</style>