<template>
  <div id="business_form">
    <el-tabs
      v-model="activeName"
      tab-position="left"
      type="border-card"
      ref="tabs">
      <el-tab-pane label="Reference" name="reference">
        <el-table
          v-if="firstTable.show"
          :data="firstTable.tableData"
          border
          style="width: 100%"
          height="100%"
          row-key="id"
          default-expand-all
        >
          <el-table-column
            v-for="(item, index) in firstTable.tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Matrix" name="matrix">
        <el-table
          v-if="secondTable.show"
          :data="secondTable.tableData"
          border
          class="custom-border-table"
          style="width: 100%"
          height="100%"
          :span-method="objectSpanMethod"
          :cell-style="handleCellStyle"
          :cell-class-name="handleCellClass"
          @cell-click="handleCellClick"
        >
          <el-table-column
            v-for="(item, index) in secondTable.tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.levelName"
            :label-class-name="`header-group-${(index-3)%11}`">
            <template v-if="item.children">
              <el-table-column
                v-for="(_item, _index) in item.children"
                :key="_index"
                :formatter="(row) => row[_item.level]"
                :label-class-name="`header-group-${(index-3)%11}`">
                <template v-slot:header>
                  <div class="vertical-header">{{ _item.levelName }}</div>
                </template>
                <el-table-column
                  :prop="_item.level"
                  :formatter="(row) => row[_item.level]"
                  :label-class-name="`header-group-${(index-3)%11}`">
                  <template v-slot:header>
                    <div class="vertical-header">{{ _item.level }}</div>
                  </template>
                  <template #default="{ row }">
                    <div>
                      {{ row[_item.level] }}  <!-- 正确读取带特殊字符的字段 -->
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane
      >
      <el-tab-pane label="Register" name="register">
        <el-table
          v-if="thirdTable.show"
          :data="thirdTable.tableData"
          border
          style="width: 100%"
          height="100%"
          highlight-current-row
          ref="thirdTableDom"
        >
          <el-table-column
            v-for="(item, index) in thirdTable.tableColumn"
            :key="index"
            :label="item.label">
            <el-table-column
              v-for="(_item, _index) in item.children"
              :key="_index"
              :prop="_item.prop"
              :label="_item.label">
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, useTemplateRef } from "vue";
import axios from "../assets/axios/BusinessForm.js";

const activeName = ref("reference")
const firstTable = reactive({
  dataList: [],
  tableColumn: [],
  tableData: [],
  show: false
})
const secondTable = reactive({
  dataList: [],
  tableColumn: [
    { prop: "firstLevel" },
    { prop: "secondLevelName" },
    { prop: "secondLevel" }
  ],
  tableData: [],
  show: false,
})
const thirdTable = reactive({
  dataList: [],
  tableColumn: [{
    children: [{
      label: 'ID',
      prop: 'CRRC_PIR_07'
    }]
  },{
    label: 'Interface owner',
    children: [{
      label: 'System',
      prop: 'CRRC_PIR_01'
    }, {
      label: 'Lead Party',
      prop: 'CRRC_PIR_19'
    }]
  },{
    label: 'Interfacing party',
    children: [{
      label: 'System',
      prop: 'CRRC_PIR_02'
    }, {
      label: 'Support Party',
      prop: 'CRRC_PIR_20'
    }]
  },{
    children: [{
      label: 'Intetface Document',
      prop: 'CRRC_PIR_08'
    }]
  },{
    children: [{
      label: 'Interface Description',
      prop: 'CRRC_PIR_09'
    }]
  },{
    label: 'Works by Lead Party',
    prop: 'CRRC_PIR_10',
    children: [{
      prop: 'CRRC_PIR_10'
    }]
  },{
    label: 'Works by Support Party',
    prop: 'CRRC_PIR_11',
    children: [{
      prop: 'CRRC_PIR_11'
    }]
  },{
    label: 'Type',
    prop: 'CRRC_PIR_12',
    children: [{
      prop: 'CRRC_PIR_12'
    }]
  },{
    label: 'Remark',
    prop: 'CRRC_PIR_13',
    children: [{
      prop: 'CRRC_PIR_13'
    }]
  }],
  tableData: [],
  show: false,
})
const thirdTableDom = useTemplateRef('thirdTableDom')
onMounted(() => {
  getFirstTableList()
  getThirdTableData()
})

async function getFirstTableList() {
  const res = await axios.getFirstTableList()
  firstTable.dataList = res.data.data
  let CRRC_SPS_NUMBER_L1 = ''
  let firstTableColumn = [{
    prop: "levelName",
    label: "",
  }]
  let firstTableData = []
  let obj = {}
  firstTable.dataList.forEach(el => {
    if(!firstTableColumn.find(_el => _el.label === el.CRRC_SWP_GZBMC)) {
      firstTableColumn.push({prop: el.CRRC_SWP_GZBMC, label: el.CRRC_SWP_GZBMC})
    }
    if(firstTableData.length && el.CRRC_SPS_NAME_L1 === firstTableData[firstTableData.length - 1].firstLevel) {
      if(el.CRRC_SPS_NAME_L2 === firstTableData[firstTableData.length - 1].secondLevel) {
        obj[el.CRRC_SWP_GZBMC] = el.CRRC_SPS_JKJS_PD
      } else {
        firstTableData[firstTableData.length - 1].secondLevel = el.CRRC_SPS_NAME_L2
        firstTableData[firstTableData.length - 1].children.push(obj)
        obj = JSON.parse(JSON.stringify({
          id: firstTableData.length + 1 + '-1',
          levelName: el.CRRC_SPS_NAME_L2,
          [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
        }))
      }
    } else {
      // CRRC_SPS_NUMBER_L1 = el.CRRC_SPS_NUMBER_L1
      if(firstTableData.length) {
        firstTableData[firstTableData.length - 1].children.push(obj)
      }
      firstTableData.push({
        id: firstTableData.length + 1,
        firstLevel: el.CRRC_SPS_NAME_L1,
        secondLevel: el.CRRC_SPS_NAME_L2,
        levelName: el.CRRC_SPS_NAME_L1,
        children: []
      })
      obj = JSON.parse(JSON.stringify({
        id: firstTableData.length + 1 + '-1',
        levelName: el.CRRC_SPS_NAME_L2,
        [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
      }))
    }
    if(el.CRRC_SPS_NUMBER_L1 === CRRC_SPS_NUMBER_L1) {
      secondTable.tableColumn[secondTable.tableColumn.length - 1].children.push({
        id: `${secondTable.tableColumn[secondTable.tableColumn.length - 1].id}-${(secondTable.tableColumn[secondTable.tableColumn.length - 1].children.length + 1)}`,
        level: el.CRRC_SPS_NUMBER_L2,
        levelName: el.CRRC_SPS_NAME_L2,
        name: el.CRRC_SWP_GZBMC,
        pd: el.CRRC_SPS_JKJS_PD,
      })
    } else {
      CRRC_SPS_NUMBER_L1 = el.CRRC_SPS_NUMBER_L1
      secondTable.tableColumn.push({
        id: secondTable.tableColumn.length + 1,
        level: el.CRRC_SPS_NUMBER_L1,
        levelName: el.CRRC_SPS_NAME_L1,
        children: [{
          id: secondTable.tableColumn.length + 1 + '-1',
          level: el.CRRC_SPS_NUMBER_L2,
          levelName: el.CRRC_SPS_NAME_L2,
          name: el.CRRC_SWP_GZBMC,
          pd: el.CRRC_SPS_JKJS_PD,
        }]
      })
    }
  });
  firstTableData[firstTableData.length - 1].children.push(obj)
  firstTable.tableColumn = JSON.parse(JSON.stringify(firstTableColumn))
  firstTable.tableData = JSON.parse(JSON.stringify(firstTableData))
  firstTable.show = true
  nextTick(() => {
    getSecondTable()
  })
}

function getSecondTable() {
  // this.secondTableColumn = [ ...this.secondTableColumn, ...this.secondTableColumn ]
  firstTable.dataList.forEach(el => {
    let obj = {
      firstLevel: el.CRRC_SPS_NAME_L1,
      secondLevelName: el.CRRC_SPS_NAME_L2,
      secondLevel: el.CRRC_SPS_NUMBER_L2
    }
    secondTable.tableData.push(obj)
  })
  secondTable.tableData = JSON.parse(JSON.stringify(secondTable.tableData))
  getSecondData()
}
async function getSecondData() {
  const res = await axios.getSecondData()
  secondTable.dataList = res.data.data
  secondTable.dataList.forEach(el => {
    secondTable.tableData.find(_el => {return _el.secondLevel === el.CRRC_PIR_04})[el.CRRC_PIR_03] = el.CRRC_PIR_07
  })
  secondTable.tableData = JSON.parse(JSON.stringify(secondTable.tableData))
  secondTable.show = true
}

function objectSpanMethod({ row, rowIndex, columnIndex }) {
  if (columnIndex === 0) {
    if (rowIndex > 0 && row.firstLevel === secondTable.tableData[rowIndex - 1].firstLevel) {
      return [0, 0]; // 当前单元格不显示（被合并）
    } else {
      // 计算相同姓名的行数
      let rowspan = 1;
      for (let i = rowIndex + 1; i < secondTable.tableData.length; i++) {
        if (secondTable.tableData[i].firstLevel === row.firstLevel) rowspan++;
        else break;
      }
      return [rowspan, 1]; // 合并 rowspan 行，1 列
    }
  }
}
function handleCellStyle({ row, column, columnIndex }) {
  if(columnIndex > 2 && row[column.property]) {
    return {
      // backgroundColor: '',
      color: 'teal',
      cursor: 'pointer',
      fontWeight: 'bold'
    };
  }
}
function handleCellClass({ row, columnIndex }) {
  if(columnIndex < 3) {
    const index = firstTable.tableData.findIndex(el => el.firstLevel === row.firstLevel)
    return `header-group-${index}`
  }
}
function handleCellClick(row, column) {
  if(row[column.property] && !['firstLevel', 'secondLevelName', 'secondLevel'].includes(column.property)) {
    activeName.value = 'register'
    let obj = thirdTable.tableData.find(el => el.CRRC_PIR_07 === row[column.property])
    thirdTableDom.value.setCurrentRow(obj);
    nextTick(() => {
      const tableRef = thirdTableDom.value;
      if (tableRef) {
        // 获取表格的滚动容器
        const scrollBody = tableRef.$el.querySelector('.el-table__body-wrapper');
        if (scrollBody) {
          const rowEl = scrollBody.querySelector(`tr:nth-child(${thirdTable.tableData.indexOf(obj) + 1})`);
          scrollBody.scrollTo({
            top: rowEl.offsetTop, // 使用行的 offsetTop
            behavior: 'smooth'
          });
        }
      }
    });
  }
}

async function getThirdTableData() {
  const res = await axios.getThirdTableData()
  thirdTable.tableData = [...res.data.data]
  thirdTable.tableData = JSON.parse(JSON.stringify(thirdTable.tableData))
  thirdTable.show = true
}
</script>


<style lang="scss">
#business_form {
  margin: 20px;
  height: calc(100vh - 40px);
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      padding: 20px;
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
        .custom-border-table {
          --el-table-border-color: black;
          .header-group-0 {
            background-color: rgb(255, 0, 0);
            color: black;
          }
          .header-group-1 {
            background-color: rgb(255, 192, 0);
            color: black;
          }
          .header-group-2 {
            background-color: rgb(255, 255, 0);
            color: black;
          }
          .header-group-3 {
            background-color: rgb(146, 208, 80);
            color: black;
          }
          .header-group-4 {
            background-color: rgb(0, 176, 80);
            color: black;
          }
          .header-group-5 {
            background-color: rgb(0, 176, 240);
            color: black;
          }
          .header-group-6 {
            background-color: rgb(239, 148, 159);
            color: black;
          }
          .header-group-7 {
            background-color: rgb(112, 48, 160);
            color: black;
          }
          .header-group-8 {
            background-color: rgb(36, 142, 135);
            color: black;
          }
          .header-group-9 {
            background-color: rgb(197, 92, 16);
            color: black;
          }
          .header-group-10 {
            background-color: rgb(254, 219, 97);
            color: black;
          }
        }
        .vertical-header {
          writing-mode: sideways-lr; 
          // transform: rotate(180deg); /* 旋转180度使文字正立 */
          text-align: center;
          white-space: nowrap;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
