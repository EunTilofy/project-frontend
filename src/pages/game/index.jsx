import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Game() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='game'>
      <Text>Hello world!</Text>
    </View>
  )
}
