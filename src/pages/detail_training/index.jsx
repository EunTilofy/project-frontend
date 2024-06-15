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
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [hasregister, setHasregister] = useState(-1);
  const [LeaveModalVisible, setLeaveModalVisible] = useState(false);
  const [leaveText, setLeaveText] = useState([]);
  const [hasleave, setHasLeave] = useState(false);
  const [hasqiandao, setHasqiandao] = useState(true);

  const getFeedback = () => {
    const token = Taro.getStorageSync('token');
      const train = Taro.getStorageSync('currentTraining');
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
  };

  const FetchParticipants = () => {
    const token = Taro.getStorageSync('token');
    const train = Taro.getStorageSync('currentTraining');
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
              resolve({ ...response.data.result, ID : person.ID, Line: person.Line, Status : person.Status});
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
  };

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
      url: 'https://9bh279vn9856.vicp.fun/api/training/getSelfParticipantList',
      method: 'POST',
      header: { Authorization : token, },
      success(res) {
        console.log('get self participant list success', res.data);
        if (res.data && Array.isArray(res.data.result)) {
          const registered = res.data.result.find(participant => participant.TrainingID === train.ID);
          if (registered && (registered.Status === 'enrolled' || registered.Status === 'attended')) {
            setHasregister(registered.ID);
            console.log('Registered for training ID:', registered.ID);
          }
          if (registered && registered.Status !== 'enrolled' && registered.Status !== 'attended') {
            setHasLeave(true);
          }
          if (registered && registered.Status === 'attended') {
            setHasqiandao(true);
          }
        }
      },
      fail(err) { console.log('get self participant list fail', err); }
    });

    FetchParticipants();

    getFeedback();
  });

  const handleFeedbackSubmit = () => {
    console.log('Feedback:', feedbackText);

    if(feedbackText === '') {
      Taro.showModal({
        title: 'Warning',
        content: '反馈内容不能为空！',
      });
    } else {
      const token = Taro.getStorageSync('token');
      const train = Taro.getStorageSync('currentTraining');
      Taro.request({
        url: 'https://9bh279vn9856.vicp.fun/api/training/comment',
        method: 'POST',
        header: { Authorization : token, },
        data: {
          training_id : train.ID, 
          content: feedbackText
        },
        success(response){
          console.log('send feedbacks ok', response.data);
          getFeedback();
        },
        fail(err){console.log('Fail to send feedbacks.', err);}
       });
      setFeedbackModalVisible(false);
      setFeedbackText(''); 
    }
  };

  const handleLeaveSubmit = () => {
    console.log('leave:', leaveText);

    if(leaveText === '') {
      Taro.showModal({
        title: 'Warning',
        content: '请假理由不能为空！',
      });
    } else {
      const token = Taro.getStorageSync('token');
      const train = Taro.getStorageSync('currentTraining');
      Taro.request({
        url: 'https://9bh279vn9856.vicp.fun/api/training/leave',
        method: 'POST',
        header: { Authorization : token, },
        data: {
          training_id : train.ID, 
          message: leaveText
        },
        success(response){
          console.log('send leave apply ok', response.data);
          if (response.data.code === 0) 
          {
            Taro.showToast({
              title: '已成功请假训练',
              icon: 'success',
              duration: 2000,
            });
            setHasLeave(true);
          }
          // getFeedback();
        },
        fail(err){console.log('Fail to send leave apply.', err);}
       });
      setLeaveModalVisible(false);
      setLeaveText(''); 
    }
  };

  const handleFeedbackCancel = () => {
    Taro.showModal({
      title: '取消反馈',
      content: '确定要取消反馈吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          setFeedbackModalVisible(false);
          setFeedbackText('');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  };

  const handleLeaveCancel = () => {
    Taro.showModal({
      title: '取消请假',
      content: '确定要取消请假吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          setLeaveModalVisible(false);
          setLeaveText('');
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  };

  const setqiandao = () => {
    console.log('qiandao!!!');
    const token = Taro.getStorageSync('token');
    const train = Taro.getStorageSync('currentTraining');
    Taro.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        Taro.request({
          url: 'https://9bh279vn9856.vicp.fun/api/training/signIn',
          method: 'POST',
          header: { Authorization : token },
          data: {
            training_id: train.ID,
            position: { longitude : longitude, latitude : latitude}
          },
          success: function(response) {
            if (response.data.code === 0) {
              Taro.showToast({
                title: '签到成功!',
                icon: 'success',
                duration: 2000
              });
            } else {
              Taro.showToast({
                title: '签到失败: ' + response.data.message,
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: function(error) {
            Taro.showToast({
              title: '签到请求失败',
              icon: 'none',
              duration: 2000
            });
            console.log('请求失败', error);
          }
        });
      },
      fail: function (err) {
        Taro.showToast({
          title: '获取位置失败',
          icon: 'none',
          duration: 2000
        });
        console.log('获取位置失败', err);
      }
    });
  };

  const deletetraining = () => {
    Taro.showModal({
      title: '删除训练',
      content: '您确定要删除这次训练吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          const token = Taro.getStorageSync('token');
          const train = Taro.getStorageSync('currentTraining');
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/training/delete',
            method: 'POST',
            header: { Authorization : token },
            data: { id : train.ID },
            success(response) {
              console.log('delete training ok', response.data);
              if(response.data.code === 0)
              {
              Taro.showToast({
                title: '已成功删除训练',
                icon: 'success',
                duration: 2000,
                success: function () {
                  Taro.setStorageSync('needRefresh', true);
                  Taro.switchTab({url: '/pages/training/index'});
                }
              });
              } else {
                Taro.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail(err) {
              console.log('Fail to delete training.', err);
              Taro.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  };

  const cancel_register = (id) => {
    return new Promise((resolve, reject) => {
      const token = Taro.getStorageSync('token');
      Taro.request({
        url: 'https://9bh279vn9856.vicp.fun/api/training/removeParticipant',
        method: 'POST',
        header: { Authorization : token },
        data: { participant_id : id },
        success(res) {
          console.log('remove participant : ', res.data);
          if(res.data.code === 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        fail(err) {
          console.error('Error removing participant:', err);
          reject(err);
        }
      });
    });
  };

  const removeParticipant = (id) => {
    Taro.showModal({
      title: '确认操作',
      content: '你确定要删除这名队员的报名吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          cancel_register(id).then(success => {
            if (success) {
              Taro.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              if(id === hasregister) setHasregister(-1);
              FetchParticipants();
            } else {
              Taro.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              });
            }
          }).catch(error => {
            console.error('删除过程中发生错误', error);
            Taro.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  }

  const trainregister = () => {
    const token = Taro.getStorageSync('token');
    const train = Taro.getStorageSync('currentTraining');
    if(hasregister === -1) {
      console.log('register!');
      Taro.request({
        url: 'https://9bh279vn9856.vicp.fun/api/training/enroll',
        method: 'POST',
        header: { Authorization : token },
        data: { training_id : train.ID },
        success(res) {
          console.log('success to register', res.data);
          if(res.data.code === 0) 
          {
            Taro.showToast({
              title: '报名成功',
              icon: 'success', 
              duration: 2000
            });
            Taro.request({
              url: 'https://9bh279vn9856.vicp.fun/api/training/getSelfParticipantList',
              method: 'POST',
              header: { Authorization : token, },
              success(res) {
                console.log('get self participant list success', res.data);
                if (res.data && Array.isArray(res.data.result)) {
                  const registered = res.data.result.find(participant => participant.TrainingID === train.ID);
                  if (registered && (registered.Status === 'enrolled' || registered.Status === 'attended')) {
                    setHasregister(registered.ID);
                    console.log('Registered for training ID:', registered.ID);
                  }
                  if (registered && registered.Status !== 'enrolled' && registered.Status !== 'attended') {
                    setHasLeave(true);
                  }
                  if (registered && registered.Status === 'attended') {
                    setHasqiandao(true);
                  }
                }
              },
              fail(err) { console.log('get self participant list fail', err); }
            });
            FetchParticipants();
          } else
          {
            Taro.showToast({
              title: '报名失败',
              icon: 'none', 
              duration: 2000
            });
          }
        },
        fail(err) { 
          console.log('fail to register', err);
          Taro.showToast({
            title: '报名失败',
            icon: 'none', 
            duration: 2000
          });
        }
      });
    } 
    else{
      cancel_register(hasregister).then(success => {
        if (success) {
          setHasregister(-1);
          Taro.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          });
          FetchParticipants();
        } else {
          Taro.showToast({
            title: '取消失败',
            icon: 'none',
            duration: 2000
          });
        }
      }).catch(err => {
        console.log('取消注册失败:', err);
        Taro.showToast({
          title: '取消失败',
          icon: 'none',
          duration: 2000
        });
      });
    }
  };

  const updatesubteam = (id) => {
    Taro.showModal({
      title: '输入新的分队',
      content: '',
      editable: true,
      success: function (modalRes) {
        if (modalRes.confirm && modalRes.content) {
          const Line = modalRes.content;
          const token = Taro.getStorageSync('token');
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/training/changeTrainingLine',
            method: 'POST',
            header: { Authorization : token },
            data: { participant_id: id, line: Line },
            success(res) {
              if (res.data && res.data.code === 0) {
                Taro.showToast({
                  title: '修改分队成功',
                  icon: 'success',
                  duration: 2000
                });
                FetchParticipants();
              } else {
                Taro.showToast({
                  title: '修改失败：' + res.data.message,
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail(err) {
              Taro.showToast({
                title: '请求失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  };

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
            onClick={() => deletetraining()}
          />
        )}
      </View>
      <View className="card">
        <View className="time item weak">
          <Image className="icon" src="../../images/icon/topic.png" />
          <View style={{ width: 'calc(100% - 50rpx)' }}>{currentTraining.Name || '-'}</View>
        </View>
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
              {/* <View className="tag">{person.role === 'user' ? '游客' : '正式队员'}</View> */}
              <View style={{ marginLeft: '10rpx' }} className="tag">{person.Line}</View>
              {isAdmin && (
                <View className="button-group" style={{ marginLeft: '30rpx', display: 'flex', alignItems: 'right', width: '30vw', justifyContent: 'flex-end' }}>
                  <Button
                    className="admin-button"
                    style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                    onClick={() => removeParticipant(person.ID)}
                    >移除</Button>
                    <Button className="admin-button"
                            style={{ backgroundColor: 'red', color: 'white' }}
                            onClick={() => updatesubteam(person.ID)}
                    >修改分队</Button>
                    {/* {person.Status === 'attended' && (<View className="attended-badge">已签到</View>)} */}
                </View>
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
                <Image className="avatar" 
                    src={(feedback.User.avatar === '' || feedback.User.avatar === 'dsa')  ?  '../../images/grey.png' : feedback.User.avatar} 
                    tyle={{ width: '80rpx', height: '80rpx' }}
                />
                  <View style={{ width: '340rpx' }} className="sign ellipsis">{feedback.User.nickname}</View>
                  {/* <View className="placeholder"></View> */}
                  <View className="time">{`${new Date(feedback.CreatedAt).toLocaleDateString()} ${new Date(feedback.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`}</View>
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
        <Button className="feedback" size="mini" onClick={() => setFeedbackModalVisible(true)}>训练反馈</Button>
        {currentTraining.status === 'notStart' && (
          <>
            {hasregister === -1 && hasleave === false && <Button className="apply" size="mini" onClick={() => trainregister()}>训练报名</Button>}
            {hasregister !== -1 && hasleave === false && <Button className="apply" size="mini" onClick={() => trainregister()}>取消报名</Button>}
            {hasregister === -1 && hasleave === false && <Button className="cancel" size="mini" onClick={() => setLeaveModalVisible(true)}>训练请假</Button>}
          </>
        )}
        {currentTraining.status === 'processing' && hasregister !== -1 && hasqiandao === false &&  (
          <>
            <Button className='apply' size='mini' onClick={() => setqiandao()}>训练签到</Button>
          </>
        )}
        {currentTraining.status === 'processing' && hasregister !== -1 && hasqiandao === true &&  (
          <>
            <Button className='cancel' size='mini' onClick={() => setqiandao()}>已签到</Button>
          </>
        )}
      </View>
      {/* Feedback Modal */}
      <View className="feedback-modal-shadow" style={{ display: feedbackModalVisible ? 'block' : 'none' }}></View>
      <View className="feedback-modal" style={{ display: feedbackModalVisible ? 'block' : 'none' }}>
        <View className='modal-header'>训练反馈</View>
        <Textarea className="input" value={feedbackText} maxLength={-1} onInput={e => setFeedbackText(e.target.value)} />
        <View className="button-group">
          <Button onClick={handleFeedbackCancel}>取消</Button>
          <Button onClick={handleFeedbackSubmit}>提交</Button>
        </View>
      </View>
      {/* Leave Modal */}
      <View className="leave-modal-shadow" style={{ display: LeaveModalVisible ? 'block' : 'none' }}></View>
      <View className="leave-modal" style={{ display: LeaveModalVisible ? 'block' : 'none' }}>
        <View className='modal-header'>请假理由</View>
        <Textarea className="input" value={leaveText} maxLength={-1} onInput={e => setLeaveText(e.target.value)} />
        <View className="button-group">
          <Button onClick={handleLeaveCancel}>取消</Button>
          <Button onClick={handleLeaveSubmit}>提交</Button>
        </View>
      </View>
    </View>
  );
}