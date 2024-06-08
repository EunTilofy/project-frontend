import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function AddTraining() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='add_training'>
      <Text>Hello world!</Text>
    </View>
  )
}
