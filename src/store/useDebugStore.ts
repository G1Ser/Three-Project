/**
 * debug状态管理
 */
import { ref } from 'vue';
import { defineStore } from 'pinia';
const useDebugStore = defineStore('debug', () => {
  const isDebug = ref(false);
  return { isDebug };
});

export default useDebugStore;
