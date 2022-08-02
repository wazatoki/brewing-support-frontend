<script setup>
import { reactive, ref, onMounted } from "vue";
import { fetchAll, save, remove } from "@/repositories/ingredientRepo";
import { fetchAll as unitFetchAll } from "@/repositories/unitRepo";
import { Ingredient } from "@/models/ingredient";
import { Unit } from "@/models/unit";
import { sortByNameAndConversionFactor } from "@/services/unit";
import MasterIngredientFormVue from "@/components/MasterIngredientForm.vue";
import { ElMessageBox } from "element-plus";

const tableData = reactive([]);
const unitMsts = reactive([]);
const a_ingredientData = reactive(
  new Ingredient("", "", new Unit()),
  new Unit(),
  new Unit()
);
const masterIngredientFormDialogVisible = ref(false);
const onClickCreate = () => {
  a_ingredientData.clear();
  masterIngredientFormDialogVisible.value = true;
};

const onSubmitIngredient = async (ingredientData) => {
  masterIngredientFormDialogVisible.value = false;
  try {
    await save(ingredientData);
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

const onClickMasterIngredientFormCancel = () => {
  masterIngredientFormDialogVisible.value = false;
};

onMounted(() => {
  fetchData();
  fetchUnitMsts();
});

const fetchUnitMsts = async () => {
  const data = await unitFetchAll();
  const sortedData = sortByNameAndConversionFactor(data.result);
  unitMsts.splice(0);
  sortedData.forEach((item) => {
    unitMsts.push(item);
  });
};

const fetchData = async () => {
  const data = await fetchAll();
  data.result.sort((item_a, item_b) => {
    let item_a_base_name;
    let item_b_base_name;

    item_a_base_name = item_a.name;
    item_b_base_name = item_b.name;

    if (item_a_base_name > item_b_base_name) {
      return 1;
    }
    if (item_a_base_name < item_b_base_name) {
      return -1;
    }

    return -1;
  });

  tableData.splice(0);

  data.result.forEach((item) => {
    tableData.push(item);
  });
};
</script>

<template>
  <div class="ingredient-master">
    <el-row>
      <el-col :span="6">
        <el-menu>
          <el-menu-item @click="onClickCreate">新規作成</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="brewingUnit.name" label="使用単位" />
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
    <el-dialog v-model="masterIngredientFormDialogVisible">
      <MasterIngredientFormVue
        :ingredientData="a_ingredientData"
        :unitMsts="unitMsts"
        @submitIngredient="onSubmitIngredient($event)"
        @clickCancel="onClickMasterIngredientFormCancel"
      >
      </MasterIngredientFormVue>
    </el-dialog>
  </div>
</template>
