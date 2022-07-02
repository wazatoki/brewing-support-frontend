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
                  prop="batchName"
                  :rules="[
                    { required: true, message: 'batch name is required' },
                  ]"
                >
                  <el-input
                    type="text"
                    autocomplete="off"
                    v-model="brewPlan.batchName"
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
        @submitBrewEvent="onSubmitBrewEvent($event)"
        @clickCancel="onClickBrewingRecordFormCancel"
        @clickDelete="onClickBrewingRecordFormDelete($event)"
      >
      </BrewingRecordForm>
    </el-dialog>
    <el-dialog v-model="brewPlanDialogVisible">
      <BrewingRecordSelect></BrewingRecordSelect>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import "@fullcalendar/core/vdom"; // solves problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  EventResizeDoneArg,
} from "@fullcalendar/interaction";
import {
  CalendarApi,
  CalendarOptions,
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventDropArg,
} from "@fullcalendar/common";
import BrewingRecordForm from "@/components/BrewingRecordForm.vue";
import BrewingRecordSelect from "@/components/BrewingRecordSelect.vue";
import { BrewEvent } from "@/models/brewEvent";
import { BrewPlan } from "@/models/brewPlan";
import { reactive, ref, Ref } from "vue";
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElInput,
  ElDialog,
} from "element-plus/dist/index.full.js";
import type { FormInstance } from "element-plus";

export default {
  name: "BrewingRecord",
  components: {
    FullCalendar,
    BrewingRecordForm,
    BrewingRecordSelect,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElDialog,
  },
  setup() {
    const formLabelWidth = "140px";
    const brewPlan = reactive(new BrewPlan());
    const brewPlanformRef = ref<FormInstance>();

    function brewPlanformVallidate(
      formEl: FormInstance | undefined,
      callback: () => void
    ) {
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

    const calendarOptions = reactive<CalendarOptions>({
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

    const brewEventDialogVisible: Ref<boolean> = ref(false);
    const brewPlanDialogVisible: Ref<boolean> = ref(true);
    const brewEvents = [] as BrewEvent[];
    const a_brewEvent = reactive(new BrewEvent());

    let calendarApi: CalendarApi;

    function onSelectCalender(info: DateSelectArg) {
      calendarApi = info.view.calendar;
      calendarApi.unselect(); // clear date selection

      brewPlanformVallidate(brewPlanformRef.value, () => {
        a_brewEvent.id = "";
        a_brewEvent.name = "";
        a_brewEvent.desc = "";
        a_brewEvent.from = info.start;
        a_brewEvent.to = info.end;
        brewEventDialogVisible.value = true; // 編集用ダイアログを開く
      });
    }

    function onClickCalenderEvent(info: EventClickArg) {
      const brewEvent = brewEvents.find(
        (calenderEvent) => calenderEvent.id === info.event.id
      );
      if (brewEvent) {
        a_brewEvent.id = brewEvent.id;
        a_brewEvent.name = brewEvent.name;
        a_brewEvent.desc = brewEvent.desc;
        a_brewEvent.from = brewEvent.from;
        a_brewEvent.to = brewEvent.to;
        brewEventDialogVisible.value = true;
      }
    }

    function onSubmitBrewEvent(submitedBrewEvent: BrewEvent) {
      brewEventDialogVisible.value = false; // 編集用ダイアログを閉じる

      // db送信

      // calenderEvent更新処理
      const calenderEvent: {
        id: string;
        title: string;
        start: Date;
        end: Date;
      } = {
        id: submitedBrewEvent.id,
        title: submitedBrewEvent.name,
        start: submitedBrewEvent.from,
        end: submitedBrewEvent.to,
      };

      const event: EventApi | null = calendarApi.getEventById(
        submitedBrewEvent.id
      );

      if (event) {
        // 更新の場合
        event.remove();
        calendarApi.addEvent(calenderEvent);
      } else {
        // 新規作成の場合
        calendarApi.addEvent(calenderEvent);
      }

      // brewEvent更新処理
      const beIndex = brewEvents.findIndex(
        (e) => e.id === submitedBrewEvent.id
      );
      if (beIndex >= 0) {
        brewEvents.splice(beIndex, 1);
      }
      brewEvents.push(submitedBrewEvent);
    }

    function onChangeCalendarEvent(info: EventResizeDoneArg | EventDropArg) {
      const be = brewEvents.find((brewEvent) => brewEvent.id === info.event.id);
      if (be) {
        be.name = info.event.title;
        if (info.event.start) {
          be.from = info.event.start;
        }
        if (info.event.end) {
          be.to = info.event.end;
        }
      }
    }

    function onClickBrewingRecordFormDelete(id: string) {
      brewEventDialogVisible.value = false;

      // calenderEvent削除処理
      const event: EventApi | null = calendarApi.getEventById(id);
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

    return {
      brewPlanformRef,
      formLabelWidth,
      brewPlan,
      brewPlanformVallidate,
      calendarOptions,
      a_brewEvent,
      brewEventDialogVisible,
      brewPlanDialogVisible,
      onSubmitBrewEvent,
      onClickCalenderEvent,
      onChangeCalendarEvent,
      onClickBrewingRecordFormCancel,
      onClickBrewingRecordFormDelete,
    };
  },
};
</script>
