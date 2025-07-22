import { View, Text, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import Modal from 'react-native-modal';

const Test = () => {
    const [isSideMenuOpen, setMenu] = useState(false);


  return (
    <View>
        <TouchableOpacity onPress={() => setMenu(true)}>
      <Text>Test</Text>
    </TouchableOpacity>

    <Modal  
        isVisible={isSideMenuOpen}
        animationIn="slideInUp"
        animationOut="slideOutDown"
    >
        <TouchableOpacity onPress={() => setMenu(false)} className='bg-white p-4'>
            <Text >Test</Text>
        </TouchableOpacity>
    </Modal>
    </View>
    
  )
}

export default Test