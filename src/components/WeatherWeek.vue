<template>
  <div class="weather-week-container">
    <weather-card
      v-for="(day, index) in props.data"
      :key="index"
      :data="day"
      :isWeekMode="true"
      :city="props.city"
      :period="props.period"
      class="week-mode"
    />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import WeatherCard from '@/components/WeatherCard';

const props = defineProps(['data', 'city', 'period']);
</script>

<style scoped lang="scss">
.weather-week-container {
  display: flex;
  margin: 15px auto;

  .weather-card {
    margin: 0 5px;
    padding: 5px;
  }

  @media only screen and (max-width: 480px) {
    flex-direction: column;

    .weather-card {
      width: 100%;
      margin: 10px auto;
    }
  }
}
</style>
