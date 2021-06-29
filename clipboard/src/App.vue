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

</style>
