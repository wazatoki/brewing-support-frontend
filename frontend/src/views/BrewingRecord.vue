<script setup>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import BrewingRecordSelect from "@/components/BrewingRecordSelect.vue";
import { BrewEvent } from "@/models/brewEvent";
import { BrewPlan } from "@/models/brewPlan";
import { reactive, ref, onMounted } from "vue";
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElDialog,
} from "element-plus/dist/index.full.js";
import * as ingredientRepo from "@/repositories/ingredientRepo";
import * as ingredientService from "@/services/ingredient";
import * as brewEventRepo from "@/repositories/brewEventRepo";
import { ElMessageBox } from "element-plus";

const formLabelWidth = "140px";
const brewPlan = reactive(new BrewPlan());
const brewPlanformRef = ref();

function brewPlanformVallidate(formEl, callback) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      if (callback) {
        callback();
      }
      console.log("form vallidate true");
    } else {
      console.log("form vallidate false");
      return false;
    }
  });
}

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "timeGridWeek",
  selectable: true,
  editable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: onSelectCalender,
  eventClick: onClickCalenderEvent,
  eventDrop: onChangeCalendarEvent,
  eventResize: onChangeCalendarEvent,
});

const itemMsts = reactive([]);

const brewEventDialogVisible = ref(false);
const brewPlanDialogVisible = ref(true);
const brewEvents = [];
const a_brewEvent = reactive(new BrewEvent());

let calendarApi;

function onSelectCalender(info) {
  calendarApi = info.view.calendar;
  calendarApi.unselect(); // clear date selection

  brewPlanformVallidate(brewPlanformRef.value, () => {
    a_brewEvent.id = "";
    a_brewEvent.name = "";
    a_brewEvent.desc = "";
    a_brewEvent.from = info.start;
    a_brewEvent.to = info.end;
    a_brewEvent.brewPlanID = brewPlan.id;
    brewEventDialogVisible.value = true; // 編集用ダイアログを開く
  });
}

function onClickCalenderEvent(info) {
  const brewEvent = brewEvents.find(
    (calenderEvent) => calenderEvent.id === info.event.id
  );
  if (brewEvent) {
    a_brewEvent.id = brewEvent.id;
    a_brewEvent.name = brewEvent.name;
    a_brewEvent.desc = brewEvent.desc;
    a_brewEvent.from = brewEvent.from;
    a_brewEvent.to = brewEvent.to;
    a_brewEvent.brewPlanID = brewEvent.brewPlanID;
    brewEventDialogVisible.value = true;
  }
}

async function onSubmitBrewEvent(submitedBrewEvent) {
  brewEventDialogVisible.value = false; // 編集用ダイアログを閉じる

  try {
    // db送信
    await brewEventRepo.save(submitedBrewEvent);
    // calenderEvent更新処理
    const calenderEvent = {
      id: submitedBrewEvent.id,
      title: submitedBrewEvent.name,
      start: submitedBrewEvent.from,
      end: submitedBrewEvent.to,
    };

    const event = calendarApi.getEventById(submitedBrewEvent.id);

    if (event) {
      // 更新の場合
      event.remove();
      calendarApi.addEvent(calenderEvent);
    } else {
      // 新規作成の場合
      calendarApi.addEvent(calenderEvent);
    }

    // brewEvent更新処理
    fetchBrewEvents();
  } catch (error) {
    ElMessageBox.alert("データの保存に失敗しました。" + error.message, {
      confirmButtonText: "OK",
    });
  }
}

async function onChangeCalendarEvent(info) {
  const be = brewEvents.find((brewEvent) => brewEvent.id === info.event.id);
  if (be) {
    be.name = info.event.title;
    if (info.event.start) {
      be.from = info.event.start;
    }
    if (info.event.end) {
      be.to = info.event.end;
    }

    // db送信
    await brewEventRepo.save(be);
    // brewEvent更新処理
    fetchBrewEvents();
  }
}

function onClickBrewingRecordFormDelete(id) {
  brewEventDialogVisible.value = false;

  // calenderEvent削除処理
  const event = calendarApi.getEventById(id);
  if (event) {
    event.remove();
  }

  // brewEvent削除処理
  const beIndex = brewEvents.findIndex((e) => e.id === id);
  if (beIndex >= 0) {
    brewEvents.splice(beIndex, 1);
  }
}

function onClickBrewingRecordFormCancel() {
  brewEventDialogVisible.value = false;
}

const fetchBrewEvents = async () => {
  if (brewPlan.id) {
    const fetchedBrewEvents = (await brewEventRepo.fetchAll()).result;
    brewEvents.splice(0);
    const filteredBrewEvents = fetchedBrewEvents.filter((brewEvent) => {
      return brewEvent.brewPlanID === brewPlan.id;
    });
    filteredBrewEvents.forEach((item) => {
      brewEvents.push(item);
    });
  }
};

onMounted(() => {
  fetchIngredientMst();
});

const fetchIngredientMst = async () => {
  const fetchedData = (await ingredientRepo.fetchAll()).result;
  const sortedData =
    ingredientService.sortByClassifientNameAndName(fetchedData);
  itemMsts.splice(0);
  sortedData.forEach((item) => {
    itemMsts.push(item);
  });
};
</script>

<template>
  <div class="brewing-record">
    <el-row>
      <el-col :span="12">
        <div>brew plan</div>
        <div>
          <el-form ref="brewPlanformRef" :model="brewPlan">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="batch number"
                  :label-width="formLabelWidth"
                  prop="batchNumber"
                  :rules="[
                    {
                      required: true,
                      message: 'batch number is required',
                    },
                    {
                      type: 'number',
                      message: 'batch number must be a number',
                    },
                  ]"
                >
                  <el-input
                    type="text"
                    autocomplete="off"
                    v-model.number="brewPlan.batchNumber"
                    @blur="brewPlanformVallidate(brewPlanformRef)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="batch name"
                  :label-width="formLabelWidth"
                  prop="name"
                  :rules="[
                    { required: true, message: 'batch name is required' },
                  ]"
                >
                  <el-input
                    type="text"
                    autocomplete="off"
                    v-model="brewPlan.name"
                    @blur="brewPlanformVallidate(brewPlanformRef)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div>brew event</div>
        <div>
          <FullCalendar :options="calendarOptions" />
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="brewEventDialogVisible">
      <BrewingRecordForm
        :brewEvent="a_brewEvent"
        :brewPlan="brewPlan"
        :itemMsts="itemMsts"
        @submitBrewEvent="onSubmitBrewEvent($event)"
        @clickCancel="onClickBrewingRecordFormCancel"
        @clickDelete="onClickBrewingRecordFormDelete($event)"
      >
      </BrewingRecordForm>
    </el-dialog>
    <!--<el-dialog v-model="brewPlanDialogVisible">
      <BrewingRecordSelect :itemMsts="itemMsts"></BrewingRecordSelect>
    </el-dialog>-->
  </div>
</template>
