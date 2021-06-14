<template>
  <Editor :content="editContent" @change="changeEditContent" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import Editor from "./components/editor/index.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Editor,
  },
  setup() {
    let id: string;
    const editContent = ref("");
    const route = useRoute();
    const routeId = route.query.id as string;
    const { fatherId } = iHelper.getWinInfo();

    onBeforeMount(() => {
      initEditorContent();

      iHelper.on('notes-note-close', () => {
        //  关闭此便笺
        //  @TODO
      });
    });

    /**
     * 生成编辑器内容
     */
    function initEditorContent() {
      if (routeId) {
        id = routeId;
        getNoteItem(routeId);
      } else {
        alert("不存在此便笺");
      }
    }

    /**
     * 获取当前便笺内容
     * @param id
     */
    function getNoteItem(id: string) {
      const info = iHelper.db.findOne({ id });
      if (!info) return;
      editContent.value = info.content;
    }

    /**
     * 更新便笺内容
     * @param content 内容
     */
    function changeEditContent(content: string) {
      editContent.value = content;
      if (!id) {
        return false;
      }
      iHelper.db.update(
        {
          id,
        },
        {
          id,
          content,
        }
      );
      //  通知主面板更新便笺内容
      iHelper.send(fatherId, "notes-note-update", {
        id,
        content,
      });
    }

    /**
     * 关闭便笺
     */
    async function close() {
      if (!editContent.value) {
        //  如果内容为空就直接从数据库删除
        iHelper.db.remove({
          id,
        });

        //  通知主面板更新便笺内容
        iHelper.send(fatherId, "notes-note-delete", {
          id
        });
      }
    }

    return {
      editContent,
      changeEditContent,
      close,
    };
  },
});
</script>

<style lang="less" scoped></style>
