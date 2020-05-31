import React, { Component } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import SpriteSheet from 'rn-sprite-sheet';

class Char extends Component {

  constructor(props){
    super(props)
    this.char = null
  }
  state = {
    animate: require('./assets/spritesheet.png'),
    enemy: '',
    timer: null,
    isAttacking: false,
  }


  componentDidMount() {
    // let timer = setInterval(this.idle, 1000);
    // this.setState({ timer });
    this.idle()
  }

  componentWillUnmount() {
    // clearInterval(this.state.timer);
    // this.setState({timer: null})
  }

  idle = () => {
    this.char.play({
      type: "idle",
      fps: 10,
      loop: true,
      resetAfterFinish: true,
      onFinish: () => { },
    })
  }

  attack = () => {
    const { isAttacking } = this.state
    if(!isAttacking){
      this.setState({ isAttacking: true}, () => {
        this.char.play({
          type: "attack",
          fps: 40,
          loop: false,
          resetAfterFinish: false,
          onFinish: () => {
            this.idle()
            this.setState({ isAttacking: false})
          },
        })
      })
    }
  }

  render() {
    const { animate } = this.state
    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          padding: 40,
          height: '80%',
          width: '100%',
          top: 0,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          this.props.hit(this.props.dano, this.props.rebirthUpgrade)
          this.props.setClickTotal()
          this.attack()
        }}
        activeOpacity={1}
      >
        <View style={{ display: 'flex', marginTop: 50, marginRight: 190 }}>
          <SpriteSheet
            ref={ref => (this.char = ref)}
            source={animate}
            height={200}
            columns={5}
            rows={4}
            imageStyle={{ marginTop: 0 }}
            animations={{
              attack: [0, 1, 2, 3, 5, 6, 7, 8, 10, 11],
              idle: [4, 9, 12, 13, 14, 15, 16, 17, 18, 19]
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

export default Char