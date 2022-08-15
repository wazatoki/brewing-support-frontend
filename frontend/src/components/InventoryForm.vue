<script setup>
import { reactive, ref } from "vue";
import { Inventory } from "@/models/inventory";

const props = defineProps({
  inventory: Inventory,
});

const emit = defineEmits(["submit", "cancel"]);

const form = reactive(props.inventory);

const rules = reactive({
  onDate: [
    { required: true, message: "実施日付は必須項目です。", trigger: "blur" },
  ],
  resultValue: [
    {
      required: true,
      message: "確認数量は必須です。",
      trigger: "blur",
    },
    {
      type: "number",
      message: "確認数量は数値を入力してください。",
      trigger: "blur",
    },
  ],
  adjustedValue: [
    {
      required: true,
      message: "修正数量は必須です。",
      trigger: "blur",
    },
    {
      type: "number",
      message: "修正数量は数値を入力してください。",
      trigger: "blur",
    },
  ],
});

const formRef = ref();

const onSubmit = async (formEl) => {
  if (!formEl) {
    return;
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit(
        "submit",
        new Inventory(
          form.id,
          form.onDate,
          form.resultValue,
          form.calculatedValue,
          form.adjustedValue,
          form.note
        )
      );
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const onCancel = () => {
  emit("cancel");
};
</script>

<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-row>
      <el-col :span="24">
        <el-form-item
          label="実施日付"
          :label-width="formLabelWidth"
          prop="onDate"
        >
          <el-date-picker
            v-model="form.onDate"
            type="datetime"
            placeholder="Select date and time"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <label>計算数量:</label><span>{{ form.calculatedValue }}</span>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="確認数量"
          :label-width="formLabelWidth"
          prop="resultValue"
        >
          <el-input v-model="form.resultValue" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="修正数量"
          :label-width="formLabelWidth"
          prop="adjustedValue"
        >
          <el-input v-model="form.adjustedValue" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="備考" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.note" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button type="primary" @click="onSubmit(formRef)">確定</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
