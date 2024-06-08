import React from 'react';
import { View, Text, Image, Map, Button, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import './index.scss';

const userInfo = {
  isAdmin: true,
  level: 2,
};

const training = {
  date: '2024-06-05',
  start_time: '08:00',
  end_time: '10:00',
  place: { name: '体育场' },
  price: 20,
  description: '早晨的训练活动',
  status: 'notStart',
  participant: [
    {
      userInfo: { gender: 0, nickName: 'Tom', level: 'A' },
      submitTime: '2024-06-01 08:00',
    },
    {
      userInfo: { gender: 1, nickName: 'Lucy', level: 'B' },
      submitTime: '2024-06-01 09:00',
    },
  ],
  feedback: [
    {
      name: 'Alice',
      time: '2024-06-02 10:00',
      content: 'Great training!',
      key: '1',
      id: '123',
    },
  ],
  open_flag: true,
};

const markers = [
  {
    id: 1,
    longitude: 116.397428,
    latitude: 39.90923,
    width: 50,
    height: 50,
  },
];

export default function DetailTraining() {
  const router = useRouter();
  const { id, open_flag } = router.params;

  return (
    <View className="container" style={{ paddingBottom: userInfo.level ? '0' : '100rpx' }}>
      <View className="map">
        <Map
          id="map"
          markers={markers}
          longitude={markers[0].longitude}
          latitude={markers[0].latitude}
        />
      </View>
      <View className="title">
        <View>- 基本信息</View>
        {userInfo.isAdmin && (
          <Image
            className="delete"
            src="../../images/icon/delete.png"
            onClick={() => console.log('Delete training')}
          />
        )}
      </View>
      <View className="card">
        <View className="date item weak">
          <Image className="icon" src="../../images/icon/date.png" />
          {training.date}
          <View className="placeholder"></View>
          {training.status === 'notStart' && <View className="tag not-start">未开始</View>}
          {training.status === 'processing' && <View className="tag processing">进行中</View>}
          {training.status === 'end' && <View className="tag end">已结束</View>}
        </View>
        <View className="time item weak">
          <Image className="icon" src="../../images/icon/time.png" />
          {`${training.start_time}:00 - ${training.end_time}:00`}
        </View>
        <View className="location item weak">
          <Image className="icon" src="../../images/icon/location.png" />
          {training.place.name}
        </View>
        <View className="fee item weak">
          <Image className="icon" src="../../images/icon/fee.png" />
          {training.price}元/人
        </View>
        <View className="desc item weak" style={{ alignItems: 'flex-start' }}>
          <Image style={{ marginTop: '5rpx' }} className="icon" src="../../images/icon/desc.png" />
          <View style={{ width: 'calc(100% - 50rpx)' }}>{training.description || '-'}</View>
        </View>
      </View>
      <View className="title">- 参训人员 ({training.participant.length})</View>
      <View className="card">
        {training.participant.length < 1 ? (
          <View style={{ justifyContent: 'center' }} className="item weak">暂无</View>
        ) : (
          training.participant.map((person, index) => (
            <View key={index} className="person item weak">
              <Image className="avatar" src={person.userInfo.gender === 0 ? '../../images/icon/male.png' : '../../images/icon/female.png'} />
              <View style={{ width: '120rpx' }} className="ellipsis">{person.userInfo.nickName}</View>
              <View className="placeholder"></View>
              <View className="tag">{person.userInfo.level === 'A' ? '正式队员' : person.userInfo.level === 'B' ? '跟训队员' : '游客'}</View>
              <View style={{ marginLeft: '10rpx' }} className="submit-time">{person.submitTime}</View>
              {userInfo.isAdmin && (
                <Image
                  className="icon"
                  src="../../images/icon/delete-three.png"
                  onClick={() => console.log('Delete participant')}
                />
              )}
            </View>
          ))
        )}
      </View>
      <View className="title">
        - 分组详情（
        <View className="gender">
          <Image className="avatar" src="../../images/icon/male.png" />
          <View>男</View>
          <Image className="avatar" src="../../images/icon/female.png" />
          <View>女</View>
        </View>
        ）
      </View>
      <View className="card">
        {training.participant.length < 1 ? (
          <View style={{ justifyContent: 'center' }} className="item weak">暂无</View>
        ) : (
          // Assume `group` is part of `training` data structure.
          training.participant.map((person, index) => (
            <View key={index} className="group">
              <View className="person item weak">
                <Image className="avatar" src={person.userInfo.gender === 0 ? '../../images/icon/male.png' : '../../images/icon/female.png'} />
                <View>{person.userInfo.nickName}</View>
                <View className="placeholder"></View>
                <View className="tag">{person.userInfo.level}</View>
              </View>
              <View className="split-line"></View>
            </View>
          ))
        )}
      </View>
      <View className="title">- 训练反馈</View>
      <View className="card">
        {training.feedback.length < 1 ? (
          <View style={{ justifyContent: 'center' }} className="item weak">暂无</View>
        ) : (
          training.feedback.map((feedback, index) => (
            <View key={index} className="group">
              <View className="comment item weak">
                <View className="head">
                  <View style={{ width: '340rpx' }} className="sign ellipsis">{feedback.name}</View>
                  <View className="placeholder"></View>
                  <View className="time">{feedback.time}</View>
                  {feedback.key && feedback.id === userInfo._id && (
                    <Image
                      style={{ margin: '0 0 0 10rpx' }}
                      className="icon"
                      src="../../images/icon/delete-three.png"
                      onClick={() => console.log('Delete feedback')}
                    />
                  )}
                </View>
                <View className="content">
                  <Text decode="true">{feedback.content}</Text>
                </View>
              </View>
              <View className="split-line"></View>
            </View>
          ))
        )}
      </View>
      <View className="option" style={{ display: userInfo.level || training.open_flag ? 'flex' : 'none' }}>
        <Button className="feedback" size="mini" onClick={() => console.log('Feedback')}>训练反馈</Button>
        {training.status === 'notStart' && (
          <>
            <Button className="apply" size="mini" onClick={() => console.log('Apply')}>训练报名</Button>
            <Button className="cancel" size="mini" onClick={() => console.log('Cancel')}>取消报名</Button>
            <Button className="leave" size="mini" onClick={() => console.log('Leave')}>
              <Image className="icon" src="../../images/icon/healthy-recognition.png" />
            </Button>
          </>
        )}
      </View>
      {/* Feedback Modal */}
      <View className="feedback-modal-shadow" style={{ display: false ? 'block' : 'none' }}></View>
      <View className="feedback-modal" style={{ display: false ? 'block' : 'none' }}>
        <View>训练反馈</View>
        <Textarea className="input" value="" maxLength={-1} onInput={() => console.log('Input Feedback')} />
        <View className="button-group">
          <Button onClick={() => console.log('Cancel Feedback')}>取消</Button>
          <Button onClick={() => console.log('Submit Feedback')}>提交</Button>
        </View>
      </View>
      {/* Leave Modal */}
      <View className="leave-modal-shadow" style={{ display: false ? 'block' : 'none' }}></View>
      <View className="leave-modal" style={{ display: false ? 'block' : 'none' }}>
        <View>请假理由</View>
        <Textarea className="input" value="" onInput={() => console.log('Input Leave Reason')} />
        <View className="button-group">
          <Button onClick={() => console.log('Cancel Leave')}>取消</Button>
          <Button onClick={() => console.log('Submit Leave')}>提交</Button>
        </View>
      </View>
    </View>
  );
}
