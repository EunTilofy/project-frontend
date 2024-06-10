import React, { useEffect, useState } from 'react';
import { View, Text, Image, Input, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import './index.scss';

export default function Training() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [trainingList, setTrainingList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigateToDetailTraining = (training) => {
    Taro.setStorageSync('currentTraining', training);
    Taro.navigateTo({
      url: `/pages/detail_training/index`,
    });
  };

  const fetchTrainingList = (page, isRefresh = false) => {
    const token = Taro.getStorageSync('token');

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/getTrainingList',
      method: 'POST',
      header: {
        Authorization: token,
      },
      data: {
        page_no: page,
        page_size: 5
      },
      success(response) {
        console.log('Request Success', response.data);
        if (Array.isArray(response.data.result)) {
          const currentTime = new Date();
          const updatedTrainingList = response.data.result.map(training => {
            const startTime = new Date(training.StartTime);
            const endTime = new Date(training.EndTime);
            let status = 'notStart';
            if (currentTime >= startTime && currentTime <= endTime) {
              status = 'processing';
            } else if (currentTime > endTime) {
              status = 'end';
            }
            return { ...training, status };
          });

          if (isRefresh) {
            setTrainingList(updatedTrainingList);
          } else {
            setTrainingList(prevList => [...prevList, ...updatedTrainingList]);
          }

          setHasMore(response.data.result.length > 0);
        } else {
          console.log('Unexpected response data format', response.data);
        }
      },
      fail(error) {
        console.log('Request Failure', error);
      },
      complete() {
        Taro.stopPullDownRefresh();
      }
    });
  };

  useEffect(() => {
    const userRole = Taro.getStorageSync('userRole');
    setIsAdmin(userRole === 0);
    console.log('isAdmin: ', userRole == 0);
    fetchTrainingList(pageNo);
  }, []);

  const loadMore = () => {
    const nextPage = pageNo + 1;
    setPageNo(nextPage);
    fetchTrainingList(nextPage);
  };

  const onPullDownRefresh = () => {
    setPageNo(1);
    fetchTrainingList(1, true);
  };

  usePullDownRefresh(() => {
    onPullDownRefresh();
  });

  useEffect(() => {
    console.log('Updated Training List:', trainingList);
  }, [trainingList]);

  return (
    <View className="container">
      <View className="title-head">
        <View className="search-bar placeholder">
          <Input className="input placeholder" type="text" placeholder="搜索" />
          <View className="icon-box" style={{ marginRight: isAdmin ? '0px' : '20px' }}>
            <Image className="icon" mode="aspectFill" src="../../images/icon/search.png" />
          </View>
        </View>
        {isAdmin && (
          <View className="add" onClick={() => Taro.navigateTo({ url: '/pages/add_training/index' })}>
            <Image className="icon" mode="aspectFill" src="../../images/icon/add.png" />
          </View>
        )}
      </View>
      {trainingList.map((training, index) => (
        <View key={index} className="card" onClick={() => navigateToDetailTraining(training)}>
          <View className="item head">
            <View className="title">
              {training.Name}
            </View>
            <View className="placeholder"></View>
            {training.status === 'notStart' && <View className="tag not-start">未开始</View>}
            {training.status === 'processing' && <View className="tag processing">进行中</View>}
            {training.status === 'end' && <View className="tag end">已结束</View>}
          </View>
          <View className="date item weak">
            <Image className="icon" src="/images/icon/date.png" />
            <Text decode="true">{`${new Date(training.StartTime).toLocaleDateString()} ${new Date(training.StartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(training.EndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
          </View>
          <View className="desc item weak" style={{ alignItems: 'flex-start' }}>
            <Image style={{ marginTop: '5rpx' }} className="icon" src="/images/icon/desc.png" />
            <View style={{ width: 'calc(100% - 50rpx)' }}>{training.Description || '-'}</View>
          </View>
        </View>
      ))}
      {hasMore && (
        <View className="load-more">
          <Button onClick={loadMore}>加载更多</Button>
        </View>
      )}
    </View>
  );
}