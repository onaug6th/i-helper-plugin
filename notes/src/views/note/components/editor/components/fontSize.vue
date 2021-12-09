<template>
  <ul class="fontSizes">
    <li v-for="size in fontSizes"
        :key="size"
        @click="colorChange(size)">
        {{ size }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ColorChoose from "../../../../../components/colorChoose/index.vue";

export default defineComponent({
  name: "fontSize",
  components: {
    ColorChoose,
  },
  props: {
    content: String,
    backgroundColor: String,
  },
  emits: ['done'],
  setup(props, { emit }) {

    const fontSizes = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7'
    ];

    /**
     * 改变颜色
     */
    function colorChange(size: string) {
      document.execCommand('fontSize', false, size);
      emit('done');
    }

    return {
      fontSizes,
      colorChange,
    };
  },
});
</script>

<style lang="less" scoped>
.fontSizes {
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
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 20px;

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
