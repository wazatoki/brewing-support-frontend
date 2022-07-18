<script setup>
import { reactive } from "vue";
import { Unit } from "@/models/unit";

defineProps({
  unitData: Unit,
  unitMsts: [],
});

const emit = defineEmits(["submitUnit", "clickCancel"]);

const form = reactive(new Unit());

const onSubmit = () => {
  emit(
    "submitUnit",
    new Unit(form.id, form.name, form.conversionFactor, form.baseUnit)
  );
};

const onCancel = () => {
  emit("clickCancel");
};
</script>

<template>
  <el-form :model="form">
    <el-row>
      <el-col :span="24">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="換算係数" :label-width="formLabelWidth">
          <el-input v-model="form.conversionFactor" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="基礎単位" :label-width="formLabelWidth">
          <el-select v-model="form.baseUnit" class="form-input">
            <el-option
              v-for="item in unitMsts"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button type="primary" @click="onSubmit">確定</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>
