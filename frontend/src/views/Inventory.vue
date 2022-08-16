<script setup>
import { fetchAll, save, remove } from "@/repositories/inventoryRepo";
import { reactive, ref, onMounted } from "vue";
import InventoryForm from "@/components/InventoryForm.vue";
import { Inventory } from "@/models/inventory";
import * as inventoryService from "@/services/inventory";
import { ElMessageBox } from "element-plus";

const tableData = reactive([]);
const inventoryData = reactive(new Inventory("", new Date(), 0, 0, 0, ""));
const InventoryFormDialogVisible = ref(false);

const onClickDelete = async (index) => {
  await ElMessageBox.confirm("データを削除しますか?", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "alert",
  });
  const item = tableData[index];
  try {
    await remove(item);
    ElMessageBox.alert("データの削除に成功しました。", {
      confirmButtonText: "OK",
    });
    fetchData();
  } catch (error) {
    ElMessageBox.alert("データの削除に失敗しました。" + error.message, {
      confirmButtonText: "OK",
    });
  }
};

const onClickEdit = (index) => {
  const item = tableData[index];
  inventoryData.id = item.id;
  inventoryData.ingredient = item.ingredient;
  inventoryData.onDate = item.onDate;
  inventoryData.resultValue = item.resultValue;
  inventoryData.calculatedValue = item.calculatedValue;
  inventoryData.adjustedValue = item.adjustedValue;
  inventoryData.note = item.note;
  InventoryFormDialogVisible.value = true;
};

const onClickCreate = () => {
  inventoryData.clear();
  InventoryFormDialogVisible.value = true;
};

const onSubmitInventoryForm = async (inventoryData) => {
  InventoryFormDialogVisible.value = false;
  try {
    await save(inventoryData);
    ElMessageBox.alert("データの保存に成功しました。", {
      confirmButtonText: "OK",
    });
    fetchData();
  } catch (error) {
    ElMessageBox.alert("データの保存に失敗しました。" + error.message, {
      confirmButtonText: "OK",
    });
  }
};

const onClickInventoryFormCancel = () => {
  InventoryFormDialogVisible.value = false;
};

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const data = await fetchAll();
  const sortedData = inventoryService.sortByDate(data.result);
  tableData.splice(0);
  sortedData.forEach((item) => {
    tableData.push(item);
  });
};
</script>

<template>
  <div class="supplier-master">
    <el-row>
      <el-col :span="6">
        <el-menu>
          <el-menu-item @click="onClickCreate">新規作成</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column>
            <template #default="scope">
              <el-button @click="onClickEdit(scope.$index, scope.row)"
                >修正</el-button
              >
              <el-button
                type="danger"
                @click="onClickDelete(scope.$index, scope.row)"
                >削除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog v-model="masterSupplierFormDialogVisible">
      <MasterSupplierForm
        :supplierData="a_supplierData"
        @submit="onSubmitSupplier($event)"
        @cancel="onClickMasterSupplierFormCancel"
      >
      </MasterSupplierForm>
    </el-dialog>
  </div>
</template>
