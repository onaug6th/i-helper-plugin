<template>
  <div class="editor-wrap">
    <div class="editor-content"
         :style="editorStyle">
      <div v-html="content"
           ref="editor"
           class="editor"
           contenteditable
           spellcheck="false"
           @paste.prevent="paste"
           @input="contentChange"
           @contextmenu.prevent="contextMenu($event)"></div>
    </div>

    <Drawer v-model:visible="state.showDrawer"
            direction="bottom"
            :shade="false">
      <Font-color v-if="isDrawerType('fontColor')" @done="closeDrawer" />
      <Background-color v-else-if="isDrawerType('backgroundColor')" @done="closeDrawer" />
    </Drawer>

    <section class="tools"
             :style="editorStyle">

      <button v-for="item in icons"
              class="icon"
              :title="item.title"
              :key="item.command"
              @click="editorIconHandle($event, item)">
        <i class="iconfont"
           :class="item.icon"></i>
      </button>
    </section>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  Ref,
  getCurrentInstance,
  computed,
  reactive,
} from "vue";

import Drawer from "../../../../components/drawer/index.vue";
import FontColor from "./components/fontColor.vue";
import BackgroundColor from "./components/backgroundColor.vue";
import * as utils from "../../../../utils";

export default defineComponent({
  components: {
    Drawer,
    FontColor,
    BackgroundColor,
  },
  props: {
    content: String,
    backgroundColor: String,
  },
  emits: ["change"],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();

    const state = reactive({
      showDrawer: false,
      drawerType: "",
    });

    //  编辑器索引
    const editor: Ref<HTMLDivElement | null> = ref(null);
    //  图标
    const icons = [
      {
        command: "bold",
        title: "加粗",
        icon: "icon-01jiacu",
      },
      {
        drawerType: "fontColor",
        title: "字体颜色",
        icon: "icon-24zitiyanse",
      },
      {
        drawerType: "backgroundColor",
        title: "背景颜色",
        icon: "icon-19beijingyanse",
      },
      {
        command: "italic",
        title: "斜体",
        icon: "icon-02xieti",
      },
      {
        command: "underline",
        title: "下划线",
        icon: "icon-03xiahuaxian",
      },
      {
        command: "strikethrough",
        title: "删除线",
        icon: "icon-04shanchuxian",
      },
      {
        command: "insertUnorderedList",
        title: "无序列表",
        icon: "icon-20xiangmufuhao",
      },
      {
        command: "insertOrderedList",
        title: "有序列表",
        icon: "icon-21bianhaogeshi",
      },
    ];
    //  编辑器内容
    const content: Ref<string | undefined> = ref("");

    const editorStyle = computed(() => {
      return {
        backgroundColor: props.backgroundColor,
      };
    });

    onMounted(() => {
      content.value = props.content;
      focus();
    });

    /**
     * 是否抽屉类型
     * @param { string } drawerType
     */
    function isDrawerType(drawerType: string) {
      return state.drawerType === drawerType;
    }

    /**
     * 关闭抽屉
     */
    function closeDrawer() {
      state.showDrawer = false;
    }

    /**
     * 聚焦编辑器
     */
    function focus() {
      const range = document.createRange();
      range.selectNodeContents(editor.value as HTMLDivElement);
      range.collapse(false);
      const selecton = window.getSelection() as Selection;
      selecton.removeAllRanges();
      selecton.addRange(range);
    }

    /**
     * 按钮点击事件处理
     * @param e
     * @param item
     */
    function editorIconHandle(e: Event, item: any) {
      const { drawerType, command } = item;

      if (drawerType) {
        state.drawerType = drawerType;
        state.showDrawer = true;
      } else {
        e.preventDefault();
        document.execCommand(command, false);
      }
    }

    /**
     * 内容改变回调
     * @param e
     */
    const contentChange = utils.debounce((e: InputEvent) => {
      const editorHtml = (e.target as Element).innerHTML;
      emit("change", editorHtml);
    }, 300);

    /**
     * 粘贴回调
     * @param e
     */
    function paste(e: ClipboardEvent) {
      const pasteText = e.clipboardData?.getData("text/plain");
      const files = e.clipboardData?.files;

      if (files && files.length) {
        [].forEach.call(files, (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            document.execCommand(
              "insertHTML",
              false,
              `<img src="${this.result}" />`
            );
          };
        });
      } else {
        document.execCommand("insertText", false, pasteText);
      }
    }

    /**
     * 右键菜单
     * @param e
     */
    function contextMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const nodeName = target.nodeName;

      if (nodeName === "IMG") {
        const value = (target as HTMLImageElement).src;

        proxy.$contextMenu({
          event,
          list: [
            {
              text: "复制图片",
              handler() {
                iHelper.clipboard.writeImage(value);
              },
            },
          ],
        });
      }
    }

    return {
      state,
      editor,
      icons,
      content,
      editorStyle,

      isDrawerType,
      closeDrawer,

      editorIconHandle,
      contentChange,
      paste,
      contextMenu,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
