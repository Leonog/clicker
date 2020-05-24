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
        style={{ backgroundColor: !autoClick ? 'red' : 'green', padding: 4 }}
        onPress={() => {
          if(autoClick)
            this.disableAutoClick()
          else 
            this.enableAutoClick()
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{!autoClick ? 'Desativado' : 'Ativado'}</Text>
      </TouchableOpacity>
    )
  }
}

export default AutoClick