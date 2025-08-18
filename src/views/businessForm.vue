<template>
  <div id="business_form" v-loading="loading">
    <!-- <el-affix target="#business_form" :offset="10">
      <el-button>Target container</el-button>
    </el-affix> -->
    <el-tabs
      v-model="activeName"
      tab-position="left"
      type="border-card"
      ref="tabs">
      <el-tab-pane label="工作包" name="reference">
        <el-table
          v-if="firstTable.show && activeName==='reference'"
          :data="firstTable.tableData"
          @scroll="handleScroll"
          border
          style="width: 100%"
          height="100%"
          row-key="id"
          lazy>
          <template #empty>
            <div class="flex items-center justify-center h-100%">
              <el-empty description="暂无数据！" />
            </div>
          </template>
          <el-table-column
            v-for="(item, index) in firstTable.tableColumn"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="接口矩阵" name="matrix">
        <div id="tableContainer" style="position: absolute; width: calc(100% - 40px); height: calc(100% - 40px);"></div>
        <el-table
          v-if="secondTable.show && activeName==='matrix' && false"
          :data="tableData"
          border
          class="custom-border-table"
          style="width: 100%"
          height="100%"
          :span-method="objectSpanMethod"
          :cell-style="handleCellStyle"
          :cell-class-name="handleCellClass"
          @cell-click="handleCellClick"
          v-el-table-infinite-scroll="loadMore"
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
      <el-tab-pane label="接口清单" name="register">
        <el-table
          v-if="thirdTable.show"
          :data="thirdTable.tableData"
          border
          style="width: 100%"
          height="100%"
          highlight-current-row
          ref="thirdTableDom"
        >
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty description="暂无数据！" />
          </div>
        </template>
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
import { PivotTable, DEFAULT_THEME } from '@visactor/vtable';
import { nextTick, onMounted, reactive, ref, useTemplateRef } from "vue";
import axios from "../assets/axios/BusinessForm.js";
import { ElMessage } from 'element-plus'

const activeName = ref("reference")
const firstTable = reactive({
  dataList: [],
  tableColumn: [],
  tableData: [],
  show: false
})
const secondTable = reactive({
  dataList: [],
  // tableColumn: [
  //   { prop: "firstLevel" },
  //   { prop: "secondLevelName" },
  //   { prop: "secondLevel" }
  // ],
  tableColumn: [],
  tableData: [],
  colorList: {},
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
const colorList = [ 'rgb(255, 0, 0)',
                    'rgb(255, 192, 0)',
                    'rgb(255, 255, 0)',
                    'rgb(146, 208, 80)',
                    'rgb(0, 176, 80)',
                    'rgb(0, 176, 240)',
                    'rgb(239, 148, 159)',
                    'rgb(112, 48, 160)',
                    'rgb(36, 142, 135)',
                    'rgb(197, 92, 16)',
                    'rgb(254, 219, 97)']
onMounted(() => {
  getFirstTableList()
  getThirdTableData()
})

// const vElTableInfiniteScroll = {
//   mounted(el, binding) {
//     const scrollWrap = el.querySelector('.el-scrollbar__wrap')
//     if (!scrollWrap) return
//     scrollWrap.addEventListener('scroll', function() {
//       if (scrollWrap.scrollHeight - scrollWrap.scrollTop <= scrollWrap.clientHeight + 100) {
//         binding.value()
//       }
//     })
//   }
// }
// // 当前页数
// const page = ref(1)
// const size = 10
// // 表格数据
// const tableData = ref([])
// // 加载状态
// const loading = ref(false)
// // 加载数据
// const loadData = async () => {
//   loading.value = true
//   const newData = secondTable.tableData.slice((page.value-1)*size, page.value*size)
//   tableData.value = [...tableData.value, ...newData]
//   page.value++
//   nextTick(() => {
//     loading.value = false
//   })
// }
// // 滚动加载更多
// const loadMore = () => {
//   if (!loading.value) {
//     loadData()
//   }
// }

async function getFirstTableList() {
  const res = await axios.getFirstTableList()
  if(res.data.code !== 200)
  return ElMessage({
    message: '暂无数据！',
    type: 'warning',
  });
  firstTable.dataList = res.data.data
  let firstTableColumn = [{
    prop: "levelName",
    label: "",
  }]
  let firstTableData = []
  let obj = {}
  firstTable.dataList.forEach(el => {
    if(el.CRRC_SWP_GZBMC && !firstTableColumn.find(_el => _el.label === el.CRRC_SWP_GZBMC)) {
      firstTableColumn.push({prop: el.CRRC_SWP_GZBMC, label: el.CRRC_SWP_GZBMC})
    }
    let objFind = firstTableData.find(_el => el.CRRC_SPS_NAME_L1 === _el.firstLevel)
    if(objFind) {
      if(el.CRRC_SPS_NAME_L2 === objFind.secondLevel) {
        obj[el.CRRC_SWP_GZBMC] = el.CRRC_SPS_JKJS_PD
      } else {
        objFind.secondLevel = el.CRRC_SPS_NAME_L2
        objFind.children.push(obj)
        obj = JSON.parse(JSON.stringify({
          id: firstTableData.length + 1 + '-1',
          firstLevel: el.CRRC_SPS_NAME_L1,
          levelName: el.CRRC_SPS_NAME_L2,
          [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
        }))
      }
    } else {
      // CRRC_SPS_NUMBER_L1 = el.CRRC_SPS_NUMBER_L1
      if(firstTableData.length) {
        firstTableData.find(_el => obj.firstLevel === _el.firstLevel).children.push(obj)
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
        firstLevel: el.CRRC_SPS_NAME_L1,
        [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
      }))
    }



    // if(firstTableData.length && el.CRRC_SPS_NAME_L1 === firstTableData[firstTableData.length - 1].firstLevel) {
    //   if(el.CRRC_SPS_NAME_L2 === firstTableData[firstTableData.length - 1].secondLevel) {
    //     obj[el.CRRC_SWP_GZBMC] = el.CRRC_SPS_JKJS_PD
    //   } else {
    //     firstTableData[firstTableData.length - 1].secondLevel = el.CRRC_SPS_NAME_L2
    //     firstTableData[firstTableData.length - 1].children.push(obj)
    //     obj = JSON.parse(JSON.stringify({
    //       id: firstTableData.length + 1 + '-1',
    //       levelName: el.CRRC_SPS_NAME_L2,
    //       [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
    //     }))
    //   }
    // } else {
    //   // CRRC_SPS_NUMBER_L1 = el.CRRC_SPS_NUMBER_L1
    //   if(firstTableData.length) {
    //     firstTableData[firstTableData.length - 1].children.push(obj)
    //   }
    //   firstTableData.push({
    //     id: firstTableData.length + 1,
    //     firstLevel: el.CRRC_SPS_NAME_L1,
    //     secondLevel: el.CRRC_SPS_NAME_L2,
    //     levelName: el.CRRC_SPS_NAME_L1,
    //     children: []
    //   })
    //   obj = JSON.parse(JSON.stringify({
    //     id: firstTableData.length + 1 + '-1',
    //     levelName: el.CRRC_SPS_NAME_L2,
    //     [el.CRRC_SWP_GZBMC]: el.CRRC_SPS_JKJS_PD
    //   }))
    // }
    // if(el.CRRC_SPS_NUMBER_L1 === CRRC_SPS_NUMBER_L1) {
    //   secondTable.tableColumn[secondTable.tableColumn.length - 1].children.push({
    //     id: `${secondTable.tableColumn[secondTable.tableColumn.length - 1].id}-${(secondTable.tableColumn[secondTable.tableColumn.length - 1].children.length + 1)}`,
    //     level: el.CRRC_SPS_NUMBER_L2,
    //     levelName: el.CRRC_SPS_NAME_L2,
    //     name: el.CRRC_SWP_GZBMC,
    //     pd: el.CRRC_SPS_JKJS_PD,
    //   })
    // } else {
    //   CRRC_SPS_NUMBER_L1 = el.CRRC_SPS_NUMBER_L1
    //   secondTable.tableColumn.push({
    //     id: secondTable.tableColumn.length + 1,
    //     level: el.CRRC_SPS_NUMBER_L1,
    //     levelName: el.CRRC_SPS_NAME_L1,
    //     children: [{
    //       id: secondTable.tableColumn.length + 1 + '-1',
    //       level: el.CRRC_SPS_NUMBER_L2,
    //       levelName: el.CRRC_SPS_NAME_L2,
    //       name: el.CRRC_SWP_GZBMC,
    //       pd: el.CRRC_SPS_JKJS_PD,
    //     }]
    //   })
    // }
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
  firstTable.dataList.forEach(el => {
    if(!secondTable.tableData.find(_el => _el.secondLevel === el.CRRC_SPS_NUMBER_L2)) {
      let obj = {
        firstLevel: el.CRRC_SPS_NAME_L1,
        secondLevelName: el.CRRC_SPS_NAME_L2,
        secondLevel: el.CRRC_SPS_NUMBER_L2,
        CRRC_SPS_NAME_L1: el.CRRC_SPS_NAME_L1,
        CRRC_SPS_NAME_L2: el.CRRC_SPS_NAME_L2,
        CRRC_SPS_NUMBER_L2: el.CRRC_SPS_NUMBER_L2,
        dataIndex: -1
      }
      secondTable.tableData.push(obj)
    }
    if(!secondTable.colorList[el.CRRC_SPS_NAME_L1]) {
      secondTable.colorList[el.CRRC_SPS_NAME_L1] = colorList[Object.keys(secondTable.colorList).length % 11]
    }
  })
  secondTable.tableData = JSON.parse(JSON.stringify(secondTable.tableData))
  getSecondData()
}
async function getSecondData() {
  const fontSize = (Math.min(document.documentElement.clientWidth, 1920) / 1920) * 12
  const res = await axios.getSecondData()
  res.data.data.forEach((el, index) => {
    // secondTable.tableData.find(_el => {return _el.secondLevel === el.CRRC_PIR_04}).data = el.CRRC_PIR_07
    if(secondTable.tableData.find(_el => {return _el.secondLevel === el.CRRC_PIR_04 && _el.CRRC_SPS_NUMBER_L2 === el.CRRC_PIR_03})) {
      secondTable.tableData.find(_el => {return _el.secondLevel === el.CRRC_PIR_04 && _el.CRRC_SPS_NUMBER_L2 === el.CRRC_PIR_03}).dataIndex = index
    } else {
      let obj = {}
      const objFind1 = secondTable.tableData.find(_el => {return _el.secondLevel === el.CRRC_PIR_04})
      const objFind2 = secondTable.tableData.find(_el => {return _el.CRRC_SPS_NUMBER_L2 === el.CRRC_PIR_03})
      const { firstLevel, secondLevel, secondLevelName } = objFind1
      const { CRRC_SPS_NAME_L1, CRRC_SPS_NAME_L2, CRRC_SPS_NUMBER_L2 } = objFind2
      obj = { firstLevel, secondLevel, secondLevelName, CRRC_SPS_NAME_L1, CRRC_SPS_NAME_L2, CRRC_SPS_NUMBER_L2, dataIndex: index }
      secondTable.tableData.push(obj)
    }
    secondTable.dataList.push(el.CRRC_PIR_07)
  })
  
  secondTable.tableData = JSON.parse(JSON.stringify(secondTable.tableData))
  const option = {
    theme: {
      scrollStyle: {
        visible: 'always',
      },
      headerStyle: {
        bgColor: "#ECF1F5",
        color: '#606266',
      },
      cornerHeaderStyle: {
        bgColor: "#ECF1F5",
        color: '#606266',
      },
      rowHeaderStyle: {
        bgColor: "#ECF1F5",
        color: '#606266',
      }
    },
    records: secondTable.tableData,
    rows: [
      {
        dimensionKey: 'firstLevel',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.dataValue]
          // }
        }
      },
      {
        dimensionKey: 'secondLevelName',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.cellHeaderPaths.rowHeaderPaths[0].value]
          // }
        }
      },
      {
        dimensionKey: 'secondLevel',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.cellHeaderPaths.rowHeaderPaths[0].value]
          // }
        }
      }
    ],
    corner: {
      titleOnDimension: 'row'
    },
    columns: [
      {
        dimensionKey: 'CRRC_SPS_NAME_L1',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // color: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.dataValue]
          // }
        }
      },
      {
        dimensionKey: 'CRRC_SPS_NAME_L2',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // color: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.cellHeaderPaths.colHeaderPaths[0].value]
          // }
        }
      },
      {
        dimensionKey: 'CRRC_SPS_NUMBER_L2',
        width: 'auto',
        headerStyle: {
          color: '#606266',
          fontSize
          // borderColor: 'black',
          // color: 'black',
          // bgColor(arg) {
          //   return secondTable.colorList[arg.cellHeaderPaths.colHeaderPaths[0].value]
          // }
        },
      },
    ],
    indicators: [{
      indicatorKey: 'dataIndex',
      title: (args) => {
        return args
      },
      width: 'auto',
      format: value => {
        return secondTable.dataList[value] || '';
      },
      style: (arg) => {
        const hasData = !!secondTable.dataList[arg.dataValue];
        return {
          color: hasData ? 'teal' : undefined,
          cursor: hasData ? 'pointer' : 'default',
          fontWeight: hasData ? 'bold' : 'normal',
        }
      },
    }],
    hideIndicatorName: true,
    widthMode: 'standard'
  };
  const tableInstance = new PivotTable(document.getElementById('tableContainer'), option);
  console.log(tableInstance)
  // tableInstance.theme.extend({_scroll: {visible: "always"}});
  // 添加点击事件监听
  tableInstance.on('click_cell', (args) => {
    if(args.col > 2 && args.row > 2  && args.value) {
      activeName.value = 'register'
      let obj = thirdTable.tableData.find(el => el.CRRC_PIR_07 === args.value)
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
  });
  nextTick(() => {
    // secondTable.show = true
    // loadMore()
  })
}

// function objectSpanMethod({ row, rowIndex, columnIndex }) {
//   if (columnIndex === 0) {
//     if (rowIndex > 0 && row.firstLevel === secondTable.tableData[rowIndex - 1].firstLevel) {
//       return [0, 0]; // 当前单元格不显示（被合并）
//     } else {
//       // 计算相同姓名的行数
//       let rowspan = 1;
//       for (let i = rowIndex + 1; i < secondTable.tableData.length; i++) {
//         if (secondTable.tableData[i].firstLevel === row.firstLevel) rowspan++;
//         else break;
//       }
//       return [rowspan, 1]; // 合并 rowspan 行，1 列
//     }
//   }
// }
// function handleCellStyle({ row, column, columnIndex }) {
//   if(columnIndex > 2 && row[column.property]) {
//     return {
//       // backgroundColor: '',
//       color: 'teal',
//       cursor: 'pointer',
//       fontWeight: 'bold'
//     };
//   }
// }
// function handleCellClass({ row, columnIndex }) {
//   if(columnIndex < 3) {
//     const index = firstTable.tableData.findIndex(el => el.firstLevel === row.firstLevel)
//     return `header-group-${index}`
//   }
// }
// function handleCellClick(row, column) {
//   if(row[column.property] && !['firstLevel', 'secondLevelName', 'secondLevel'].includes(column.property)) {
//     activeName.value = 'register'
//     let obj = thirdTable.tableData.find(el => el.CRRC_PIR_07 === row[column.property])
//     thirdTableDom.value.setCurrentRow(obj);
//     nextTick(() => {
//       const tableRef = thirdTableDom.value;
//       if (tableRef) {
//         // 获取表格的滚动容器
//         const scrollBody = tableRef.$el.querySelector('.el-table__body-wrapper');
//         if (scrollBody) {
//           const rowEl = scrollBody.querySelector(`tr:nth-child(${thirdTable.tableData.indexOf(obj) + 1})`);
//           scrollBody.scrollTo({
//             top: rowEl.offsetTop, // 使用行的 offsetTop
//             behavior: 'smooth'
//           });
//         }
//       }
//     });
//   }
// }

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
  .el-affix {
    >div {
      text-align: right;
      // bottom: 100px;
      // margin-right: 50px;
    }
  }
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      padding: 20px;
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
        // .custom-border-table {
        //   --el-table-border-color: black;
        //   .header-group-0 {
        //     background-color: rgb(255, 0, 0);
        //     color: black;
        //   }
        //   .header-group-1 {
        //     background-color: rgb(255, 192, 0);
        //     color: black;
        //   }
        //   .header-group-2 {
        //     background-color: rgb(255, 255, 0);
        //     color: black;
        //   }
        //   .header-group-3 {
        //     background-color: rgb(146, 208, 80);
        //     color: black;
        //   }
        //   .header-group-4 {
        //     background-color: rgb(0, 176, 80);
        //     color: black;
        //   }
        //   .header-group-5 {
        //     background-color: rgb(0, 176, 240);
        //     color: black;
        //   }
        //   .header-group-6 {
        //     background-color: rgb(239, 148, 159);
        //     color: black;
        //   }
        //   .header-group-7 {
        //     background-color: rgb(112, 48, 160);
        //     color: black;
        //   }
        //   .header-group-8 {
        //     background-color: rgb(36, 142, 135);
        //     color: black;
        //   }
        //   .header-group-9 {
        //     background-color: rgb(197, 92, 16);
        //     color: black;
        //   }
        //   .header-group-10 {
        //     background-color: rgb(254, 219, 97);
        //     color: black;
        //   }
        // }
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
