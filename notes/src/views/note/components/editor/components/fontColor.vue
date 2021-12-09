<template>
  <ColorChoose :colors="colors"
               @color-change="colorChange" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorChoose from "../../../../../components/colorChoose/index.vue";

export default defineComponent({
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
      document.execCommand('ForeColor', false, color);
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

</style>
