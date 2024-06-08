import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Center() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='center'>
      <Text>Hello world!</Text>
    </View>
  )
}
