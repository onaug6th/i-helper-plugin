<template>
  <ul class="colors">
    <li v-for="color in state.colors"
        :key="color"
        :style="{
          backgroundColor: color
        }"
        @click="changeColor(color)">
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    content: String,
    backgroundColor: String,
  },
  emits: ["color-change"],
  setup(props, { emit }) {
    const state = {
      colors: [
        "#ffe66e",
        "#a1ef9b",
        "#ffafdf",
        "#d7afff",
        "#9edfff",
        "#e0e0e0",
        "#767676",
      ],
    };

    /**
     * 改变颜色
     */
    function changeColor(color: string) {
      emit("color-change", color);
    }

    return {
      state,
      changeColor,
    };
  },
});
</script>

<style lang="less" scoped>
.colors {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  li {
    height: 100%;
    position: relative;
    flex: 1;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    &:hover {
      &::before {
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
