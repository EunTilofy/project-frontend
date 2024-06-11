import React, { useEffect, useState } from 'react';
import { useLoad } from '@tarojs/taro';
import { View, Text, Image, Button, Textarea, Map } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const markers = [
  {
    id: 1,
    longitude: 120.075721,
    latitude: 30.307077,
    width: 50,
    height: 50,
  },
];

export default function DetailTraining() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentTraining, setCurrentTraining] = useState({});
  const [participants, setParticipants] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useLoad(() => {
    console.log('Page loaded.');

    const userRole = Taro.getStorageSync('userRole');
    setIsAdmin(userRole === 0);
    console.log('isAdmin: ', userRole === 0);

    const train = Taro.getStorageSync('currentTraining');
    console.log('current: ', train);
    if (train) setCurrentTraining(train);

    const token = Taro.getStorageSync('token');
    console.log('token : ', token);

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getAttendList',
      method: 'POST',
      header: { Authorization : token, },
      data: { training_id : train.ID, },
      success(response) {
        train.Participants = response.data.result;
        console.log('get participants ok!', response.data);
        console.log('train.Participants: ', train.Participants);
    if (Array.isArray(train.Participants)) {
      console.log('check user');
      const promises = train.Participants.map(person => {
        return new Promise((resolve, reject) => {
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/user/getAnyUserInfo',
            method: 'POST',
            header: {
              Authorization: token,
            },
            data: {
              user_id: person.UserID,
            },
            success(response) {
              console.log('get one participant ok', response.data);
              resolve({ ...response.data.result });
            },
            fail(err) {
              console.log('Failed to get participant info', err);
              reject(err);
            }
          });
        });
      });

      Promise.all(promises)
        .then(results => {
          setParticipants(results);
          console.log('Participants:', results);
        })
        .catch(err => {
          console.log('Failed to fetch participant info:', err);
        });
    }
      },
      fail(err) { console.log('fail to get participants', err); }
    });

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getCommentList',
      method: 'POST',
      header: { Authorization : token, },
      data: { training_id : train.ID, },
      success(response){
        console.log('Get feedbacks ok', response.data.result);
        setFeedback(response.data.result);
      },
      fail(err){console.log('Fail to get feedbacks.', err);}
    });
  });

  return (
    <View className="container" style={{ paddingBottom: '100rpx' }}>
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
        {isAdmin && (
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
          <Text decode="true">{`${new Date(currentTraining.StartTime).toLocaleDateString()}`}</Text>
          <View className="placeholder"></View>
          {currentTraining.status === 'notStart' && <View className="tag not-start">未开始</View>}
          {currentTraining.status === 'processing' && <View className="tag processing">进行中</View>}
          {currentTraining.status === 'end' && <View className="tag end">已结束</View>}
        </View>
        <View className="time item weak">
          <Image className="icon" src="../../images/icon/time.png" />
          {`${new Date(currentTraining.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})} - ${new Date(currentTraining.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}
        </View>
        <View className="desc item weak" style={{ alignItems: 'flex-start' }}>
          <Image style={{ marginTop: '5rpx' }} className="icon" src="../../images/icon/desc.png" />
          <View style={{ width: 'calc(100% - 50rpx)' }}>{currentTraining.Description || '-'}</View>
        </View>
      </View>
      <View className="title">- 参训人员 ({participants.length})</View>
      <View className="card">
        {participants.length < 1 ? (
          <View style={{ justifyContent: 'center' }} className="item weak">暂无</View>
        ) : (
          participants.map((person, index) => (
            <View key={index} className="person item weak">
              <Image className="avatar" src={person.gender === 0 ? '../../images/icon/male.png' : '../../images/icon/female.png'} />
              <View style={{ width: '120rpx' }} className="ellipsis">{person.nickname}</View>
              <View className="placeholder"></View>
              {/* <View className="tag">{person.level === 'A' ? '正式队员' : person.level === 'B' ? '跟训队员' : '游客'}</View> */}
              {/* <View style={{ marginLeft: '10rpx' }} className="submit-time">{person.submitTime}</View> */}
              {isAdmin && (
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
      <View className="title">- 训练反馈</View>
      <View className="card">
        {feedback.length < 1 ? (
          <View style={{ justifyContent: 'center' }} className="item weak">暂无</View>
        ) : (
          feedback.map((feedback, index) => (
            <View key={index} className="group">
              <View className="comment item weak">
                <View className="head">
                  <View style={{ width: '340rpx' }} className="sign ellipsis">{feedback.User.nickname}</View>
                  <View className="placeholder"></View>
                  <View className="time">{`${new Date(currentTraining.StartTime).toLocaleDateString()} ${new Date(currentTraining.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}</View>
                </View>
                <View className="content">
                  <Text decode="true">{feedback.Content}</Text>
                </View>
              </View>
              <View className="split-line"></View>
            </View>
          ))
        )}
      </View>
      <View className="option" style={{ display: 'flex' }}>
        <Button className="feedback" size="mini" onClick={() => console.log('Feedback')}>训练反馈</Button>
        {currentTraining.status === 'notStart' && (
          <>
            <Button className="apply" size="mini" onClick={() => console.log('Apply')}>训练报名</Button>
            <Button className="cancel" size="mini" onClick={() => console.log('Cancel')}>取消报名</Button>
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