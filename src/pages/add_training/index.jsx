import { View, Text, Image, Picker, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import Taro from '@tarojs/taro';

export default function AddTraining() {
  const [surfacePlot, setSurfacePlot] = useState('../../images/login-bg.png');
  const [name, setName] = useState('新的训练');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  // const [locationIndex, setLocationIndex] = useState(0);
  // const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  // const [openIndex, setOpenIndex] = useState(0);
  // const [openOption, setOpenOption] = useState([
    // { name: '是' },
    // { name: '否' }
  // ]);

  useLoad(() => {
    console.log('Page loaded.')
  });

  const bindNameChange = e => {
    console.log('Name change', e.detail.value);
    setName(e.detail.value);
  };

  const bindDateChange = e => {
    console.log('Date change', e.detail.value);
    setDate(e.detail.value);
  };

  const bindStartTimeChange = e => {
    console.log('Start time change', e.detail.value);
    setStartTime(e.detail.value);
  };

  const bindEndTimeChange = e => {
    console.log('End time change', e.detail.value);
    setEndTime(e.detail.value);
  };

  const bindDescriptionChange = e => {
    console.log('Description change', e.target.value);
    setDescription(e.target.value);
  };

  const navigateBack = () => {
    console.log('Navigate back');
  };

  const submit = () => {
    // 合并日期和时间
    const startDateTime = new Date(`${date}T${startTime}:00Z`).toISOString();
    const endDateTime = new Date(`${date}T${endTime}:00Z`).toISOString();

    const requestData = {
      name: name,
      description: description,
      start_time: startDateTime,
      end_time: endDateTime
    };

    const token = Taro.getStorageSync('token');

    console.log('Request Data:', requestData, 'token: ', token);

    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/training/create',
      method: 'POST',
      data: requestData,
      header: {
        Authorization: token,
      },
      success(response) {
        console.log('Request Success', response.data);
      },
      fail(error) {
        console.log('Request Failure', error);
      }
    });
  };

  return (
    <View className='container'>
      <Image
        className='surface-plot'
        mode='widthFix'
        src={surfacePlot}
      />
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/desc.png' />
          <View className='text'>训练名称：</View>
        </View>
        <Input
          onInput={bindNameChange}
          className='input weak'
          type='text'
          value={name}
        />
      </View>
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/date.png' />
          <View className='text'>训练日期：</View>
        </View>
        <View className='input'>
          <Picker mode='date' value={date} onChange={bindDateChange}>
            <View className='picker weak'>{date ? date : ''}</View>
          </Picker>
        </View>
      </View>
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/time.png' />
          <View className='text'>开始时间：</View>
        </View>
        <View className='input'>
          <Picker mode='time' value={startTime} onChange={bindStartTimeChange}>
            <View className='picker weak'>{startTime ? startTime : ''}</View>
          </Picker>
        </View>
      </View>
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/time.png' />
          <View className='text'>结束时间：</View>
        </View>
        <View className='input'>
          <Picker mode='time' value={endTime} onChange={bindEndTimeChange}>
            <View className='picker weak'>{endTime ? endTime : ''}</View>
          </Picker>
        </View>
      </View>
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/desc.png' />
          <View className='text'>训练简介：</View>
        </View>
        <Input
          onInput={bindDescriptionChange}
          className='input weak'
          type='text'
          value={description}
        />
      </View>
      <View className='option'>
        <Button className='cancel' size='mini' onClick={navigateBack}>取消</Button>
        <Button className='apply' size='mini' onClick={submit}>创建</Button>
      </View>
    </View>
  );
}