import axios from 'axios'


axios.interceptors.request.use(
  async (config) => {
    config.headers["Referer"] = ``;
    // config.headers["Origin"] = ``;
    config.headers["x-requested-with"] = `XMLHttpRequest`;
    config.headers["x-unifier-token"] = `19edbcc9dd3da5a2dbd3f7789ef99c76`;
    config.headers["x-unifier-uref"] = `uuu152974345t3`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
    pushData() {
        document.querySelector('meta[name="referrer"]')?.setAttribute('content', 'no-referrer');
        return axios.post(`pu/bp/mod/bp/record/wf/action` , {"upper":{"uuu_dm_publish_path":"/整合管理/项目章程","CRRC_JKPD_PD":1,"CRRC_PLTJ_SB1":0,"CRRC_PLTJ_SB3":0,"CRRC_PI_GSJ_YS":"N","CRRC_BM_BMBH":"Test-GCBU","CRRC_PLTJ_SB2":0,"CRRC_PLTJ_SB4":0,"uuu_bp_record_url":"http://10.73.60.92:6009/viewbp/skirelogin?registry=unifier&model=uxpc&recordid=29&projectid=1084","uuu_record_last_update_date":"2026-03-16T00:44:00","CRRC_PI_YWLX_PD":"DLS","CRRC_SYB_MC":"总包事业部","CRRC_PLTJ_SB5":2,"CRRC_PLTJ_SB6":2,"CRRC_PI_XMSZQYGNW_PD":"海外","project_projectnumber":"ZY-J0005","project_projectname":"阿联酋阿布扎比有轨电车及系统集成项目","CRRC_CMD_KHBH":"985001","CRRC_BOP_KHMC":"阿联酋DMU项目售后服务站","CRRC_PC_XMMDHLY":"测试0105","CRRC_PC_XMFW":"测试0105","CRRC_PC_XMKJFCG":"测试0105","k__currencyid":30,"currencyid":"人民币 (CNY)","CRRC_PC_ZYS":0,"CRRC_PC_MLLMB":0,"CRRC_PC_MLLBZ":"12","CRRC_PC_SFJPGC":"","CRRC_PC_MLVCZ":"12","CRRC_PC_XMXZZYNRJYS":"测试0105","CRRC_RV_XMJB_PD":"一级一类","CRRC_PC_SFWKSXM":"N","CRRC_PC_XMFL":"测试0105","CRRC_PC_GZZJ_YCG":"测试0105","CRRC_PC_GZZJ_YXFA":"测试0105","CRRC_PC_GZZJ_WWJH":"测试0105","CRRC_PC_XMSQ":null,"CRRC_Description":null,"k__creator_id":1000,"creator_id":"Company Administrator","uuu_creation_date":"2026-01-26T12:45:00","record_no":"PC-0013","status":"Pending","CRRC_SFTSPMS":0},"workflow":{"model":"uxpc","wfdesign":"workflow.1","process_id":4484,"link_id":"26","wftemplate_id":7503,"isFromBPTemplate":"false","task_id":17494}}, {
            headers: {
                // 尝试移除 Referer
                'Referer': undefined
            }
        })
    },
    pushData2() {
        // return axios.post(`pu/bp/mod/bp/record/wf/action` , {
        //     "upper": {
        //         "uuu_dm_publish_path": "/整合管理/项目章程",
        //         "CRRC_JKPD_PD": 1,
        //         "CRRC_PLTJ_SB1": 0,
        //         "CRRC_PLTJ_SB3": 0,
        //         "CRRC_PI_GSJ_YS": "N",
        //         "CRRC_BM_BMBH": "Test-GCBU",
        //         "CRRC_PLTJ_SB2": 0,
        //         "CRRC_PLTJ_SB4": 0,
        //         "uuu_bp_record_url": "http://10.73.60.92:6009/viewbp/skirelogin?registry=unifier&model=uxpc&recordid=29&projectid=1084",
        //         "uuu_record_last_update_date": "2026-03-16T00:01:00",
        //         "CRRC_PI_YWLX_PD": "DLS",
        //         "CRRC_SYB_MC": "总包事业部",
        //         "CRRC_PLTJ_SB5": 2,
        //         "CRRC_PLTJ_SB6": 2,
        //         "CRRC_PI_XMSZQYGNW_PD": "海外",
        //         "project_projectnumber": "ZY-J0005",
        //         "project_projectname": "阿联酋阿布扎比有轨电车及系统集成项目",
        //         "CRRC_CMD_KHBH": "985001",
        //         "CRRC_BOP_KHMC": "阿联酋DMU项目售后服务站",
        //         "CRRC_PC_XMMDHLY": "测试0105",
        //         "CRRC_PC_XMFW": "测试0105",
        //         "CRRC_PC_XMKJFCG": "测试0105",
        //         "k__currencyid": 30,
        //         "currencyid": "人民币 (CNY)",
        //         "CRRC_PC_ZYS": 0,
        //         "CRRC_PC_MLLMB": 0,
        //         "CRRC_PC_MLLBZ": "12",
        //         "CRRC_PC_SFJPGC": "",
        //         "CRRC_PC_MLVCZ": "12",
        //         "CRRC_PC_XMXZZYNRJYS": "测试0105",
        //         "CRRC_RV_XMJB_PD": "一级一类",
        //         "CRRC_PC_SFWKSXM": "N",
        //         "CRRC_PC_XMFL": "测试0105",
        //         "CRRC_PC_GZZJ_YCG": "测试0105",
        //         "CRRC_PC_GZZJ_YXFA": "测试0105",
        //         "CRRC_PC_GZZJ_WWJH": "测试0105",
        //         "CRRC_PC_XMSQ": null,
        //         "CRRC_Description": null,
        //         "k__creator_id": 1000,
        //         "creator_id": "Company Administrator",
        //         "uuu_creation_date": "2026-01-26T12:45:00",
        //         "record_no": "PC-0013",
        //         "status": "Rejected",
        //         "CRRC_SFTSPMS": 0
        //     },
        //     "workflow": {
        //         "model": "uxpc",
        //         "wfdesign": "workflow.1",
        //         "process_id": 4484,
        //         "link_id": "43",
        //         "wftemplate_id": 7503,
        //         "isFromBPTemplate": "false",
        //         "task_id": 17493
        //     }
        // })
    },
    pushData3() {},
}