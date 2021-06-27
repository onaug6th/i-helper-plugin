<template>
  <Clipboard />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Clipboard from './components/clipboard/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    Clipboard
  }
})
</script>

<style>
body {
  margin: 0px;
  padding-bottom: 20px;
}

::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

::-webkit-scrollbar {
  width: 9px;
  height: 9px;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-track {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.06);
}
</style>
