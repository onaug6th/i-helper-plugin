<template>
  <ColorChoose :colors="colors"
               @color-change="colorChange" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorChoose from "../../../../../components/colorChoose/index.vue";

export default defineComponent({
  name: 'backgroundColor',
  components: {
    ColorChoose,
  },
  props: {
    content: String,
    backgroundColor: String,
  },
  emits: ['done'],
  setup(props, { emit }) {

    const colors = [
      "#ffe66e",
      "#a1ef9b",
      "#ff0000",
      "#ffafdf",
      "#d7afff",
      "#9edfff",
      "#ffffff",
      "#e0e0e0",
      "#767676",
      "#000"
    ];

    /**
     * 改变颜色
     */
    function colorChange(color: string) {
      document.execCommand('BackColor', false, color);
      emit('done');
    }

    return {
      colors,
      colorChange,
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
