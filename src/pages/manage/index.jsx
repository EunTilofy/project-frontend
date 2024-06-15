import { View, Text, Image, Button, Picker } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import './index.scss'

export default function Manage() {

  const [isAdmin, setisAdmin] = useState(false);
  const [applylist, setapplylist] = useState([]);
  const [userlist, setuserlist] = useState([
    // {nickname: 'User3', gender: 1, role: 'admin', userID: 'xxx'}
  ]);

  const getapply = () => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/team/getApplyList',
      method : 'POST',
      header: { Authorization : token, },
      success(res) { console.log('apply list : ', res.data.result); 
      if (res.data.result)
      setapplylist(res.data.result.filter(apply => apply.Status === 'pending')); 
      else setapplylist([]);
    }
    });
  };

  const getmember = () => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/team/getMemberList',
      method : 'POST',
      header: { Authorization : token, },
      success(res) { console.log('member list : ', res.data); 
      if (res.data.result)
      setuserlist(res.data.result.filter(user => user.role !== 'user')); 
      else setuserlist([]);
    }, fail(err) { setuserlist([]); }
    });
  };

  const approveMembershipApply = (e) => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/team/approve',
      method: 'POST',
      header: { Authorization : token, },
      data: {apply_id : e},
      success(res) {
        if(res.data.code === 0) {
          Taro.showToast({
            title: '已同意',
            icon: 'success', 
            duration: 1000
          });
          getapply();
        } else {
          console.log(res.data);
          Taro.showToast({
            title: '操作失败',
            icon: 'none', 
            duration: 1000
          });
        }
      }, fail(err) {
        console.log(err);
        Taro.showToast({
          title: '操作失败',
          icon: 'none', 
          duration: 1000
        });
      }
    });
  }

  const disapproveMembershipApply = (e) => {
    const token = Taro.getStorageSync('token');
    Taro.request({
      url: 'https://9bh279vn9856.vicp.fun/api/team/reject',
      method: 'POST',
      header: { Authorization : token, },
      data: {apply_id : e},
      success(res) {
        if(res.data.code === 0) {
          Taro.showToast({
            title: '已拒绝',
            icon: 'success', 
            duration: 1000
          });
          getapply();
        } else {
          console.log(res.data);
          Taro.showToast({
            title: '操作失败',
            icon: 'none', 
            duration: 1000
          });
        }
      }, fail(err) {
        console.log(err);
        Taro.showToast({
          title: '操作失败',
          icon: 'none', 
          duration: 1000
        });
      }
    });
  }

  useEffect(() => {
    const userR = (Taro.getStorageSync('userRole') === 0);
    console.log(userR);
    if (userR) {
      setisAdmin(userR);
    }
    // const token = Taro.getStorageSync('token');
    // Taro.request({
    //   url: 'https://9bh279vn9856.vicp.fun/api/user/checkRole',
    //   method: 'POST',
    //   header: {
    //     Authorization: token,
    //   },

    //   success(_) {
    //     console.log('check user role success', _.data);
    //     // Taro.setStorageSync('userRole', _.data.code);
    //     setisAdmin(_.data.result.role === 'admin');
    //   },
    //   fail(err) { console.log('check user role failure', err); }
    // });
  }, []);

  useLoad(() => {
    console.log('Page loaded.');

    getapply(); 
    getmember();
  })

  const removemember = (userId) => {
    const token = Taro.getStorageSync('token');
    console.log(userId);
    Taro.showModal({
      title: '确认操作',
      content: '您确定要移除这名成员吗？',
      success: function (res) {
        if (res.confirm) {
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/team/kickOut',
            method: 'POST',
            header: { Authorization : token, },
            data: { user_id : userId },
            success: (response) => {
              console.log('remove member res: ', response);
              if (response.data.code === 0) {
                Taro.showToast({
                  title: '成员已移除',
                  icon: 'success',
                  duration: 2000
                });
                getmember();
              } else {
                Taro.showToast({
                  title: '操作失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: () => {
              Taro.showToast({
                title: '请求失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  }

  const setasadmin = (userId) => {
    const token = Taro.getStorageSync('token');
    Taro.showModal({
      title: '确认操作',
      content: '您确定要设置这名成员为管理员吗？',
      success: function (res) {
        if (res.confirm) {
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/team/grant',
            method: 'POST',
            data: { user_id : userId, role : 'admin' },
            header: { Authorization : token, },
            success: (response) => {
              console.log('set admin', response);
              if (response.data.code === 0) {
                Taro.showToast({
                  title: '已设为管理员',
                  icon: 'success',
                  duration: 2000
                });
                getmember();
              } else {
                Taro.showToast({
                  title: '操作失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            },
            fail: () => {
              Taro.showToast({
                title: '请求失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
  }

  return (
    <View>
    { isAdmin === true && (
    <View className='container'>
      <View className='item'>
        <View className='title'>
          <View className='text'>入队申请</View>
        </View>
        {applylist.map((apply, index) => (
          <View className='card' key={index}>
            <View className='apply-content weak'>
              <View className='name'>{apply.User.nickname}</View>
              {apply.User.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {apply.User.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View className='placeholder'></View>
              <View className='time'>{apply.time}</View>
              <Button className='cancel' size='mini' data-index={index} data-approve={-1} onClick={()=>disapproveMembershipApply(apply.ID)}>拒绝</Button>
              <Button className='apply' size='mini' data-index={index} data-approve={1} onClick={()=>approveMembershipApply(apply.ID)}>同意</Button>
            </View>
          </View>
        ))}
        {applylist.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
      
      <View className='item'>
        <View className='title'>
          <View className='text'>队员名单</View>
          {/* <Picker style={{ transform: 'translateY(6rpx)' }} value={sortModeIndex} range={sortModeOption} rangeKey='name' onChange={bindSortModeChange}> */}
            <Image style={{ marginLeft: '10rpx' }} className='icon' src='../../images/icon/sort-one.png' />
          {/* </Picker> */}
        </View>
        {userlist.map((user, index) => (
          <View className='card' key={index}>
            <View className='user-content weak'>
              {user.gender === 0 && <Image className='gender' src='../../images/icon/male.png' />}
              {user.gender === 1 && <Image className='gender' src='../../images/icon/female.png' />}
              <View style={{ width: '360rpx' }} className='name ellipsis'>{user.nickname}</View>
              {/* <View className='placeholder'></View> */}
              {/* {user.no >= 0 && <View className='tag'>{user.no}</View>} */}
              {user.role === 'admin' && <View className='tag'>管理员</View>}
              {user.role === 'member' && <View className='tag'>正式队员</View>}
              <View className="button-group" style={{ marginLeft: '30rpx', display: 'flex', alignItems: 'right', width: '30vw', justifyContent: 'flex-end' }}>
                  <Button
                    className="admin-button"
                    style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}
                    onClick={() => removemember(user.id)}
                    >移除</Button>
                    <Button className="admin-button"
                            style={{ backgroundColor: 'red', color: 'white' }}
                            onClick={() => setasadmin(user.id)}
                    >设为管理</Button>
            </View>
            </View>
          </View>
        ))}
        {userlist.length <= 0 && (
          <View className='card' style={{ paddingLeft: '20rpx' }}>
            <View className='apply-content weak'>暂无</View>
          </View>
        )}
      </View>
    </View>)}
    </View>
  )
}
