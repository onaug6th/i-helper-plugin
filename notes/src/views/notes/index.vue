<template>
  <Header addTitle="新增便笺"
          :btns="['add', 'pin', 'close']"
          @add="addNote" />
  <div class="notes">
    <div class="title">
      便笺
    </div>

    <div class="search">
      <input v-model="state.searchText"
             type="text"
             placeholder="搜索…" />
    </div>

    <div v-for="(note, noteIndex) in showNotes"
         class="note-item"
         shadow="hover"
         title="打开便笺"
         :key="noteIndex"
         :style="{
           backgroundColor: note.color
         }"
         @click="openNoteWin(note)"
         @contextmenu.prevent="contextMenu($event, note, noteIndex)">
      <div>
        <div v-html="note.showContent || '新的便笺'"
             class="note-item__content">
        </div>
        <div class="note-item__date">
          {{ formatDate(note.updatedAt) }}
        </div>
      </div>
    </div>
    <div v-if="!showNotes.length"
         class="notes-empty">
      暂无内容哦
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  reactive,
  getCurrentInstance,
  computed,
} from "vue";
import { NoteItem } from "./types";
import dayjs from "dayjs";
import Header from "../../components/header/index.vue";

export default defineComponent({
  components: {
    Header,
  },
  setup() {
    const state: {
      searchText: string;
      notes: Array<any>;
    } = reactive({
      searchText: "",
      notes: [],
    });

    const showNotes = computed(() => {
      return state.notes.filter((note) => {
        return note.content.includes(state.searchText);
      });
    });

    const { proxy }: any = getCurrentInstance();

    /**
     * 获取便笺列表
     */
    function getAllNotes(): void {
      const data = iHelper.db.find();
      state.notes = data.map((note) => {
        const index = 80;
        const textOnIndexIsBrackets = note.content[index] === "<";
        //  为了降低渲染压力
        note.showContent =
          note.content.slice(0, textOnIndexIsBrackets ? index : index + 1) + "...";
        return note;
      });
    }

    /**
     * 新增便笺
     */
    function addNote(): void {
      const res = iHelper.db.insert({
        content: "",
      });
      openNote(res._id);
      state.notes.unshift(res);
    }

    /**
     * 创建便笺窗体
     * @param _id
     */
    function openNote(_id: string): number {
      /**
       * location.href
       * prod:
       * "file:///C:/Users/IT-user/Desktop/project/ihelper-plugin/notes/ihelper/dist/index.html#/notes"
       * "file:///C:/Users/IT-user/Desktop/project/ihelper-plugin/notes/ihelper/dist/index.html#/note?_id=Sltx90yRVEvVMSNC"
       *
       *
       * dev:
       * "http://localhost:9528/#/notes"
       * "http://localhost:9528/#/note?_id=Sltx90yRVEvVMSNC"
       */
      const basePath = location.href.split("#/")[0];

      return iHelper.createBrowserWindow(`${basePath}#/note?_id=${_id}`);
    }

    /**
     * 打开便笺窗体
     */
    function openNoteWin(note): void {
      openNote(note._id);
    }

    /**
     * 从列表中移除便笺
     * @param noteIndex
     */
    function delateNoteFormList(noteIndex: number): void {
      state.notes.splice(noteIndex, 1);
    }

    /**
     * 删除便笺
     * @param note
     * @param noteIndex
     */
    function deleteNote(note: NoteItem, noteIndex: number): void {
      const viewId = iHelper
        .getPluginWinsInfo()
        .filter(({ viewUrl }) => viewUrl.includes(note._id))[0]?.viewId;

      if (viewId) {
        //  关闭被删除便笺的窗口
        iHelper.send(viewId, "note-delete");
      }

      //  列表中移除
      delateNoteFormList(noteIndex);
      //  数据库中移除
      iHelper.db.remove({
        _id: note._id,
      });
    }

    /**
     * 右键菜单
     * @param event
     * @param note
     * @param noteIndex
     */
    function contextMenu(
      event: MouseEvent,
      note: NoteItem,
      noteIndex: number
    ): void {
      proxy.$contextMenu({
        event,
        list: [
          {
            text: "打开便笺",
            handler() {
              openNoteWin(note);
            },
          },
          {
            text: "删除便笺",
            handler() {
              deleteNote(note, noteIndex);
            },
          },
        ],
      });
    }

    /**
     * 日期格式化
     * @param date
     */
    function formatDate(date: string) {
      const dayObj = dayjs(date);
      const isCurrentYear = dayObj.isSame(new Date().getFullYear(), "year");
      return dayObj.format(`${isCurrentYear ? "YYYY年" : ""}M月D日`);
    }

    /**
     * 监听事件
     */
    function onEvent() {
      //  便笺内容更新
      iHelper.on("notes-note-update", ({ _id, ...otherAttr }) => {
        getAllNotes();
      });

      //  便笺关闭时，内容为空，直接删除
      iHelper.on("notes-note-delete", () => {
        getAllNotes();
      });
    }

    onBeforeMount(() => {
      getAllNotes();
      onEvent();
    });

    return {
      state,
      showNotes,

      formatDate,

      addNote,
      openNote,
      openNoteWin,
      contextMenu,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
<style lang="less">
.note-item__content {
  img {
    max-width: 100%;
    max-height: 100px;
    object-fit: cover;
  }
}
</style>
