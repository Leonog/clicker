import React, { Component } from 'react';
import GamePlay from './gamePlay';
import { View, TouchableOpacity, Text, Animated, AsyncStorage } from 'react-native'
import { Easing } from 'react-native-reanimated';

class Menu extends Component {
  state = {
    play: false,
    language: false,
    fade: new Animated.Value(0),
    yLogo: new Animated.Value(-200),
  }

  goBackToMenu = () => {
    this.setState({ play: false})
  }

  fadeButtons = () => {
    Animated.timing(this.state.fade, {
      toValue: 1,
      duration: 1300,
    }).start();
  }


  moveLogo = () => {
    Animated.timing(this.state.yLogo, {
      toValue: 150,
      duration: 600,
      asing: Easing.linear
    }).start(() => {
      Animated.timing(this.state.yLogo, {
        toValue: 30,
        duration: 200,
        asing: Easing.linear
      }).start(() => {
        Animated.timing(this.state.yLogo, {
          toValue: 130,
          duration: 200,
          asing: Easing.linear
        }).start(() => {
          Animated.timing(this.state.yLogo, {
            toValue: 50,
            duration: 200,
            asing: Easing.linear
          }).start(() => {
            Animated.timing(this.state.yLogo, {
              toValue: 100,
              duration: 100,
              asing: Easing.linear
            }).start(() => {
              
            })
          })
        })
      })
    });
  }

  componentDidMount(){
    AsyncStorage.getItem('language').then(res => {
      const storage = JSON.parse(res)
      const { language } = storage
      this.setState({language})
    })
    .catch(err => {
      console.log('nothing in storage')
    })
    this.fadeButtons()
    this.moveLogo()
  }

  render() {
    const { language, play } = this.state
    return (
      <>
      {!play ?
        <View style={{
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
          <Animated.View style={{
            opacity: this.state.fade, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            alignSelf: 'flex-end',
            marginRight: 25,
            marginTop: 20,}}>
            <TouchableOpacity 
              onPress={() => this.setState({ language: !language }, () => {
                AsyncStorage.setItem('language', JSON.stringify({language: this.state.language}))
              })}
            >
              <Text style={{ fontSize: 20, fontWeight: 'normal'}}>{language ? 'BR' : 'EN'}</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ top: this.state.yLogo}}>
            <Text style={{fontSize: 46, fontWeight: 'bold' }}>LOGO</Text>
          </Animated.View>
          <Animated.View style={{
            opacity: this.state.fade, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 270}}>
            <TouchableOpacity
              style={{ position: 'relative', backgroundColor: '#4a5b64', elevation: 5, borderRadius: 50, padding: 40, paddingLeft: 100, paddingRight: 100, justifyContent: "center", alignItems: 'center'}}
              onPress={() => this.setState({ play: true})}
            >
              <View style={{position: 'absolute', backgroundColor: '#e5e5e5', padding: 38, paddingLeft: 98, paddingRight: 98, borderRadius: 50}} />
              <View style={{position: 'absolute', backgroundColor: '#4a5b64', padding: 34, paddingLeft: 94, paddingRight: 94, borderRadius: 50}} />
              <View style={{position: 'absolute', backgroundColor: '#ffbf00', padding: 32, paddingLeft: 92, paddingRight: 92, borderRadius: 50}} />
              <Text
                style={{position: 'absolute', color: '#FFF', fontWeight: 'bold', fontSize: 26 }}
              >{language ? 'Jogar' : 'Play'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      :
        <GamePlay goBackToMenu={this.goBackToMenu} language={language} />
      }
      </>
    )
  }
}

export default Menu