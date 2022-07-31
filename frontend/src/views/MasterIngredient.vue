<script setup>
import { reactive, ref, onMounted } from "vue";
import { fetchAll, save, remove } from "@/repositories/ingredientRepo";
import { fetchAll as unitFetchAll } from "@/repositories/unitRepo";
import { Ingredient, IngredientMember } from "@/models/ingredient";
import { Unit } from "@/models/unit";
import { sortByNameAndConversionFactor } from "@/services/unit";
import MasterIngredientFormVue from "@/components/MasterIngredientForm.vue";

const tableData = reactive([]);
const unitMsts = reactive([]);
const a_ingredientData = reactive(new Ingredient("", "", new Unit()));
const masterIngredientFormDialogVisible = ref(false);
const onClickCreate = () => {
  a_ingredientData.clear();
  masterIngredientFormDialogVisible.value = true;
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
    </el-row>
    <el-dialog v-model="masterIngredientFormDialogVisible">
      <MasterIngredientFormVue
        :ingredientData="a_ingredientData"
        :unitMsts="unitMsts"
        @submitUnit="onSubmitUnit($event)"
        @clickCancel="onClickMasterUnitFormCancel"
      >
      </MasterIngredientFormVue>
    </el-dialog>
  </div>
</template>
