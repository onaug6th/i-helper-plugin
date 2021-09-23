<template>
  <Header :beforeClose="beforeClose" :btns="['add', 'more', 'pin', 'close']"
          :backgroundColor="state.noteInfo.color"
          @add="addNote"
          @more="state.showMore = true" />

  <!-- 更多内容抽屉 -->
  <Drawer v-model:visible="state.showMore">
    <div>
      <ul class="colors">
        <li v-for="color in state.colors"
            :key="color"
            :style="{
              backgroundColor: color
            }"
            @click="changeColor(color)"></li>
      </ul>

      <p class="list" @click="openList">
        <i class="iconfont icon-list"></i>
        <span>笔记列表</span>
      </p>
    </div>
  </Drawer>
  <!-- 更多内容抽屉 -->

  <Editor :content="editContent"
          :backgroundColor="state.noteInfo.color"
          @change="changeEditContent" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import Editor from "./components/editor/index.vue";
import Drawer from "./components/drawer/index.vue";
import Header from "../../components/header/index.vue";

export default defineComponent({
  components: {
    Header,
    Editor,
    Drawer,
  },
  setup() {
    const route = useRoute();

    const editContent = ref("");
    const _id = route.query._id as string;
    const state: any = reactive({
      //  是否展示更多
      showMore: false,
      //  可修改的颜色列表
      colors: [
        "#ffe66e",
        "#a1ef9b",
        "#ffafdf",
        "#d7afff",
        "#9edfff",
        "#e0e0e0",
        "#767676"
      ],
      //  便笺信息
      noteInfo: {}
    });

    onBeforeMount(() => {
      //  获取便笺信息
      getNoteInfo();

      iHelper.on("note-delete", () => {
        //  关闭此便笺
        iHelper.close();
      });
    });

    /**
     * 获取列表视图id
     */
    function getListViewInfo() {
      const listWinInfo = iHelper.getPluginWinsInfo().filter(({ viewUrl }) => {
        const urlArr = viewUrl.split("#/");

        //  分割不出，说明是 index.html
        if(urlArr.length === 1) {
          return true;
        }
        //  可分割，需要判断路由地址是不是主列表
        else {
          return !urlArr[urlArr.length - 1].includes('note?')
        }

      })[0];

      return listWinInfo ? listWinInfo : {}
    }

    /**
     * 获取当前便笺内容
     */
    function getNoteInfo() {
      const noteInfo = iHelper.db.findOne({ _id });
      if (noteInfo) {
        editContent.value = noteInfo.content;
        state.noteInfo = noteInfo;
      }
    }

    /**
     * 更新便笺内容
     * @param content 内容
     */
    function changeEditContent(content: string) {
      editContent.value = content;

      updateNote({
        content
      });
    }

    /**
     * 更新便笺
     * @param updateValue 更新内容
     */
    function updateNote(updateValue) {
      iHelper.db.update(
        {
          _id,
        },
        {
          ...state.noteInfo,
          ...updateValue
        }
      );

      getNoteInfo();

      //  通知主面板更新便笺内容
      iHelper.send(getListViewInfo().viewId, "notes-note-update", {
        _id,
        ...state.noteInfo
      });
    }

    /**
     * 切换便笺背景颜色
     */
    function changeColor(color: string) {
      if(color === state.noteInfo.color) {
        color = "";
      }

      state.noteInfo.color = color;
      state.showMore = false;
      updateNote({
        color
      });
    }

    const basePath = location.href.split("#/")[0];

    /**
     * 新增便笺
     */
    function addNote() {
      const res = iHelper.db.insert({
        content: ""
      });
      iHelper.createBrowserWindow(`${basePath}#/note?_id=${res._id}`);
    }

    /**
     * 打开便笺列表
     */
    function openList() {
      iHelper.createBrowserWindow(getListViewInfo().viewUrl || basePath);
      state.showMore = false;
    }

    /**
     * 关闭便笺
     */
    async function beforeClose() {
      if (!editContent.value) {
        //  如果内容为空就直接从数据库删除
        iHelper.db.remove({
          _id,
        });

        //  通知主面板删除此条便笺
        iHelper.send(getListViewInfo().viewId, "notes-note-delete", {
          _id,
        });
      }
    }

    return {
      state,
      editContent,

      addNote,
      changeColor,
      openList,

      changeEditContent,
      beforeClose
    };
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
