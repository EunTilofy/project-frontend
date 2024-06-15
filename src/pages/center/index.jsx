import { View, Image, Text } from '@tarojs/components'
import { useLoad, navigateTo } from '@tarojs/taro'
import React, { useEffect, useState } from 'react';
import './index.scss'
import Taro from '@tarojs/taro';

export default function Center() {
  const [userInfo, setUserInfo] = useState({
    avatar: '../../images/grey.png',
    nickName: '',
    gender: 2,
    phone: '',
    email: '',
    role: '',
  });

  const [isAdmin, setisAdmin] = useState(false);

  useLoad(() => {
    console.log('Page loaded.');
    const userR = (Taro.getStorageSync('userRole') === 0);
    console.log("user Role : ", userR);
    if (userR) {
      setisAdmin(true);
    }
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/user/getInfo',
      method: 'POST',
      header: { Authorization : token, },
      success(response){
        console.log('get info ok', response.data);
        setUserInfo({ ...userInfo, 
          avatar : response.data.result.avatar === '' ? '../../images/grey.png' : response.data.result.avatar,
          nickName: response.data.result.nickname,
          gender: response.data.result.gender,
          phone: response.data.result.phone_number,
          email: response.data.result.email,
          role: response.data.result.role,
        });
      },
      fail(err){console.log('Fail to get info', err);}
    });
  })

  const navigateToUserDetail = () => {
    Taro.navigateTo({
      url: `/pages/user_detail/index`,
    });
  }

  const navigateToManage = () => {
    Taro.navigateTo({
      url: `/pages/manage/index`,
    });
  }

  const navigateToAttendance = () => {
    Taro.navigateTo({
      url: `/pages/attendance/index`,
    });
  }

  const applyMembership = () => {
    console.log('Apply for membership');
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/team/apply',
      method: 'POST',
      header: { Authorization : token, },
      success(response){
        console.log('apply ok', response.data);
        Taro.showToast({
          title: '已成功提交申请',
          icon: 'success', // 使用成功图标
          duration: 2000 // 持续时间为2000毫秒
        });
      },
      fail(err){
        console.log('Fail apply', err);
        Taro.showToast({
          title: '申请失败', // 提示内容
          icon: 'none', // 不使用图标
          duration: 2000 // 持续时间为2000毫秒
        });
      }
    });
  }

  // const applyFollowship = () => {
  //   console.log('Apply for followship')
  // }

  return (
    <View className="container">
      <Image
        className="background-image"
        mode="aspectFit"
        src="../../images/activity-bg.png"
      />
      <View className="box">
        <View className="user">
          <View className="head">
            <View className="placeholder"></View>
            <Image className="avatar" mode="aspectFit" src={userInfo.avatar} />
            <View className="update-box">
              {/* <View className="placeholder"></View>
              <View className="update" onClick={updateUserInfo}>
                <Image className="icon" mode="aspectFit" src="../../images/icon/edit-name.png" />
              </View> */}
            </View>
          </View>
          <View className="name">{userInfo.nickName}</View>
          <View className="club weak">浙江大学HawkSoar飞盘队</View>
          <View className="tags">
            {/* {userInfo.no >= 0 && <View className="tag">{userInfo.no}</View>} */}
            {(userInfo.role === 'admin' || userInfo.role === 'member') && <View className="tag">正式队员</View>}
            {/* {userInfo.level === 'B' && <View className="tag">跟训队员</View>} */}
            {(userInfo.role !== 'admin' && userInfo.role !== 'member') && <View className="tag">游客</View>}
            {isAdmin === true && <View className="tag">管理员</View>}
          </View>
        </View>
        <View className="split-line"></View>
        {isAdmin === true ? (
          <View className="menu">
            <View className="row">
              <View className="item" onClick={navigateToUserDetail}>
                <Image className="icon" src="../../images/icon/edit-name.png" />
                <View className="text">个人信息</View>
              </View>
              <View className="item" onClick={navigateToAttendance}>
                <Image className="icon" src="../../images/icon/plan.png" />
                <View className="text">考勤管理</View>
              </View>
            </View>
            <View className="row">
              <View className="item" onClick={navigateToManage}>
                <Image className="icon" src="../../images/icon/shrimp.png" />
                <View className="text">队伍管理</View>
              </View>
              <View className="item" style={{ backgroundColor: '#ffffff' }}></View>
            </View>
          </View>
        ) : (
          <View className="menu">
            <View className="row">
              <View className="item" onClick={navigateToUserDetail}>
                <Image className="icon" src="../../images/icon/edit-name.png" />
                <View className="text">个人信息</View>
              </View>
              {userInfo.role !== 'member' && (
                <View className="item" onClick={applyMembership}>
                  <Image className="icon" src="../../images/icon/upgrade.png" />
                  <View className="text">入队申请</View>
                </View>
              )}
              {userInfo.level === 'A' && (
                <View className="item" style={{ backgroundColor: '#ffffff' }}></View>
              )}
            </View>
            {/* <View className="row">
              {userInfo.level !== 'A' && userInfo.level !== 'B' && (
                <View className="item" onClick={applyFollowship}>
                  <Image className="icon" src="../../images/icon/upgrade.png" />
                  <View className="text">跟训申请</View>
                </View>
              )}
              {userInfo.level !== 'A' && userInfo.level !== 'B' && (
                <View className="item" style={{ backgroundColor: '#ffffff' }}></View>
              )}
            </View> */}
          </View>
        )}
      </View>
    </View>
  )
}
