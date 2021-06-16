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
    const editContent = ref("");
    const route = useRoute();
    const _id = route.query._id as string;
    const { fatherViewId } = iHelper.getWinInfo();

    onBeforeMount(() => {
      initEditorContent();

      iHelper.on('notes-note-delete', () => {
        //  关闭此便笺
        iHelper.close();
      });
    });

    /**
     * 初始化编辑器内容
     */
    function initEditorContent() {
      if (_id) {
        getNoteItem(_id);
      } else {
        alert("不存在此便笺");
      }
    }

    /**
     * 获取当前便笺内容
     * @param _id
     */
    function getNoteItem(_id: string) {
      const info = iHelper.db.findOne({ _id });
      if (info) {
        editContent.value = info.content;
      }
    }

    /**
     * 更新便笺内容
     * @param content 内容
     */
    function changeEditContent(content: string) {
      editContent.value = content;
      if (!_id) {
        return false;
      }
      iHelper.db.update(
        {
          _id,
        },
        {
          _id,
          content,
        }
      );

      //  通知主面板更新便笺内容
      iHelper.send(fatherViewId, "notes-note-update", {
        _id,
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
          _id,
        });

        //  通知主面板删除此条便笺
        iHelper.send(fatherViewId, "notes-note-delete", {
          _id
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
