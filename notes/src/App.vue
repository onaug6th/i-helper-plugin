<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="less">
body {
  margin: 0px;
  overflow-y: overlay;
}

ul {
  margin: 0px;
  padding: 0px;
}

li {
  list-style: none;
}

@import "./assets/font/iconfont.css";
</style>
