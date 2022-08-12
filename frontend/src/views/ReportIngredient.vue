<script setup>
import { onMounted, reactive, ref } from "vue";
import * as brewEventRepo from "@/repositories/brewEventRepo";
import * as ingredientRepo from "@/repositories/ingredientRepo";
import * as ingredientClassificationRepo from "@/repositories/ingredientClassificationRepo";

const ingredientClassifications = reactive([]);
const ingredients = reactive([]);
const tableData = reactive([]);
const selectedIngredientClassificationID = ref();
const selectedIngredientID = ref();
const ingredientsBuffer = [];
const brewEventsBuffer = [];

onMounted(async () => {
  brewEventsBuffer.splice(0);
  ingredientsBuffer.splice(0);
  ingredientClassifications.splice(0);

  (await brewEventRepo.fetchAll()).result.forEach((item) => {
    brewEventsBuffer.push(item);
  });
  (await ingredientRepo.fetchAll()).result.forEach((item) => {
    ingredientsBuffer.push(item);
  });
  (await ingredientClassificationRepo.fetchAll()).result.forEach((item) => {
    ingredientClassifications.push(item);
  });
});

const onChangeIngredientClassification = () => {
  const filterdIngredients = ingredientsBuffer.filter(
    (item) =>
      item.ingredientClassification.id ===
      selectedIngredientClassificationID.value
  );
  ingredients.splice(0);
  filterdIngredients.forEach((item) => {
    ingredients.push(item);
  });
};

const onChangeIngredient = () => {
  tableData.splice(0);
  brewEventsBuffer.forEach((brewEvent) => {
    brewEvent.ingredients.forEach((consumedIngredient) => {
      if (consumedIngredient.ingredient.id === selectedIngredientID.value) {
        tableData.push({
          fromDate: brewEvent.from,
          ingredient: consumedIngredient.ingredient,
          quantity: consumedIngredient.quantity,
        });
      }
    });
  });
};
</script>

<template>
  <div class="report-ingredient">
    <el-row>
      <el-col :span="6">
        <el-row>
          <el-radio-group
            v-model="selectedIngredientClassificationID"
            @change="onChangeIngredientClassification"
          >
            <el-radio
              v-for="ingredientClassification in ingredientClassifications"
              :key="ingredientClassification.id"
              :label="ingredientClassification.id"
              >{{ ingredientClassification.name }}</el-radio
            >
          </el-radio-group>
        </el-row>
        <el-row>
          <el-radio-group
            v-model="selectedIngredientID"
            @change="onChangeIngredient"
          >
            <el-radio
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              :label="ingredient.id"
              >{{ ingredient.name }}</el-radio
            >
          </el-radio-group>
        </el-row>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="fromDate" label="日付" width="180" />
            <el-table-column prop="ingredient.name" label="名称" width="180" />
            <el-table-column prop="quantity" label="使用数" />
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
