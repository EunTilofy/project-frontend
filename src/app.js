import { useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import './app.scss'

function App({ children }) {

  useLaunch(() => {
    console.log('App launched.')

    // login
    Taro.login({
      success(res) {
        console.log('wx.login');
        if(res.code) {
          // set request
          console.log(res.code);
          Taro.request({
            url: 'https://9bh279vn9856.vicp.fun/api/user/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success(response) {
              if(response.data.code === 0)
              {
                console.log('begin check user', response.data);
                Taro.setStorageSync('token', 'Bearer '+ response.data.result.token);
                // check user
                Taro.request({
                  url: 'https://9bh279vn9856.vicp.fun/api/user/checkRole',
                  method: 'POST',
                  header: {
                    Authorization: 'Bearer '+ response.data.result.token
                  },

                  success(_) {
                    console.log('check user role success', _.data);
                    Taro.setStorageSync('userRole: ', _.data.code);
                  },
                  fail(err) { console.log('check user role failure', err); }
                });
              } else 
              {
                console.log('response failure', response.data);
              }
            },
            fail(error) { console.log('request failure', error); }
          });
        } else {
          console.log('login failure!' + res.errMsg);
        }
      }, fail(err) {
        console.log('wx.login failure', err);
      }
    });
  });

  return children
}

export default App