import { computed, ComputedRef } from 'vue';

export default function useColor({ state }) {

  /**
   * 选择颜色
   */
  function colorChoose() {
    state.showMore = true;
  }

  /**
   * 改变字体颜色
   * @param value
   */
  function colorChange(value: string) {
    document.execCommand('ForeColor', false, value);
  }

  return {
    colorChoose,
    colorChange
  }
}
