<template>
  <div class="notes">
    <div class="notes-header">
      <button @click="addNote"
              title="新增便笺">新增</button>
    </div>
    <div v-for="(note, noteIndex) in state.notes"
         class="note-item"
         shadow="hover"
         :key="noteIndex"
         title="查看便笺"
         @click="openNoteWin(note)"
         @contextmenu.prevent="contextMenu($event, note, noteIndex)">
      <div>
        <div v-html="note.content || '新的便笺'"
             class="note-item__content">
        </div>
        <div class="note-item__date">
          {{ formatDate(note.updatedAt) }}
        </div>
      </div>
    </div>
    <div v-if="!state.notes.length"
         class="notes-empty">
      暂无内容哦
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, getCurrentInstance } from "vue";
import { NoteItem } from "./types";
import dayjs from "dayjs";

export default defineComponent({
  setup() {
    const state: {
      notes: Array<any>;
    } = reactive({
      notes: [],
    });

    const { proxy }:any = getCurrentInstance();

    /**
     * 获取便笺列表
     */
    function getAllNotes(): void {
      const data = iHelper.db.find();
      state.notes = data;
    }

    /**
     * 新增便笺
     */
    function addNote(): void {
      const res = iHelper.db.insert({
        content: "",
        className: "",
      });
      const winId = openNote(res._id);
      res.winId = winId;
      state.notes.unshift(res);
    }

    /**
     * 创建便笺窗体
     * @param _id
     */
    function openNote(_id: string): number {
      return iHelper.createBrowserWindow(`${location.href}note?_id=${_id}`);
    }

    /**
     * 打开便笺窗体
     */
    function openNoteWin(note): void {
      const winId = openNote(note._id);
      note.winId = winId;
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
      //  关闭被删除便笺的窗口
      iHelper.send(note.winId, "notes-note-delete");
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
    function formatDate(date) {
      const dayObj = dayjs(date);
      const isCurrentYear = dayObj.isSame(new Date().getFullYear(), "year");
      return dayObj.format(`${isCurrentYear ? "YYYY年" : ""}M月D日`);
    }

    /**
     * 监听事件
     */
    function onEvent() {
      //  便笺内容更新
      iHelper.on("notes-note-update", ({ _id, content }) => {
        state.notes.some((note) => {
          if (note._id === _id) {
            note.content = content;
            return true;
          }
        });
      });

      //  便笺关闭时，内容为空，直接删除
      iHelper.on("notes-note-delete", ({ _id }) => {
        const index = state.notes.findIndex((note) => note._id === _id);
        //  列表中移除
        delateNoteFormList(index);
      });
    }

    onBeforeMount(() => {
      getAllNotes();
      onEvent();
    });

    return {
      state,
      addNote,
      openNote,
      openNoteWin,
      contextMenu,
      formatDate,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
