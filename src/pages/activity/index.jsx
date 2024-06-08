import { View, Text, Image } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';

export default function Activity() {
  const [activeButton, setActiveButton] = useState('我的活动'); // 初始化状态

  useLoad(() => {
    console.log('Page loaded.');
  });

  const handleTabClick = (tab) => {
    switch(tab) {
      case 'activity':
        Taro.switchTab({ url: '/pages/activity/index' });
        break;
      case 'event':
        Taro.switchTab({ url: '/pages/game/index' });
        break;
      case 'club':
        Taro.switchTab({ url: '/pages/club/index' });
        break;
      case 'profile':
        Taro.switchTab({ url: '/pages/center/index' });
        break;
      default:
        break;
    }
  };

  return (
    <View className='activity'>
      <View className='search-container'>
        <Image 
          className='search-image'
          src='../../images/activity-bg.png'  // 确保路径正确
        />
        <View className='search-bar'>
          <Text className='search-text'>搜索</Text>
        </View>
      </View>

      <View className='buttons-container'>
        <View 
          className={`button ${activeButton === '我的活动' ? 'active' : ''}`} 
          onClick={() => setActiveButton('我的活动')}
        >
          我的活动
        </View>
        <View 
          className={`button ${activeButton === '附近活动' ? 'active' : ''}`} 
          onClick={() => setActiveButton('附近活动')}
        >
          附近活动
        </View>
      </View>

      <View className='content-container'>
        <Text className='empty-text'>Empty</Text>
      </View>
    </View>
  );
}
