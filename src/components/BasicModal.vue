<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <slot name="header"></slot>
          <button
            type="button"
            class="btn-close"
            @click="emits('close')"
          >
            x
          </button>
        </header>
        <section class="modal-body">
          <slot name="body"></slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer"></slot>
          <nav>
            <button
              v-if="props.type === 'confirmation'"
              class="confirmation-button"
              @click="emits('confirm')"
            >
              {{ $t('base.yes') }}
            </button>
            <button
              type="button"
              class="close-modal-button"
              @click="emits('close')"
            >
              {{ $t('base.cancel') }}
            </button>
          </nav>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emits = defineEmits(['close', 'confirm']);
const props = defineProps(['type']);

</script>

<style scoped lang="scss">
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    height: 30%;
    min-height: 200px;
    width: 20%;
    min-width: 435px;
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 15px;

    .modal-header,
    .modal-footer {
      padding: 15px;
      display: flex;
    }

    .modal-header {
      position: relative;
      font-weight: bold;
      justify-content: space-between;

      .btn-close {
        position: absolute;
        top: 0;
        right: 0;
        border: none;
        font-size: 20px;
        padding: 10px;
        cursor: pointer;
        font-weight: bold;
        color: grey;
        background: transparent;
      }
    }

    .modal-footer {
      flex-direction: column;
      justify-content: flex-end;
      flex: 1;

      button {
        width: 170px;
        min-height: 35px;
        margin: 0 auto;
        color: #ffffff;
        background: grey;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        font-size: 15px;
        font-weight: bold;

        &:hover {
          opacity: 0.6;
        }
      }

      .close-modal-button {
        background-color: #A8A8A8;
      }

      .confirmation-button {
        margin-right: 10px;
        background-color: #800000;
      }
    }

    .modal-body {
      position: relative;
      padding: 10px;
      overflow: auto;
    }
  }
}
</style>