import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

const attendance = {
  baseParticipantCount: "100",
  extraParticipantCount: "100",
  totalCount: "100",
  ratio: 100,
  leaveCount: 2
};

const leaveList = [
  { training: { title: "Training 1" }, apply_time: "2024-06-01", reason: "Sick" },
  { training: { title: "Training 2" }, apply_time: "2024-06-02", reason: "Work" }
];

export default function Club() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  const startMonth = 6;
  const startDay = 1;
  const endMonth = 6;
  const endDay = 7;

  return (
    <View className="container">
      <View className="attendance">
        <View className="statistic">
          <View className="row">
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">基本出勤分：{attendance.baseParticipantCount}</View>
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">额外出勤分：{attendance.extraParticipantCount}</View>
          </View>
          <View className="row">
            <View style={{ backgroundColor: '#E8F3FF', color: '#165DFF' }} className="item">应出勤分：{attendance.totalCount}</View>
            {attendance.ratio >= 70 && <View style={{ backgroundColor: '#E8FFFB', color: '#0FC6C2' }} className="item">出勤率：{attendance.ratio}%</View>}
            {attendance.ratio >= 50 && attendance.ratio < 70 && <View style={{ backgroundColor: '#FFF7E8', color: '#FF7D00' }} className="item">出勤率：{attendance.ratio}%</View>}
            {attendance.ratio < 50 && <View style={{ backgroundColor: '#FFECE8', color: '#F53F3F' }} className="item">出勤率：{attendance.ratio}%</View>}
          </View>
        </View>
        <View className="info weak">
          <Text decode="true">
            考勤说明：
            本次考勤周期为{startMonth ? startMonth : '/'}月{startDay ? startDay : '/'}日～{endMonth ? endMonth : '/'}月{endDay ? endDay : '/'}日，数据统计截止日期为昨天。
            目前仅允许伤病休整以及工作原因请假，其他理由视作缺勤。
          </Text>
        </View>
        {leaveList.length > 0 && (
          <View className="item leave-content">
            <View className="title">
              <View className="text">请假记录（ 当前周期已请假 {attendance.leaveCount} 天 ）</View>
            </View>
            {leaveList.map((leave, index) => (
              <View key={index} className="leave">
                <View className="title">
                  <View className="weak">{leave.training.title}</View>
                  <View className="placeholder"></View>
                  <View className="weak">{leave.apply_time}</View>
                </View>
                <View className="weak">{leave.reason}</View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
