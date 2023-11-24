<template>
  <div class="main-wrapper">
    <header>
      <div class="logo-block">
        <h1 class="logo-title">Weather App</h1>
        <img alt="logo" src="../assets/logo.jpg" class="logo-image">
      </div>
      <div class="lang-switch-container">
        <base-toggler
          v-model="isDefaultLang"
          default-value="En"
          second-value="Ua"
          class="lang-switcher"
        />
      </div>
    </header>
    <nav>
      <ul class="tab-list">
        <li class="tab-item">
          <button
            class="tab-button"
            :class="{ active: currentMode === 'main'}"
            @click="currentMode = 'main'"
          >
            {{ $t('navigation.main') }}
          </button>
        </li>
        <li class="tab-item">
          <button
            class="tab-button"
            :class="{ active: currentMode === 'favorites' }"
            :disabled="favoriteCities.length === 0"
            @click="currentMode = 'favorites'"
          >
            {{ $t('navigation.favorites') }}
          </button>
        </li>
      </ul>
    </nav>
    <main>
      <WeatherBlock
        v-for="block in filteredBlocks"
        :key="block.key"
        :data="block"
        :favorites="favoriteCities"
        :mode="currentMode"
        @remove="onRemoveBlock"
        @placeChanged="onPlaceChanged"
        @toggleFavorite="toggleFavorites"
      />
    </main>
    <button
      v-if="blocks.length <= 4 && currentMode === 'main'"
      class="add-block-button"
      @click="addBlock"
    >
      +
    </button>
  </div>
  <basic-modal
    v-if="showConfirmationModal"
    @close="showConfirmationModal = false"
    @confirm="isDeletionConfirmed = true"
    type="confirmation"
  >
    <template v-slot:body>
      <h2>
        {{ $t('modal.confirmMessage') }}
      </h2>
    </template>
  </basic-modal>
  <basic-modal
    v-if="showNotifyModal"
    @close="showNotifyModal = false"
  >
    <template v-slot:header>
      <h2>
        {{ $t('base.warning') }}
      </h2>
    </template>
    <template v-slot:body>
      <h2>
        {{ $t('modal.warningMessage') }}
      </h2>
    </template>
  </basic-modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import WeatherBlock from '@/components/WeatherBlock';
import BasicModal from '@/components/BasicModal';
import BaseToggler from '@/components/BaseToggler';
import { useI18n } from 'vue-i18n';
import { setI18nLanguage } from '../i18n';

const { locale } = useI18n({ useScope: 'global' });

watch(locale, (val) => {
  setI18nLanguage(val);
});

const isDefaultLang = ref(localStorage.getItem('lang') ? localStorage.getItem('lang') === 'en' : true);

watch(isDefaultLang, (val) => {
  locale.value = val ? 'en' : 'ua';
});

const currentMode = ref('main');
const blocks = ref([{ key: 1 }]);

const FAVORITES_COUNT = 5;

const favoriteCities = ref(
  localStorage.getItem('favoriteCities') ? JSON.parse(localStorage.getItem('favoriteCities')) : []
);

const filteredBlocks = computed(() => {
  return currentMode.value === 'main' ? blocks.value : favoriteCities.value;
});

const showConfirmationModal = ref(false);
const showNotifyModal = ref(false);
const removedBlockIndex = ref(null);
const isDeletionConfirmed = ref(false);

const onPlaceChanged = (changedBlockData) => {
  const blockIndex = blocks.value.findIndex(block => block.key === changedBlockData.key)

  blocks.value.splice(blockIndex, 1, changedBlockData);
}

const addBlock = () => {
  blocks.value.push({ key: Math.random() * new Date().getTime() });
};

const onRemoveBlock = (removedId) => {
  removedBlockIndex.value = blocks.value.findIndex(block => block.key === removedId);
  showConfirmationModal.value = true;
};

watch(isDeletionConfirmed, (value) => {
  if (value) removeBlock();
});

const removeBlock = () => {
  blocks.value.splice(removedBlockIndex.value, 1);
  removedBlockIndex.value = null;
  showConfirmationModal.value = false;
  isDeletionConfirmed.value = false;
};

const toggleFavorites = (newCity) => {
  if (!localStorage.getItem('favoriteCities')) {
    favoriteCities.value.push(newCity);

    localStorage.setItem('favoriteCities', JSON.stringify([newCity]))
  } else {
    if (!favoriteCities.value.map(city => city = city.name).includes(newCity.name)) {
      if (favoriteCities.value.length === FAVORITES_COUNT) {
        return showNotifyModal.value = true;
      }
      favoriteCities.value.push(newCity);

      localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities.value));
    } else {
      const removedIndex = favoriteCities.value.findIndex(city => city.name === newCity.name);
      favoriteCities.value.splice(removedIndex, 1);

      localStorage.setItem('favoriteCities', JSON.stringify(favoriteCities.value));
    }
  }
};

</script>

<style scoped lang="scss">
.main-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 15px;

  header {
    color: #ffffff;
    background-color: #4fade1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .logo-block {
      display: flex;
      align-items: center;

      .logo-title {
        font-family: cursive;
      }

      .logo-image {
        width: 150px;

        @media only screen and (max-width: 480px) {
          margin-right: 15px;
        }
      }
    }
  }

  nav {
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid white;

    .tab-list {
      @include tab-list;
      padding: 15px;
      border-bottom: none;
    }
  }

  .add-block-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    outline: none;
    border: 2px solid #ffffff;
    color: #ffffff;
    background: #4fade1;
    font-size: 40px;
    margin: 15px;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
}


</style>