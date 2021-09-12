<template>
  <div class="editor-wrap">
    <div class="editor-content" :style="editorStyle">
      <div v-html="content"
           ref="editor"
           class="editor"
           contenteditable
           spellcheck="false"
           @paste.prevent="paste"
           @input="contentChange"
           @contextmenu.prevent="contextMenu($event)"></div>
    </div>

    <section class="tools" :style="editorStyle">
      <template v-for="item in icons"
                :key="item.name">
        <button class="icon"
                :title="item.title"
                @click="editorIconHandle($event, item.name)">
          <i class="iconfont"
             :class="item.icon"></i>
        </button>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, getCurrentInstance, computed } from "vue";
import * as utils from "../../../../utils";

export default defineComponent({
  props: {
    content: String,
    backgroundColor: String
  },
  emits: ["change"],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();
    //  编辑器索引
    const editor: Ref<HTMLDivElement | null> = ref(null);
    //  图标
    const icons = [
      {
        name: "bold",
        title: "加粗",
        icon: "icon-editor-bold",
      },
      {
        name: "italic",
        title: "斜体",
        icon: "icon-italic",
      },
      {
        name: "underline",
        title: "下划线",
        icon: "icon-underline",
      },
      {
        name: "strikethrough",
        title: "删除线",
        icon: "icon-strikethrough",
      },
      {
        name: "insertUnorderedList",
        title: "无序列表",
        icon: "icon-ul",
      },
      {
        name: "insertOrderedList",
        title: "有序列表",
        icon: "icon-ol",
      },
    ];
    //  编辑器内容
    const content: Ref<string | undefined> = ref("");

    const editorStyle = computed(() => {
      return {
        backgroundColor: props.backgroundColor
      }
    })

    onMounted(() => {
      content.value = props.content;
      focus();
    });

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
     * @param name
     */
    function editorIconHandle(e: Event, name: string) {
      e.preventDefault();
      document.execCommand(name, false);
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
      editor,
      icons,
      content,
      editorStyle,

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
