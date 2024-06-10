import { View, Image, Text } from '@tarojs/components'
import { useLoad, navigateTo } from '@tarojs/taro'
import React, { useEffect, useState } from 'react';
import './index.scss'
import Taro from '@tarojs/taro';

export default function Center() {
  const userInfo = {
    avatar: '../../images/16.jpg',
    nickName: 'EunTilofy',
    no: 1,
    level: 'A',
    isAdmin: true
  };

  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    const userR = (Taro.getStorageSync('userRole') === 0);
    console.log(userR);
    if (userR) {
      setisAdmin(userR);
    }
  }, []);

  useLoad(() => {
    console.log('Page loaded.')
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
    console.log('Apply for membership')
  }

  const applyFollowship = () => {
    console.log('Apply for followship')
  }

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
            {userInfo.no >= 0 && <View className="tag">{userInfo.no}</View>}
            {userInfo.level === 'A' && <View className="tag">正式队员</View>}
            {userInfo.level === 'B' && <View className="tag">跟训队员</View>}
            {userInfo.level !== 'A' && userInfo.level !== 'B' && <View className="tag">游客</View>}
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
              {userInfo.level !== 'A' && (
                <View className="item" onClick={applyMembership}>
                  <Image className="icon" src="../../images/icon/upgrade.png" />
                  <View className="text">入队申请</View>
                </View>
              )}
              {userInfo.level === 'A' && (
                <View className="item" style={{ backgroundColor: '#ffffff' }}></View>
              )}
            </View>
            <View className="row">
              {userInfo.level !== 'A' && userInfo.level !== 'B' && (
                <View className="item" onClick={applyFollowship}>
                  <Image className="icon" src="../../images/icon/upgrade.png" />
                  <View className="text">跟训申请</View>
                </View>
              )}
              {userInfo.level !== 'A' && userInfo.level !== 'B' && (
                <View className="item" style={{ backgroundColor: '#ffffff' }}></View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
