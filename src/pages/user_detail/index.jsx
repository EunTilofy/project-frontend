import { useState } from 'react';
import { View, Text, Image, Button, Input, Picker } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';

export default function UserDetail() {
  const [userInfo, setUserInfo] = useState({
    avatar: '../../images/grey.png',
    nickName: '',
    gender: 2,
    phone: '',
    email: ''
  });

  const genderOption = [
    { name: '男', value: 0 },
    { name: '女', value: 1 },
    { name: '未知', value: 2},
  ];

  useLoad(() => {
    console.log('Page loaded.');
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
          email: response.data.result.email
        });
      },
      fail(err){console.log('Fail to get info', err);}
    });
  });

  const onChooseAvatar = (e) => {
    console.log("avatar: ", e);
    setUserInfo({ ...userInfo, avatar : e.detail.avatarUrl });
  };

  const bindNicknameChange = e => {
    setUserInfo({ ...userInfo, nickName: e.target.value });
  };

  const bindGenderChange = e => {
    setUserInfo({ ...userInfo, gender: parseInt(e.detail.value, 10) });
  };

  const bindPhoneChange = e => {
    setUserInfo({ ...userInfo, phone: e.target.value });
  };

  // const bindRealNameChange = e => {
  //   setUserInfo({ ...userInfo, realName: e.target.value });
  // };

  const bindEmailChange = e => {
    setUserInfo({ ...userInfo, email: e.target.value });
  };

  // const cancel = () => {
  //   console.log('Cancel');
  // };

  const submit = () => {
    console.log('Submit');
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/user/updateInfo',
      method: 'POST',
      header: { Authorization : token, },
      data: { 
        nickname: userInfo.nickName,
        avatar: userInfo.avatar,
        phone_number: userInfo.phone,
        Email: userInfo.email,
        Gender: userInfo.gender
       },
      success(response){
        if(response.data.code === 0) {
        Taro.showToast({
          title: '修改资料成功',
          icon: 'success',
          duration: 2000,
        });}
        // console.log('update info ok', response.data);
        else {
          Taro.showToast({
            title: '修改失败',
            icon: 'success',
            duration: 2000,
          });
        }
        },
      fail(err){console.log('Fail to update info', err);Taro.showToast({
        title: '修改个人资料失败，请稍后再试',
        icon: 'success',
        duration: 2000,
      });}
    });
  };

  return (
    <View className='container'>
      <Button className='avatar' openType='chooseAvatar' onChooseAvatar={onChooseAvatar}>
        <Image mode='aspectFit' src={userInfo.avatar} />
      </Button>
      <View className='item'>
        <View className='title'>
          <View className='text'><Text style={{ color: '#F53F3F' }}>*</Text>昵称：</View>
        </View>
        <Input
          onInput={bindNicknameChange}
          value={userInfo.nickName}
          className='input weak'
          type='text'
        />
      </View>
      <View className='item'>
        <View className='title'>
          <View className='text'><Text style={{ color: '#F53F3F' }}>*</Text>性别：</View>
        </View>
        <Picker
          value={userInfo.gender}
          range={genderOption}
          rangeKey='name'
          onChange={bindGenderChange}
        >
          <View className='picker'>{genderOption[userInfo.gender].name}</View>
        </Picker>
      </View>
        <>
          <View className='item'>
            <View className='title phone'>
              <View className='text'>手机号：</View>
            </View>
            <Input
              onInput={bindPhoneChange}
              value={userInfo.phone}
              className='input weak'
              type='number'
            />
          </View>
          {/* <View className='item'>
            <View className='title'>
              <View className='text'>真实姓名：</View>
            </View>
            <Input
              onInput={bindRealNameChange}
              value={userInfo.realName}
              className='input weak'
              type='text'
            />
          </View> */}
          <View className='item'>
            <View className='title'>
              <View className='text'>邮箱：</View>
            </View>
            <Input
              onInput={bindEmailChange}
              value={userInfo.email}
              className='input weak'
              type='idcard'
            />
          </View>
        </>
      <View className='option'>
        {/* <Button className='cancel' size='mini' onClick={cancel}>返回</Button> */}
        <Button className='apply' size='mini' onClick={submit}>修改</Button>
      </View>
    </View>
  );
}