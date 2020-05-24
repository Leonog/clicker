import React, { Component } from 'react'

import { Text, TouchableOpacity } from 'react-native'

class AutoClick extends Component {
  state = {
    timer: null,
    autoClick: true,
  };

  componentDidMount() {
    let timer = setInterval(this.hit, 200);
    this.setState({ timer });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({timer: null})
  }

  hit = () => {
    this.props.hit(this.props.dano*0.2)
    console.log('HIT', this.props.dano)
  }

  enableAutoClick = () => {
    this.setState({ autoClick: true })
    let timer = setInterval(this.hit, 200);
    this.setState({ timer });
  }

  disableAutoClick = () => {
    this.setState({ autoClick: false })
    clearInterval(this.state.timer);
    this.setState({timer: null})
  }

  render() {
    const { autoClick } = this.state
    return(
      <TouchableOpacity
        style={{ backgroundColor: !autoClick ? '#c00' : 'green', 
          padding: 4,
          alignSelf: 'flex-end', 
          borderRadius: 20, 
          height: 40, 
          width: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          if(autoClick)
            this.disableAutoClick()
          else 
            this.enableAutoClick()
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>AUTO</Text>
      </TouchableOpacity>
    )
  }
}

export default AutoClick