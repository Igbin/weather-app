import {ref} from "vue";

export const useBreakpoint = () => {
  const desktopBreakpoint = 1024;
  const isDesktop = ref(window.innerWidth >= desktopBreakpoint);
  const checkWidth = () => {
    isDesktop.value = window.innerWidth >= desktopBreakpoint;
  }
  window.addEventListener('resize', checkWidth);
  return {
    isDesktop,
  }
}
