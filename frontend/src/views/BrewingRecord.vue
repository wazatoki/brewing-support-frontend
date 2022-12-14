<script setup>
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import BrewingPlanForm from "@/components/BrewingPlanForm.vue";
import { BrewEvent } from "@/models/brewEvent";
import { BrewPlan } from "@/models/brewPlan";
import { reactive, ref, onMounted } from "vue";
import { ElRow, ElCol, ElDialog } from "element-plus/dist/index.full.js";
import * as ingredientRepo from "@/repositories/ingredientRepo";
import * as ingredientService from "@/services/ingredient";
import * as brewEventRepo from "@/repositories/brewEventRepo";
import { ElMessageBox } from "element-plus";
import * as brewPlanRepo from "@/repositories/brewPlanRepo";
import * as brewPlanService from "@/services/brewPlan";
import BrewingPlanSelectForm from "@/components/BrewingPlanSelectForm.vue";

const brewPlans = reactive([]);
const brewPlan = reactive(new BrewPlan());
const brewPlanSelectFormDialogVisible = ref(false);
const calendarEvents = reactive([]);

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
  events: calendarEvents,
  select: onSelectCalender,
  eventClick: onClickCalenderEvent,
  eventDrop: onChangeCalendarEvent,
  eventResize: onChangeCalendarEvent,
});

const itemMsts = reactive([]);

const brewEventDialogVisible = ref(false);
const brewPlanFormDialogVisible = ref(false);
const brewEvents = [];
const a_brewEvent = reactive(new BrewEvent());

let calendarApi;

function onSelectCalender(info) {
  calendarApi = info.view.calendar;
  calendarApi.unselect(); // clear date selection

  if (brewPlan.id) {
    brewEventClear();
    a_brewEvent.from = info.start;
    a_brewEvent.to = info.end;
    a_brewEvent.brewPlanID = brewPlan.id;
    brewEventDialogVisible.value = true; // ?????????????????????????????????
  } else {
    ElMessageBox.alert("brew plan??????????????????????????????", {
      confirmButtonText: "OK",
    });
  }
}

function brewEventClear() {
  a_brewEvent.clear();
}

async function onClickCalenderEvent(info) {
  await fetchBrewEvents();
  const brewEvent = brewEvents.find(
    (calenderEvent) => calenderEvent.id === info.event.id
  );
  if (brewEvent) {
    a_brewEvent.id = brewEvent.id;
    a_brewEvent.name = brewEvent.name;
    a_brewEvent.desc = brewEvent.desc;
    a_brewEvent.from = brewEvent.from;
    a_brewEvent.to = brewEvent.to;
    a_brewEvent.ingredients = brewEvent.ingredients;
    a_brewEvent.brewPlanID = brewEvent.brewPlanID;
    brewEventDialogVisible.value = true;
  }
}

async function onSubmitBrewEvent(submitedBrewEvent) {
  brewEventDialogVisible.value = false; // ????????????????????????????????????

  try {
    // db??????
    await brewEventRepo.save(submitedBrewEvent);

    // brewEvent????????????
    fetchBrewEvents();
  } catch (error) {
    ElMessageBox.alert("??????????????????????????????????????????" + error.message, {
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

    // db??????
    await brewEventRepo.save(be);
    // brewEvent????????????
    fetchBrewEvents();
  }
}

function onClickBrewingRecordFormDelete(id) {
  brewEventDialogVisible.value = false;

  // calenderEvent????????????
  const event = calendarApi.getEventById(id);
  if (event) {
    event.remove();
  }

  // brewEvent????????????
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
    calendarEvents.splice(0);
    const filteredBrewEvents = fetchedBrewEvents.filter((brewEvent) => {
      return brewEvent.brewPlanID === brewPlan.id;
    });
    filteredBrewEvents.forEach((item) => {
      const calenderEvent = {
        id: item.id,
        title: item.name,
        start: item.from,
        end: item.to,
      };
      brewEvents.push(item);
      calendarEvents.push(calenderEvent);
    });
  }
};

onMounted(() => {
  fetchIngredientMst();
  fetchBrewPlans();
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

const onClickBrewPlanCreate = () => {
  brewPlan.id = "";
  brewPlan.batchNumber = "";
  brewPlan.name = "";
  brewPlan.events = [];
  brewPlanFormDialogVisible.value = true;
};

const onClickCancelBrewPlanForm = () => {
  brewPlanFormDialogVisible.value = false;
};

const onClickSubmitBrewPlanForm = async (brewPlanData) => {
  brewPlanFormDialogVisible.value = false;
  try {
    const id = await brewPlanRepo.save(brewPlanData);
    brewPlan.id = id;
    brewPlan.batchNumber = brewPlanData.batchNumber;
    brewPlan.name = brewPlanData.name;
    brewPlan.events = brewPlanData.events;
    fetchBrewPlans();
    fetchBrewEvents();
    ElMessageBox.alert("??????????????????????????????????????????", {
      confirmButtonText: "OK",
    });
  } catch (error) {
    ElMessageBox.alert("??????????????????????????????????????????" + error.message, {
      confirmButtonText: "OK",
    });
  }
};

const fetchBrewPlans = async () => {
  const fetchedData = (await brewPlanRepo.fetchAll()).result;
  const sortedData = brewPlanService.sortByBatchNumber(fetchedData);
  brewPlans.splice(0);
  sortedData.forEach((item) => {
    brewPlans.push(item);
  });
};

const onClickBrewPlanSelect = () => {
  brewPlanSelectFormDialogVisible.value = true;
};

const onSelectBrewPlan = (selectedBrewPlan) => {
  brewPlan.id = selectedBrewPlan.id;
  brewPlan.batchNumber = selectedBrewPlan.batchNumber;
  brewPlan.name = selectedBrewPlan.name;
  brewPlan.events = selectedBrewPlan.events;
  brewPlanSelectFormDialogVisible.value = false;
  fetchBrewEvents();
};
</script>

<template>
  <div class="brewing-record">
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="12"> brew plan </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="onClickBrewPlanCreate()"
              >????????????</el-button
            >
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="onClickBrewPlanSelect()"
              >??????</el-button
            >
          </el-col>
        </el-row>

        <div>
          <el-row>
            <el-col :span="12"> batch number </el-col>
            <el-col :span="12">
              {{ brewPlan.batchNumber }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12"> batch name </el-col>
            <el-col :span="12">
              {{ brewPlan.name }}
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24">brew event</el-col>
        </el-row>
        <div>
          <FullCalendar :options="calendarOptions" />
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="brewEventDialogVisible" @close="brewEventClear">
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
    <el-dialog v-model="brewPlanFormDialogVisible">
      <BrewingPlanForm
        :brewPlan="brewPlan"
        @cancel="onClickCancelBrewPlanForm"
        @submit="onClickSubmitBrewPlanForm"
      ></BrewingPlanForm>
    </el-dialog>
    <el-dialog v-model="brewPlanSelectFormDialogVisible">
      <BrewingPlanSelectForm
        :brewPlans="brewPlans"
        @selectBrewPlan="onSelectBrewPlan"
      ></BrewingPlanSelectForm>
    </el-dialog>
  </div>
</template>
