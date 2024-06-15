import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react';
import './index.scss'
import Taro from '@tarojs/taro';

// const attendance = {
//   baseParticipantCount: "100",
//   extraParticipantCount: "100",
//   totalCount: "100",
//   ratio: 100,
//   leaveCount: 2
// };

// const leaveList = [
//   { training: { title: "Training 1" }, apply_time: "2024-06-01", reason: "Sick" },
//   { training: { title: "Training 2" }, apply_time: "2024-06-02", reason: "Work" }
// ];

export default function Club() {
  const [tot, settot] = useState(0);
  const [attendtot, setattendtot] = useState(0);
  const [leavetot, setleavetot] = useState(0);
  // const [ratio, setratio] = useState(0);
  const [leavelist, setleavelist] = useState([]);


  useLoad(() => {
    console.log('Page loaded.')

    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getTrainingNumber',
      method: 'POST',
      header: { Authorization : token },
      success(res) {
        console.log('get tot : ', res.data);
        settot(res.data.result);
      }
    });

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getSelfParticipantList',
      method: 'POST',
      header: { Authorization : token },
      success(res) {
        if (res.data && Array.isArray(res.data.result)) {
          const attendedCount = res.data.result.filter(person => person.Status === 'attended').length;
          console.log('Number of attendees:', attendedCount);
          setattendtot(attendedCount);
        }
      }
    });

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getSelfLeaveList',
      method: 'POST',
      header: { Authorization : token },
      success(res) {
        console.log('res: ', res.data.result);
        if (res.data && Array.isArray(res.data.result)) {
          const LeaveCount = res.data.result.filter(person => person.Status === 'leave_approval').length;
          console.log('Number of leave:', LeaveCount);
          setleavetot(LeaveCount);

          setleavelist(res.data.result);
        }
      }
    });

  })

  return (
    <View className="container">
      <View className="attendance">
        <View className="statistic">
          <View className="row">
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">训练总场数：{tot}</View>
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">已参加场数：{attendtot}</View>
          </View>
          <View className="row">
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">请假总场数：{leavetot}</View>
            <View style={{ backgroundColor: '#E8FFFB', color: '#0FC6C2' }} className="item">出勤得分：{Math.round((attendtot+leavetot)/tot*100)}%</View>
            {/* {ratio >= 50 && ratio < 70 && <View style={{ backgroundColor: '#FFF7E8', color: '#FF7D00' }} className="item">出勤得分：{ratio}%</View>}
            {ratio < 50 && <View style={{ backgroundColor: '#FFECE8', color: '#F53F3F' }} className="item">出勤得分：{ratio}%</View>} */}
          </View>
        </View>
        <View className="info weak">
          <Text decode="true">
            考勤说明：
            目前仅允许伤病休整以及工作原因请假，其他理由视作缺勤。
          </Text>
        </View>
        {leavelist.length > 0 && (
  <View className="item leave-content">
    <View className="title">
      <View className="text">请假记录：</View>
    </View>
    {leavelist.map((leave, index) => (
      <View key={index} className="leave">
        <View className="title">
          <View className="weak">
            {leave.Training.Name}
            {leave.Status === 'leave_approval' && <View className="tag approved">已通过</View>}
            {leave.Status !== 'leave_approval' && leave.Status !== 'leave_pending' && <View className="tag rejected">拒绝</View>}
            {leave.Status === 'leave_pending' && <View className="tag pending">申请中</View>}
          </View>
        </View>
        <View className="weak">{leave.Message}</View>
      </View>
    ))}
  </View>
)}
      </View>
    </View>
  )
}
