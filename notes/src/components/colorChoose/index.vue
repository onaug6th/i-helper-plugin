<template>
  <ul class="colors">
    <li v-for="color in colors"
        :key="color"
        :style="{
          backgroundColor: color
        }"
        @click="changeColor(color)"></li>
  </ul>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive } from "vue";

export default defineComponent({
  name: "colorChoose",
  props: {
    colors: {
      type: Array,
    },
  },
  emits: ["color-change"],
  setup(props, { emit }) {
    function changeColor(color: string) {
      emit("color-change", color);
    }

    const colors: ComputedRef<Array<string>> = computed(() => {
      return (
        props.colors as Array<string> || [
          "#ffe66e",
          "#a1ef9b",
          "#ffafdf",
          "#d7afff",
          "#9edfff",
          "#e0e0e0",
          "#767676",
        ]
      );
    });

    return { changeColor, colors };
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

ul {
  margin: 0px;
  padding: 0px;
}

li {
  list-style: none;
}
</style>
