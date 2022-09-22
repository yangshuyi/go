<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';

const props = defineProps({
  value: {
    desc: "值",
    type: [String, Boolean, Number],
    required: false,
  },
  optionList: {
    desc: "下拉框选项列表",
    type: [Array, Object],
    required: true,
    default: [],
  },
  optionText: {
    desc: "下拉选项展示文字属性名",
    type: String,
    required: false,
    default: 'text',
  },
  optionValue: {
    desc: "下拉选项值属性名",
    comments: "该属性需要保持唯一性",
    type: String,
    required: false,
    default: 'value',
  },
  optionDisabledField: {
    desc: "选项为无法选择状态的属性名",
    comments: "",
    type: String,
    required: false,
    default: '$disabled',
  },
  allowEmptyOption: {
    desc: "是否支持空白选项",
    type: Boolean,
    required: false,
    default: true,
  },
  emptyOptionText: {
    desc: "空白选项展示字符",
    type: String,
    required: false,
    default: '请选择',
  },
  confirmButtonText: {
    desc: "确认按钮文字",
    type: String,
    required: false,
    default: '确认',
  },
  cancelButtonText: {
    desc: "取消按钮文字",
    type: String,
    required: false,
    default: '取消',
  },
  disabled: {
    desc: "是否禁用",
    type: Boolean,
    required: false,
    default: false,
  },
  placeholder: {
    desc: "Placeholder",
    type: String,
    required: false,
    default: "请选择",
  },
  optionContainerHeight: {
    desc: "下拉框高度样式",
    type: String,
    required: false,
    default: null,
  },
  hideOptionContainerAfterSelectOption: {
    desc: "选中选项后是否关闭下拉框",
    type: Boolean,
    required: false,
    default: true,
  },
});

const emits = defineEmits([
  'update:value',
  'afterOptionSelected'  //选择选项时触发
]);

let data = reactive({
  selectOptionText: '',
  optionList: [], //选项列表
  optionTextList: [], //选项文字列表
  optionContainer: {
    visible: false, //下拉列表是否显示
  }
});

watch(() => props.value, (newVal, oldVal) => {
  data.modelValue = props.value;
  updateOptionListStatus(data.optionList);
}, {immediate: true});

watch(() => props.optionList, (newVal, oldVal) => {
  data.optionList = buildOptionList(props.optionList);
  data.optionTextList = _.map(data.optionList, props.optionText);
}, {immediate: true});

const selectOptionIndex = computed(() => {
  const index = _.findIndex(data.optionList, (option) => {
    return option[props.optionValue] == data.modelValue;
  });
  return index;
});


function buildOptionList(pOptionList) {
  const optionList = [];

  if (pOptionList == null || pOptionList.length == 0) {
    return optionList;
  }

  var pOptionSample = _.sample(pOptionList);
  if (_.isObject(pOptionSample)) {
    //选项为对象模式
    _.each(pOptionList, (pOption) => {
      let option = JSON.parse(JSON.stringify(pOption));
      option.$selected = false;
      optionList.push(option);
    });
  } else {
    //选项为基本类型格式
    _.each(pOptionList, (pOption) => {
      let option = {};
      option[props.optionText] = "" + pOption;
      option[props.optionValue] = pOption;
      option[props.optionDisabledField] = false;
      option.$selected = false;
      optionList.push(option);
    });
  }

  updateOptionListStatus(optionList);

  return optionList;
}


/**
 * 更新下拉选项列表状态
 *
 * 设置选项为选中，未选中状态
 */
function updateOptionListStatus(optionList) {
  data.selectOptionText = '';
  _.each(optionList, (option) => {
    if (option[props.optionValue] == data.modelValue) {
      option.$selected = true;
      data.selectOptionText = option[props.optionText];
    } else {
      option.$selected = false;
    }
  });
}


/**
 * 展开/关闭下拉列表
 */
function handleToggleDropDown() {
  if (props.disabled) {
    return;
  }

  if (_.isEmpty(data.optionList)) {
    return;
  }

  if (data.optionContainer.visible == true) {
    hideOptionContainer();
  } else {
    showOptionContainer();
  }
}


/**
 * 展开下拉列表
 */
async function showOptionContainer() {
  if (props.disabled) {
    return;
  }

  let allowExecution = true;
  if (props.beforeOptionsContainerPopupFunc != null) {
    let result = await props.beforeOptionsContainerPopupFunc();
    if (result === false) {
      allowExecution = false;
    }
  }
  if (!allowExecution) {
    //中止调用
    return;
  }

  data.optionContainer.visible = true;
}

/**
 * 关闭下拉列表
 */
function hideOptionContainer() {
  data.optionContainer.visible = false;
}


async function handleOptionSelected(currOptionText, currOptionIndex) {
  if (props.disabled) {
    return;
  }

  let currOption = null;
  if (currOptionIndex >= 0) {
    currOption = data.optionList[currOptionIndex];
  }

  if (currOption && currOption[props.optionDisabledField] == true) {
    return;
  }

  if (props.hideOptionContainerAfterSelectOption) {
    hideOptionContainer();
  }

  const oldValue = data.modelValue;
  const oldOption = _.find(data.optionList, (option) => {
    return option[props.optionValue] == oldValue;
  });

  const newValue = currOption ? currOption[props.optionValue] : null;

  let allowExecution = true;
  if (props.beforeOptionSelectedFunc != null) {
    let result = await props.beforeOptionSelectedFunc({
      $oldOption: oldOption,
      $oldValue: oldValue,
      $newValue: newValue,
      $newOption: currOption,
    });
    if (result === false) {
      allowExecution = false;
    }
  }
  if (!allowExecution) {
    //中止调用
    return;
  }

  //应用当前的值
  data.modelValue = newValue;
  emits("update:value", data.modelValue);
  let eventArgs = {
    $oldOption: oldOption,
    $oldValue: oldValue,
    $newValue: newValue,
    $newOption: currOption,
  }

  setTimeout(() => {
    emits("afterOptionSelected", eventArgs);
  });
}
</script>

<template>
  <div class="van-field__control" @click="handleToggleDropDown">{{ data.selectOptionText }}</div>
  <div class="van-field__right-icon" @click="handleToggleDropDown">
    <van-icon name="arrow" color="#A8ABB3"/>
  </div>

  <van-popup v-model:show="data.optionContainer.visible" position="bottom" round>
    <van-picker show-toolbar :columns="data.optionTextList" :default-index="selectOptionIndex" item-height="50" :confirm-button-text="confirmButtonText" :cancel-button-text="cancelButtonText"
                @cancel="hideOptionContainer" @confirm="handleOptionSelected">
    </van-picker>
  </van-popup>
</template>

<style lang="scss">
.van-field__control{
  align-self: stretch;
}
</style>
