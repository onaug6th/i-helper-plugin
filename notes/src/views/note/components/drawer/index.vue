<template>
  <div class="drawer-container"
       :class="drawerContainerClassName">
    <div class="drawer-shade"
         :class="shadeClassName"
         @click="visibleModel = false"></div>
    <div class="drawer-content"
         :class="isTop ? 'drawer-content__top' : 'drawer-content__bottom'">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: 'drawer',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: "top",
    },
    shade: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const visibleModel = computed({
      get() {
        return props.visible;
      },
      set(visible: boolean) {
        emit("update:visible", visible);
      },
    });

    const isTop = computed(() => {
      return props.direction === "top";
    });

    const drawerContainerClassName = computed(() => {
      const className: Array<string> = [];

      if (visibleModel.value) {
        className.push("drawer-show");

        if (isTop.value) {
          className.push("drawer-show__top");
        } else {
          className.push("drawer-show__bottom");
        }
      }
      return className;
    });

    const shadeClassName = computed(() => {
      const className: Array<string> = [];

      if(!props.shade) {
        className.push('drawer-shade__hidden')
      }
      return className;
    });

    return {
      visibleModel,
      isTop,
      drawerContainerClassName,
      shadeClassName
    };
  },
});
</script>

<style lang="less" scoped>
.drawer-container {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: z-index 0.4s;
}

.drawer-shade {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  bottom: 0;
  left: 0;
  transition: all 0.4s;

  &__hidden {
    background-color: unset;
  }
}

.drawer-content {
  position: absolute;
  width: 100%;
  z-index: 2;
  box-shadow: 0 0 4px #d9d9d9;
  background-color: #fff;
  transition: top 0.4s, bottom 0.4s;

  &__top {
    top: -500px;
  }

  &__bottom {
    bottom: -500px;
  }
}

.drawer-show {
  z-index: 3;
  transition: z-index 0.4s;

  &__top {
    .drawer-content {
      top: 0;
    }
  }

  &__bottom {
    .drawer-content {
      bottom: 0;
    }
  }

  .drawer-shade {
    z-index: 1;
    opacity: 1;
    transition: all 0.4s;
  }
}
</style>
