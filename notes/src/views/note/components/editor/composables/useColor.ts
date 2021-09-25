import { computed, ComputedRef } from 'vue';

export default function useColor({ state }) {

  /**
   * 改变字体颜色
   * @param value
   */
  function colorChange(value: string) {
    document.execCommand('ForeColor', false, value);
  }

  return {
    colorChange
  }
}
