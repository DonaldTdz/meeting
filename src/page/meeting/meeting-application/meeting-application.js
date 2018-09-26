let app = getApp();
Page({
  data: {
    userInfo: [],
    picSrc: 'http://127.0.0.1:21021',
    id: '',
    room: '',
    deviceItem: [],
    selectedNoticeIndex: 0,
    selectedRemindingIndex: 0,
    selectedTimeingIndex: 0,
    noticeWay: ['发DING', '钉钉消息'],
    remindingWay: ['无提醒', '发DING', '钉钉消息'],
    remindingTime: ['提前5分钟', '提前10分钟', '提前30分钟'],
    hostAvatar: ''
  },
  input: {
    meetingRoomId: '',
    subject: '',
    desc: '',
    hostId: '',
    hostName: '',
    noticeWay: '',
    remindingWay: '',
    remindingTime: '',
    responsibleId: '',
    responsibleName: ''
  },

  onLoad(query) {
    this.setData({ id: query.id });
    this.getRoomApplyInfo();
    // 页面加载
    //console.info(`task-detail Page onLoad with query: ${JSON.stringify(query)}`);
  },
  getRoomApplyInfo() {
    dd.showLoading();
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/MeetingRoom/GetDingDingMeetingRoomByIdAsync',
      method: 'Get',
      dataType: 'json',
      data: {
        id: this.data.id,//res.authCode,
      },
      success: (res) => {
        //console.info(`schedule: ${JSON.stringify(res.data.result)}`);
        this.setData({ room: res.data.result });
        // if(res.data.result.devices){
        //   var x;
        //  res.data.result.devices.forEach(i=>{
        //     x = 
        //   })
        this.setData({ deviceItem: res.data.result.devices.split(',') });
        // }
      },
      fail: function(res) {
        dd.alert({ content: '获取会议室详情异常' });
      },
      complete: function(res) {
        dd.hideLoading();
      }
    });
  },

  handleNoticeChange: function({ index, value }) {
    this.setData({
      selectedNoticeIndex: index,
    })
  },
  handleRemindChange: function({ index, value }) {
    this.setData({
      selectedRemindingIndex: index,
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      selectedTimeingIndex: e.detail.value,
    });
  },
  complexChoose() {
    dd.complexChoose({
      title: "选择主持人",            //标题
      multiple: false,            //是否多选
      limitTips: "超出了",          //超过限定人数返回提示
      maxUsers: 1,            //最大可选人数
      pickedUsers: [],            //已选用户
      pickedDepartments: [],          //已选部门
      requiredUsers: [],            //必选用户（不可取消选中状态）
      requiredDepartments: [],        //必选部门（不可取消选中状态）
      permissionType: "xxx",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
      responseUserOnly: true,        //返回人，或者返回人和部门
      startWithDepartmentId: 0,   // 0表示从企业最上层开始
      success: function(res) {
        {
          users: []//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），userId（用户工号）三个字段
          this.setData({
            userInfo: res.users[0],
          });
        }
      },
      fail: function(err) {
      }
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: '任务详情',
      desc: '任务详情页',
      path: 'pages/task/task-detail/task-detail',
    };
  },
  formSubmit: function(e) {
    this.input.meetingRoomId = this.data.id,
      this.input.subject = e.detail.value.subject,
      this.input.desc = e.detail.value.desc,
      this.input.hostId = this.data.userInfo.id,
      this.input.hostName = this.data.userInfo.name,
      this.input.noticeWay = this.data.selectedNoticeIndex,
      // this.input.remindingWay = e.desc.value.remindingTime,
      this.input.remindingTime = this.data.selectedTimeingIndex,
      console.log(this.input);
    // console.log(e.detail.value)
    dd.httpRequest({
      url: app.globalData.host + 'api/services/app/Meeting/CreateOrUpdateMeeting',
      method: 'POST',
      data: {
        input:this.input,
      },
      dataType: 'json',
      success: function(res) {
        dd.alert({ content: 'success' });
      },
      fail: function(res) {
        dd.alert({ content: 'fail' });
      },
      complete: function(res) {
        dd.hideLoading();
        dd.alert({ content: 'complete' });
      }
    });
  },
});
