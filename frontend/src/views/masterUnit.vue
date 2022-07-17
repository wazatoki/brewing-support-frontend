<script setup>
import { fetchAll } from "@/repositories/unitRepo";
import { reactive } from "vue";

const tableData = reactive([]);

const fetchData = async () => {
  return fetchAll();
};
</script>

<template>
  <div class="unit-master">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="conversionFactor" label="換算係数" width="180" />
      <el-table-column prop="baseUnit" label="基礎単位" />
    </el-table>
  </div>
</template>
