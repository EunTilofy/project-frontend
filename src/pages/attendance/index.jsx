import { View, Text, Image, Picker, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Attendance() {
  // const [attendanceOption, setAttendanceOption] = useState({
  //   startDate: '2024-1-1',
  //   endDate: '2024-1-2'
  // });
  // const [leaveApplication, setLeaveApplication] = useState([]);
  // const [userList, setUserList] = useState([]);
  // const [collectStartTime, setCollectStartTime] = useState('');
  // const [collectEndTime, setCollectEndTime] = useState('');

  // const leaveApplication = [
  //   {
  //     userInfo: {
  //       nickName: 'Name1',
  //       gender: 0,
  //     },
  //     trainingInfo: {
  //       title: 'Training 1',
  //     },
  //     reason: 'xxxxxxx',
  //     time: '2024-06-10',
  //   },
  //   {
  //     userInfo: {
  //       nickName: 'Name2',
  //       gender: 1,
  //     },
  //     trainingInfo: {
  //       title: 'Training 1',
  //     },
  //     reason: 'xxxxxxx',
  //     time: '2024-06-11',
  //   }
  // ];

  // const userList = [
  //   {
  //     userInfo: {
  //       nickName: 'Name1',
  //       realName: 'RealName1',
  //       gender: 0,
  //     },
  //     totalCount: 20,
  //     baseParticipantCount: 18,
  //     extraParticipantCount: 2,
  //     leaveCount: 1,
  //     ratio: 90,
  //     leave: [
  //       {
  //         training: 'Training 1',
  //         apply_time: '2024-06-10',
  //         reason: 'xxxxxxxxx',
  //       },
  //     ],
  //   },
  // ];

  const [leavelist, setleavelist] = useState([]);
  const get = () => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getTrainingList',
      method: 'POST',
      header: { Authorization: token },
      data: {
        page_no: 1,
        page_size: 10000
      },
      success(res) {
        console.log('Initial request response:', res.data);
        if (res.data.result && Array.isArray(res.data.result)) {
          const trainingDetailsPromises = res.data.result.map(training => {
            return Taro.request({
              url: 'https://9bh279vn9856.vicp.fun/api/training/getLeaveList',
              method: 'POST',
              header: { Authorization: token },
              data: { training_id: training.ID }
            }).then(response => {
              if (response.data.result && Array.isArray(response.data.result)) {
                return {
                  trainingName: training.Name, // 捕获当前培训的名称
                  leaves: response.data.result  // 有效数组的请假记录
                };
              } else {
                return {
                  trainingName: training.Name,
                  leaves: []  // 如果结果不是数组，返回空数组
                };
              }
            });
          });
  
          Promise.all(trainingDetailsPromises).then(detailsResponses => {
            const leaveList = detailsResponses.flatMap(detail => 
              detail.leaves.map(leave => ({
                ...leave,
                trainingName: detail.trainingName // 将 training.Name 添加到每个请假记录
              }))
            ).filter(leave => leave.Status === 'leave_pending');  // 筛选状态为 'leave_pending' 的记录
            console.log('Filtered leave list with training names:', leaveList);
            setleavelist(leaveList); // 设置请假列表状态
          }).catch(error => {
            console.error('Error fetching training details:', error);
          });
        }
      },
      fail(error) {
        console.error('Initial request failed:', error);
      }
    });
  };

  useLoad(() => {
    console.log('Page loaded.')
    get();
  })
  // const bindAttendanceOptionStartDateChange = e => {
  //   console.log('Attendance start date change', e.detail.value);
  //   setAttendanceOption({ ...attendanceOption, startDate: e.detail.value });
  // };

  // const bindAttendanceOptionEndDateChange = e => {
  //   console.log('Attendance end date change', e.detail.value);
  //   setAttendanceOption({ ...attendanceOption, endDate: e.detail.value });
  // };

  const approveLeaveApply = (id) => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/approveLeave',
      method: 'POST',
      header: { Authorization: token },
      data: {
        participant_id: id
      },
      success(res) {
        if(res.data.code === 0) {
          Taro.showToast({
            title: '已同意',
            icon: 'success', 
            duration: 1000
          });
          get();
        } else {
          Taro.showToast({
            title: '操作失败',
            icon: 'none', 
            duration: 1000
          });
        }
      }, fail(err) {
        Taro.showToast({
          title: '操作失败',
          icon: 'none', 
          duration: 1000
        });
      }
    });
  };

  const disapproveLeaveApply = (id) => {
    // console.log(`Leave apply index: ${e.currentTarget.dataset.index}, approve: ${e.currentTarget.dataset.approve}`);
  };

  // const cancel = () => {
  //   // Taro.navigateTo({
  //   //   url: `/pages/center/index`,
  //   // });
  //   console.log('Back');
  // };

  // const submit = () => {
  //   console.log('Submit');
  // };

  return (
    <View className='container'>
      {/* <View className='item'>
        <View className='title'>
          <View className='text'>考勤周期：</View>
        </View>
        <View className='range'>
          <View className='input'>
            <Picker mode='date' value={attendanceOption.startDate} onChange={bindAttendanceOptionStartDateChange}>
              <View className='picker weak'>{attendanceOption.startDate}</View>
            </Picker>
          </View>
          <View className='split'>~</View>
          <View className='input'>
            <Picker mode='date' value={attendanceOption.endDate} onChange={bindAttendanceOptionEndDateChange}>
              <View className='picker weak'>{attendanceOption.endDate}</View>
            </Picker>
          </View>
        </View> */}
      {/* </View> */}
      <View className='item'>
        <View className='title'>
          <View className='text'>请假申请：</View>
        </View>
        { leavelist.length > 0 && (leavelist.map((apply, index) => (
          <View className='card' key={index}>
            <View className='apply-content weak'>
              <View className='name'>{apply.User.nickname}</View>
              {apply.User.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {apply.User.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View className='placeholder'></View>
              <View className='time'>{apply.trainingName}</View>
            </View>
            <View className='apply-content weak' style={{ marginTop: '20rpx' }}>
              <View className='reason' style={{ width: '100%', minHeight: '60rpx', wordWrap: 'break-word' }}>{apply.Message}</View>
              <View className='placeholder'></View>
            </View>
            <View className='apply-content weak' style={{ marginTop: '20rpx' }}>
              {/* <View className='time'>{apply.time}</View> */}
              {/* <View className='placeholder'></View> */}
              <Button className='cancel' size='mini' data-index={index} onClick={()=>disapproveLeaveApply(apply.ID)}>拒绝</Button>
              <Button className='apply' size='mini' data-index={index} onClick={()=>approveLeaveApply(apply.ID)}>同意</Button>
            </View>
          </View>
        )))}
        {leavelist.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
      {/* <View className='item last'>
        <View className='title'>
          <View className='text'>考勤详情：</View>
        </View>
        <View className='weak' style={{ marginTop: '10rpx' }}>（{collectStartTime} ~ {collectEndTime}）</View>
        {userList.map((user, index) => (
          <View className='card' key={index}>
            <View className='user-content weak'>
              <View className='name'>{user.userInfo.nickName} {user.userInfo.realName ? `(${user.userInfo.realName})` : ''}</View>
              {user.userInfo.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {user.userInfo.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View className='placeholder'></View>
            </View>
            <View className='attendance-content'>
              <View className='tag'>应出勤：{user.totalCount}</View>
              <View className='tag'>出勤：{user.baseParticipantCount} + {user.extraParticipantCount}</View>
              <View className='tag'>请假：{user.leaveCount}</View>
              {user.ratio >= 70 && <View className='tag' style={{ backgroundColor: '#E8FFFB', color: '#0FC6C2' }}>出勤率：{user.ratio}%</View>}
              {user.ratio >= 50 && user.ratio < 70 && <View className='tag' style={{ backgroundColor: '#FFF7E8', color: '#FF7D00' }}>出勤率：{user.ratio}%</View>}
              {user.ratio < 50 && <View className='tag' style={{ backgroundColor: '#FFECE8', color: '#F53F3F' }}>出勤率：{user.ratio}%</View>}
            </View>
            {user.leave && user.leave.map((leave, leaveIndex) => (
              <View className='leave-content' key={leaveIndex}>
                <View className='title'>
                  <View className='weak'>{leave.training}</View>
                  <View className='placeholder'></View>
                  <View className='weak'>{leave.apply_time}</View>
                </View>
                <View className='weak'>{leave.reason}</View>
              </View>
            ))}
          </View>
        ))}
        {userList.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View> */}
      {/* <View className='option'>
        <Button className='cancel' size='mini' onClick={cancel}>返回</Button>
        <Button className='apply' size='mini' onClick={submit}>修改</Button>
      </View> */}
    </View>
  );
}
