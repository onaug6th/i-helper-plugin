<template>
  <header class="header" :style="{ backgroundColor }">
    <div class="header-left">
    <div v-if="title" class="header-left__title">
      <span>{{ title }}</span>
    </div>

    <button v-if="hasBtn('add')" class="icon" @click="add">
      <i class="iconfont icon-add-select" :title="addTitle"></i>
    </button>

    <button v-if="hasBtn('more')" class="icon" @click="more">
      <i class="iconfont icon-code" :title="moreTitle"></i>
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
    backgroundColor: String,
    addTitle: {
      type: String,
      default: "新增"
    },
    moreTitle: {
      type: String,
      default: "更多"
    }
  },
  emits: ['add', 'more', 'close'],
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
     * 点击更多按钮
     */
    function more () {
      emit('more');
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
      more,

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
<style lang="less">
@import './font/iconfont.css';

@iconSize: 40px;

.icon {
  width: @iconSize;
  height: @iconSize;
  min-width: @iconSize;
  min-height: @iconSize;
  outline: none;
  border: none;
  background-color: transparent;
  padding: 0;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
  }
  a {
    color: initial;
    width: 100%;
    height: 100%;
    outline: none;
    position: relative;
    z-index: 1;
  }
  .iconfont {
    width: 22px;
    position: relative;
  }
  &:hover {
    &::before {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
