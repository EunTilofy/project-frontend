import React, { useEffect, useState } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

const userInfo = {
  isAdmin: true,
  level: 2,
};

const trainingList = [
  {
    _id: '1',
    open_flag: true,
    special_flag: false,
    title: '早晨训练',
    date: '2024-06-05',
    start_time: '08:00',
    end_time: '10:00',
    surface_plot: '../../images/activity-bg.png',
    place: { name: '体育场' },
    price: 20,
    description: '早晨的训练活动',
    status: 'notStart',
  },
  {
    _id: '2',
    open_flag: false,
    special_flag: true,
    title: '特别活动',
    date: '2024-06-06',
    start_time: '14:00',
    end_time: '16:00',
    surface_plot: '../../images/activity-bg.png',
    place: { name: '健身房' },
    price: 50,
    description: '特别的训练活动',
    status: 'processing',
  },
];

const navigateToDetailTraining = (training) => {
  Taro.navigateTo({
    url: `/pages/detail_training/index?id=${training._id}&open_flag=${training.open_flag}`,
  });
};

export default function Training() {
  return (
    // <Text> {userInfo.isAdmin ? '0' : '1'} </Text>
    <View className="container">
      <View className="title-head">
        <View className="search-bar placeholder">
          <Input className="input placeholder" type="text" placeholder="搜索" />
          <View className="icon-box" style={{ marginRight: userInfo.isAdmin ? '0' : '20px' }}>
            <Image className="icon" mode="aspectFill" src="../../images/icon/search.png" />
          </View>
        </View>
        {userInfo.isAdmin && (
          <View className="add" onClick={() => Taro.navigateTo({ url: '/pages/add_training/index' })}>
            <Image className="icon" mode="aspectFill" src="../../images/icon/add.png" />
          </View>
        )}
      </View>
      {trainingList.map((training) => (
        <View key={training._id} className="card" onClick={() => navigateToDetailTraining(training)}>
          <View className="item head">
            <View className="title">
              {training.open_flag ? '开放活动' : training.special_flag ? '特别活动' : '常规训练'} | {training.title}
            </View>
            <View className="placeholder"></View>
            <View className={`tag ${training.open_flag || training.special_flag ? 'training' : ''}`}>
              {training.open_flag || training.special_flag ? '活动' : '训练'}
            </View>
            {training.status === 'notStart' && <View className="tag not-start">未开始</View>}
            {training.status === 'processing' && <View className="tag processing">进行中</View>}
            {training.status === 'end' && <View className="tag end">已结束</View>}
          </View>
          <Image className="surface-plot" mode="widthFix" src={training.surface_plot} />
          <View className="date item weak">
            <Image className="icon" src="/images/icon/date.png" />
            <Text decode="true">{`${training.date} ${training.start_time}:00 ~ ${training.end_time}:00`}</Text>
          </View>
          <View className="location item weak">
            <Image className="icon" src="/images/icon/location.png" />
            {training.place.name}
          </View>
          <View className="fee item weak">
            <Image className="icon" src="/images/icon/fee.png" />
            {training.price}元/人
          </View>
          <View className="desc item weak" style={{ alignItems: 'flex-start' }}>
            <Image style={{ marginTop: '5rpx' }} className="icon" src="/images/icon/desc.png" />
            <View style={{ width: 'calc(100% - 50rpx)' }}>{training.description || '-'}</View>
          </View>
        </View>
      ))}
    </View>
  );
}
