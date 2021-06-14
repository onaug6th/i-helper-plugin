<template>
  <div class="notes">
    <div class="notes-header">
      <button type="primary" size="mini" @click="addNote">新增</button>
    </div>
    <div
      v-for="(note, noteIndex) in state.notes"
      class="note-item"
      shadow="hover"
      :key="noteIndex"
      @click="openNoteWin(note)"
      @contextmenu.prevent="contextMenu($event, note, noteIndex)"
    >
      <div>
        <div class="note-item__content" v-html="note.content || '新便笺'"></div>
        <div class="note-item__date">
          {{ dayjs(note.updatedAt).format("YYYY-MM-DD hh:mm:ss") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from "vue";
import dayjs from "dayjs";
import ContextMenu from "@onaug6th/vue3-context-menu/dist/vue3-context-menu.es";
import { NoteItem } from "./types";

export default defineComponent({
  setup() {
    const state: {
      notes: Array<any>;
    } = reactive({
      notes: [],
    });

    /**
     * 获取便笺列表
     */
    async function getAllNotes() {
      state.notes = iHelper.db.findAndSort({}, { updatedAt: -1 })
    }

    /**
     * 新增便笺
     */
    function addNote() {
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
     * @param id
     */
    function openNote(id: string) {
      return iHelper.createBrowserWindow(`${location.href}note?id=${id}`).browserViewId;
    }

    /**
     * 打开便笺窗体
     */
    function openNoteWin(note) {
      const winId = openNote(note.id);
      note.winId = winId;
    }

    /**
     * 从列表中移除便笺
     * @param noteIndex
     */
    function delateNoteFormList(noteIndex: number) {
      state.notes.splice(noteIndex, 1);
    }

    /**
     * 删除便笺
     * @param note
     * @param noteIndex
     */
    function deleteNote(note: NoteItem, noteIndex: number) {
      //  通知主进程关闭便笺的窗口
      iHelper.send(note.winId, "notes-note-close");
      delateNoteFormList(noteIndex);
      iHelper.db.remove({
        id: note.id,
      });
    }

    /**
     * 右键菜单
     * @param event
     * @param note
     * @param noteIndex
     */
    function contextMenu(event: MouseEvent, note: NoteItem, noteIndex: number) {
      ContextMenu({
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

    function onIpcEvent() {
      iHelper.on('notes-note-update', ({ id, content }) => {
        state.notes.some(note => {
          if (note.id === id) {
            note.content = content;
            return true;
          }
        });
      });

      iHelper.on('notes-note-delete', ({ id }) => {
        const index = state.notes.findIndex(note => note.id === id);
        delateNoteFormList(index);
      });
    }

    onBeforeMount(() => {
      getAllNotes();
      onIpcEvent();
    });

    return {
      state,
      addNote,
      openNote,
      openNoteWin,
      dayjs,
      contextMenu,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
