<template>
  <Todo-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TodoList from './components/todoList/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    TodoList
  }
})
</script>

<style>
body {
  margin: 0px;
  padding-bottom: 20px;
  overflow-y: overlay;
}
</style>
