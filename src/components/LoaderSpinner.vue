<template>
  <div class="preloader">
    <svg
      class="preloader__image"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
      ></path>
    </svg>
  </div>
</template>
<script></script>

<style scoped lang="scss">
.preloader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: rgba(255,255,255,0.5);

  &__image {
    fill: #a9a9a9;;
    position: absolute;
    width: 50px;
    height: 50px;
    text-align: center;
    animation: preloader-rotate 2s infinite linear;
    top: calc(50% - 35px);
    left: calc(50% - 25px);
    z-index: 1002;
  }
}

@keyframes preloader-rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
