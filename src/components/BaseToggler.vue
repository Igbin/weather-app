<template>
  <div class="base-toggler">
    <h3 class="title">
      <span :class="{'active': props.modelValue }">{{ props.defaultValue }}</span> / <span :class="{ 'active': !props.modelValue }">{{ props.secondValue }}</span>
    </h3>
    <label class="switch">
      <input
        type="checkbox"
        :checked="props.modelValue"
        @change="(e) => $emit('update:modelValue', e.target.checked)"
      >
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['modelValue', 'defaultValue', 'secondValue']);

</script>

<style scoped lang="scss">
.base-toggler {
  .title {
    margin-bottom: 5px;

    span {
      opacity: 0.5;

      &.active {
        opacity: 1;
        font-weight: bolder;
      }
    }
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #696969;
      -webkit-transition: .4s;
      transition: .4s;

      &::before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        transform: translateX(26px);
      }

      &.round {
        border-radius: 34px;

        &::before {
          border-radius: 50%;
        }
      }
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(0);
    }
  }

  &.lang-switcher {
    .switch input:not(:checked) + .slider {
      background-image: linear-gradient(blue, yellow);
    }
  }
}
</style>