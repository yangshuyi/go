<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';

const props = defineProps({
  value: {
    desc: "值",
    type: Array,
    required: false,
  },
  optionList: {
    desc: "选项列表",
    type: Array,
    required: true,
    default: [],
  },
  disabled: {
    desc: "是否禁用",
    type: Boolean,
    required: false,
    default: false,
  },
});

const emits = defineEmits([
  'update:value',
  'afterOptionSelected'  //选择选项时触发
]);

const data = reactive({
  modelValue: props.value, //数据值，为数组选中值类型
  optionList: [], //选项列表
});

watch(() => props.value, (newVal, oldVal) => {
  data.modelValue = props.value;
  updateOptionListStatus(data.optionList);
}, {immediate: true});

watch(() => props.optionList, (newVal, oldVal) => {
  data.optionList = buildOptionList(props.optionList);
}, {immediate: true});

function buildOptionList(pOptionList) {
  const optionList = [];

  if (pOptionList == null || pOptionList.length == 0) {
    return optionList;
  }

  //选项为基本类型格式
  _.each(pOptionList, (pOption) => {
    let option = {};
    option.text = "" + pOption;
    option.$disabled = false;
    option.$selected = false;
    optionList.push(option);
  });

  updateOptionListStatus(optionList);

  return optionList;
}


/**
 * 更新下拉选项列表状态
 *
 * 设置选项为选中，未选中状态
 */
function updateOptionListStatus(optionList) {
  _.each(optionList, (option) => {
    if (_.includes(data.modelValue, option.text)) {
      option.$selected = true;
    } else {
      option.$selected = false;
    }
  });
}

async function handleOptionSelected(currOption) {
  if (props.disabled) {
    return;
  }

  if (currOption && currOption.$disabled == true) {
    return;
  }
  currOption.$selected = !currOption.$selected;

  const oldValues = data.modelValue;
  const newValue = currOption ? currOption.text : null;

  //应用当前的值
  data.modelValue = _.map(_.filter(data.optionList, {$selected: true}), 'text');
  emits("update:value", data.modelValue);

  let eventArgs = {
    $oldValues: oldValues,
    $newValues: data.modelValue,
  }

  setTimeout(() => {
    emits("afterOptionSelected", eventArgs);
  });
}
</script>

<template>
  <div class="tag-selector">
    <template v-for="tag in data.optionList">
      <van-tag size="large" type="primary" :plain="!tag.$selected" @click="handleOptionSelected(tag)">{{ tag.text }}</van-tag>
    </template>
  </div>
</template>

<style lang="scss">
.van-field__control {
  align-self: stretch;
}

.tag-selector{
  > * {
    display: inline-block;
    margin: 5px;
    min-width: 60px;
    text-align: center;
  }
}
</style>
