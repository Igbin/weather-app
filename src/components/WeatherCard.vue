<template>
  <div  class="weather-card" :class="classes">
    <div class="inner-container" v-if="!props.isLoading">
      <p class="city-name">
        {{ city }}
        <span v-if="props.inFavorites" class="favorite-icon"></span>
      </p>
      <p class="date">
        {{ convertStampToDate(props.data?.dt) }}
      </p>
      <img :src="imageUrl">
      <span class="temp">{{ (props.data?.temp?.[props.period] || props.data?.temp)?.toFixed(1) }} C&#176;</span> <br v-if="props.isWeekMode"> <b><span class="weather-stat">{{  props.data?.weather[0]?.description }}</span></b>
      <p class="weather-stat-feel">
        {{ $t('weather.feels') }}: {{ (props.data?.feels_like?.[props.period] || props.data?.feels_like)?.toFixed(1) }} C&#176;
      </p>
      <template v-if="!props.isWeekMode">
        <span>{{ $t('weather.sunrise') }}: {{ convertStampToTime(props.data?.sunrise) }}</span>  <span>{{ $t('weather.sunset') }}: {{ convertStampToTime(props.data?.sunset) }}</span>
      </template>
      <p class="weather-stat">
        {{ $t('weather.wind') }}: {{ props.data?.wind_speed }} {{ isDesktop ? $t('weather.speed') : $t('weather.speedMobile') }}
      </p>
    </div>
    <loader-spinner v-else />
  </div>
</template>

<script setup>
import { defineProps, watch, reactive, computed } from 'vue';
import { convertStampToTime, convertStampToDate } from '@/helpers/converters';
import LoaderSpinner from '@/components/LoaderSpinner';
import { useBreakpoint } from '@/hooks/useBreakpoint';

const { isDesktop } =  useBreakpoint();

const props = defineProps(['data', 'city', 'isWeekMode', 'period', 'isLoading', 'in-favorites']);
const classes = reactive({ 'clear': '', 'night': '' });

watch(() => [props.data, props.period], () => {
  classes.clear = props.data?.weather[0]?.id == 800;
  classes.night = !props.isWeekMode
    && (new Date() > new Date(props.data?.sunset * 1000) || new Date() < new Date(props.data?.sunrise * 1000))
    || props.period === 'night';
}, { immediate: true });

const imageUrl = computed(() => {
  return `${process.env.VUE_APP_IMAGE_URL}${props.data?.weather[0]?.icon}@${ props.isWeekMode ? "2x" : "4x" }.png`;
});

</script>

<style scoped lang="scss">

.weather-card {
  position: relative;
  min-height: 300px;
  max-width: 300px;
  margin: 10px auto;
  border: 1px solid grey;
  border-radius: 15px;
  color: #ffffff;
  transition: all 0.5s ease;

  .date {
    margin: 0;
  }

  .city-name {
    margin: 10px 0 0 0;
    font-size: 30px;
    font-weight: bolder;

    .favorite-icon {
      position: absolute;

      &::after {
        content: url("../assets/icon/star.svg");
        font-size: 10px;
        vertical-align: super;
        background-repeat: no-repeat;
      }
    }
  }

  img {
    display: block;
    margin: 0 auto
  }

  .temp {
    font-weight: bold;
    font-size: 30px;
  }

  h3 {
    margin: 5px 0 0 0;
  }

  &.night {
    background: #555555;
  }

  &.night.clear {
    background-color: #162b4e;

    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(#FFFFE0 1px, transparent 1px);
      background-size: 80px 80px;
      pointer-events: none;
    }

    &::before {
      left: 0;
    }

    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &:not(.night) {
    background: #a4dded;
  }

  &:not(.night):not(.clear) {
    color: #111111;
    background: #C0C0C0;
  }

  &.week-mode {
    width: calc(100% / 5);

    .city-name {
      font-size: 20px;
    }

    &.night {
      transform: rotateY(180deg);
      transform-style: preserve-3d;

      .inner-container {
        transform:rotateY(-180deg)
      }
    }
  }

  @media only screen and (max-width: 768px) and (min-width: 480px) {
    .weather-stat {
      font-size: 14px;
    }
  }

  @media only screen and (max-width: 960px) and (min-width: 480px) {
    .weather-stat-feel {
      font-size: 15px;
    }
  }
}

</style>