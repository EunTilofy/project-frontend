import { View, Text, Image, Button, Input, Picker } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function UserDetail() {
  const userInfo = {
    avatar: '../../images/16.jpg',
    nickName: '昵称',
    gender: 0,
    phone: '1234567890',
    realName: '真实姓名',
    idNumber: '身份证号',
    level: 'A'
  };

  const genderOption = [
    { name: '男', value: 0 },
    { name: '女', value: 1 }
  ];

  useLoad(() => {
    console.log('Page loaded.')
  })

  const onChooseAvatar = (e) => {
    console.log('Choose Avatar', e)
  }

  const bindNicknameChange = (e) => {
    console.log('Nickname Change', e.target.value)
  }

  const bindGenderChange = (e) => {
    console.log('Gender Change', e.detail.value)
  }

  const bindPhoneChange = (e) => {
    console.log('Phone Change', e.target.value)
  }

  const bindRealNameChange = (e) => {
    console.log('Real Name Change', e.target.value)
  }

  const bindIdNumberChange = (e) => {
    console.log('ID Number Change', e.target.value)
  }

  const cancel = () => {
    console.log('Cancel')
  }

  const submit = () => {
    console.log('Submit')
  }

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
        <View className='input'>
          <Picker
            value={userInfo.gender}
            range={genderOption}
            rangeKey='name'
            onChange={bindGenderChange}
          >
            <View className='picker weak'>{genderOption[userInfo.gender].name}</View>
          </Picker>
        </View>
      </View>
      {userInfo.level === 'A' && (
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
          <View className='item'>
            <View className='title'>
              <View className='text'>真实姓名：</View>
            </View>
            <Input
              onInput={bindRealNameChange}
              value={userInfo.realName}
              className='input weak'
              type='text'
            />
          </View>
          <View className='item'>
            <View className='title'>
              <View className='text'>身份证号：</View>
            </View>
            <Input
              onInput={bindIdNumberChange}
              value={userInfo.idNumber}
              className='input weak'
              type='idcard'
            />
          </View>
          <View className='weak'>注：手机号、真实姓名、身份证号用于比赛信息快速录入</View>
        </>
      )}
      <View className='option'>
        <Button className='cancel' size='mini' onClick={cancel}>返回</Button>
        <Button className='apply' size='mini' onClick={submit}>修改</Button>
      </View>
    </View>
  )
}
