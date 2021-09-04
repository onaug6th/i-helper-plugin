<template>
  <header class="header">
    <div class="header-left">
      <div v-if="title" class="header-left__title">
        <span>{{ title }}</span>
      </div>

      <button v-else-if="hasBtn('add')" class="icon" @click="add">
        <i class="iconfont icon-add-select" :title="addTitle"></i>
      </button>
    </div>
    <div class="header-center"></div>
    <div class="header-right">
      <button v-if="isDev" class="icon" title="开发者工具" @click="toggleDevTools">
        <i class="iconfont icon-code"></i>
      </button>

      <button
        v-if="hasBtn('pin')"
        class="icon"
        :title="state.isAlwaysOnTop ? '取消置顶' : '窗口置顶'"
        @click="toggleOnTop"
      >
        <i class="iconfont" :class="state.isAlwaysOnTop ? 'icon-pin-fill' : 'icon-pin'"></i>
      </button>

      <template v-if="hasBtn('resize')">
        <button class="icon" title="最小化" @click="minimize">
          <i class="iconfont icon-minus"></i>
        </button>

        <button class="icon" :title="state.isFullScreen ? '向下还原' : '最大化'" @click="toggleFullScreen">
          <i class="iconfont" :class="state.isFullScreen ? 'icon-fullscreen-shrink' : 'icon-fullscreen-expand'"></i>
        </button>
      </template>

      <template v-if="hasBtn('close')">
        <button class="icon close-window" @click="close" title="关闭">
          <i class="iconfont icon-close"></i>
        </button>
      </template>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

export default defineComponent({
  props: {
    title: String,
    beforeClose: Function,
    isDev: Boolean,
    btns: Array,
    addTitle: String
  },
  emits: ['add', 'close'],
  setup(props, { emit }) {

    const state = reactive({
      //  是否置顶
      isAlwaysOnTop: false,
      //  是否最大化
      isFullScreen: false,
      //  默认按钮
      defaultBtns: ['pin', 'resize', 'close']
    });

    //  展示的按钮
    const showBtns = computed(() => {
      return props.btns || state.defaultBtns;
    });

    //  是否拥有指定按钮
    function hasBtn(btn: string): boolean {
      return showBtns.value.includes(btn);
    }

    /**
     * 点击新增按钮
     */
    function add() {
      emit('add');
    }

    /**
     * 切换开发者工具
     */
    function toggleDevTools() {
      //  @Todo: 调用api打开控制台
    }

    /**
     * 切换置顶
     */
    function toggleOnTop() {
      const afterValue = !state.isAlwaysOnTop;
      state.isAlwaysOnTop = afterValue;

      iHelper.setAlwaysOnTop(afterValue);
    }

    /**
     * 最小化
     */
    function minimize() {
      iHelper.minimize();
    }

    /**
     * 切换全屏
     */
    function toggleFullScreen() {
      if (state.isFullScreen) {
        iHelper.unmaximize();
      } else {
        iHelper.maximize();
      }
      state.isFullScreen = !state.isFullScreen;
    }

    /**
     * 点击关闭
     */
    async function close() {
      emit('close');
      const { beforeClose } = props;
      if (beforeClose) {
        await beforeClose();
      }
      iHelper.close();
    }

    return {
      state,
      showBtns,
      hasBtn,

      add,

      toggleDevTools,

      toggleOnTop,

      minimize,
      toggleFullScreen,

      close
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
