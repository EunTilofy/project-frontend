import { View, Text, Image, Picker, Input, Button } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function AddTraining() {
  const [surfacePlot, setSurfacePlot] = useState('../../images/login-bg.png');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationOption, setLocationOption] = useState([
    { name: 'Location 1' },
    { name: 'Location 2' }
  ]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [openIndex, setOpenIndex] = useState(0);
  const [openOption, setOpenOption] = useState([
    { name: '是' },
    { name: '否' }
  ]);

  useLoad(() => {
    console.log('Page loaded.')
  });

  const bindSurfacePlotChange = () => {
    console.log('Surface plot change');
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

  const bindLocationChange = e => {
    console.log('Location change', e.detail.value);
    setLocationIndex(e.detail.value);
  };

  const bindPriceChange = e => {
    console.log('Price change', e.target.value);
    setPrice(e.target.value);
  };

  const bindDescriptionChange = e => {
    console.log('Description change', e.target.value);
    setDescription(e.target.value);
  };

  const bindOpenChange = e => {
    console.log('Open change', e.detail.value);
    setOpenIndex(e.detail.value);
  };

  const navigateBack = () => {
    console.log('Navigate back');
  };

  const submit = () => {
    console.log('Submit');
  };

  return (
    <View className='container'>
      <Image
        className='surface-plot'
        mode='widthFix'
        onClick={bindSurfacePlotChange}
        src={surfacePlot}
      />
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
          <Image className='icon' src='../../images/icon/location.png' />
          <View className='text'>训练地址：</View>
        </View>
        <View className='input'>
          <Picker value={locationIndex} range={locationOption} rangeKey='name' onChange={bindLocationChange}>
            <View className='picker weak'>{locationOption[locationIndex].name}</View>
          </Picker>
        </View>
      </View>
      <View className='item'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/fee.png' />
          <View className='text'>训练费用：</View>
        </View>
        <Input
          onInput={bindPriceChange}
          className='input weak'
          type='digit'
          value={price}
        />
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
      <View className='item last'>
        <View className='title'>
          <Image className='icon' src='../../images/icon/location.png' />
          <View className='text'>是否开放：</View>
        </View>
        <View className='input'>
          <Picker value={openIndex} range={openOption} rangeKey='name' onChange={bindOpenChange}>
            <View className='picker weak'>{openOption[openIndex].name}</View>
          </Picker>
        </View>
      </View>
      <View className='option'>
        <Button className='cancel' size='mini' onClick={navigateBack}>取消</Button>
        <Button className='apply' size='mini' onClick={submit}>创建</Button>
      </View>
    </View>
  )
}
