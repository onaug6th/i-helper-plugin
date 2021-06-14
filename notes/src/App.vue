<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style lang="less">
body {
  margin: 0px;
}
@import "./assets/font/iconfont.css";
</style>
