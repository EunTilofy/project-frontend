import { View, Text, Image, Button, Picker } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Manage() {

  const membershipApplication = [
    {
      userInfo: {
        nickName: 'User1',
        gender: 0
      },
      time: '2024-06-01'
    },
  ];

  const followshipApplication = [
    {
      userInfo: {
        nickName: 'User2',
        gender: 1
      },
      time: '2024-06-02'
    },
  ];

  const userList = [
    {
      nickName: 'User3',
      realName: 'RealUser3',
      gender: 0,
      no: 1,
      level: 'A'
    },
  ];

  const sortModeOption = [{ name: 'Sort1' }, { name: 'Sort2' }];
  const sortModeIndex = 0;

  const approveMembershipApply = (e) => {
    console.log(`Membership apply index: ${e.currentTarget.dataset.index}, approve: ${e.currentTarget.dataset.approve}`);
  }

  const approveFollowshipApply = (e) => {
    console.log(`Followship apply index: ${e.currentTarget.dataset.index}, approve: ${e.currentTarget.dataset.approve}`);
  }

  const bindSortModeChange = (e) => {
    console.log(`Sort mode index: ${e.detail.value}`);
  }

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='container'>
      <View className='item'>
        <View className='title'>
          <View className='text'>入队申请</View>
        </View>
        {membershipApplication.map((apply, index) => (
          <View className='card' key={index}>
            <View className='apply-content weak'>
              <View className='name'>{apply.userInfo.nickName}</View>
              {apply.userInfo.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {apply.userInfo.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View className='placeholder'></View>
              <View className='time'>{apply.time}</View>
              <Button className='cancel' size='mini' data-index={index} data-approve={-1} onClick={approveMembershipApply}>拒绝</Button>
              <Button className='apply' size='mini' data-index={index} data-approve={1} onClick={approveMembershipApply}>同意</Button>
            </View>
          </View>
        ))}
        {membershipApplication.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
      <View className='item'>
        <View className='title'>
          <View className='text'>跟训申请</View>
        </View>
        {followshipApplication.map((apply, index) => (
          <View className='card' key={index}>
            <View className='apply-content weak'>
              <View className='name'>{apply.userInfo.nickName}</View>
              {apply.userInfo.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {apply.userInfo.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View className='placeholder'></View>
              <View className='time'>{apply.time}</View>
              <Button className='cancel' size='mini' data-index={index} data-approve={-1} onClick={approveFollowshipApply}>拒绝</Button>
              <Button className='apply' size='mini' data-index={index} data-approve={1} onClick={approveFollowshipApply}>同意</Button>
            </View>
          </View>
        ))}
        {followshipApplication.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
      <View className='item'>
        <View className='title'>
          <View className='text'>队员名单</View>
          <Picker style={{ transform: 'translateY(6rpx)' }} value={sortModeIndex} range={sortModeOption} rangeKey='name' onChange={bindSortModeChange}>
            <Image style={{ marginLeft: '10rpx' }} className='icon' src='../../images/icon/sort-one.png' />
          </Picker>
        </View>
        {userList.map((user, index) => (
          <View className='card' key={index}>
            <View className='user-content weak'>
              {user.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {user.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View style={{ width: '360rpx' }} className='name ellipsis'>{user.nickName} {user.realName ? `(${user.realName})` : ''}</View>
              <View className='placeholder'></View>
              {user.no >= 0 && <View className='tag'>{user.no}</View>}
              {user.level === 'A' && <View className='tag'>正式队员</View>}
              {user.level === 'B' && <View className='tag'>跟训队员</View>}
            </View>
          </View>
        ))}
        {userList.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
    </View>
  )
}
