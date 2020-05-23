import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AutoClick from './src/autoClick';
import Dps from './src/dps';

class App extends Component{

  state = {
    autoClick: true,
    rebirthUpgrade: 0,
    ouro: 0,
    dano: 1,
    defaultUpgrade: 25,
    valUpgrade: 25,
    upgradeLevel: 1,
    defaultHp: 5,
    hpInimigo: 10,
    level: 1,
    qtdInimigos: 0,
    enableNextLvl: false,
    showNextLvl: true,
    dps: 0,
    autoDano: 0,
    defaultAutoUpgrade: 25,
    valAutoUpgrade: 10,
    autoUpgradeLevel: 1,
  }

  componentDidUpdate(){
    const { hpInimigo, qtdInimigos, enableNextLvl, level, showNextLvl } = this.state
    if(hpInimigo <= 0){
      this.inimigoMorreu()
    }
    if(qtdInimigos >= 10 && !enableNextLvl){
      this.setState({ enableNextLvl: true})
    }
    if(level === 100 && showNextLvl){
      this.setState({ showNextLvl: false})
    }
  }

  // useEffect(() => {
  //   let interval = null
  //   // if(autoClick){
  //   //   interval = setInterval(() => {
  //   //     console.log('auto', autoDano)
  //   //     hit(autoDano)
  //   //   }, 1000);
  //   //   return () => clearInterval(interval);
  //   // }else{
  //   //   if(interval){
  //   //     return () => clearInterval(interval);
  //   //   }
  //   // }
  // }, []);

  upgrade = () => {
    const { ouro, valUpgrade, upgradeLevel, defaultUpgrade, dano } = this.state
    if(ouro >= valUpgrade){
      this.setState({ 
        ouro: ouro - valUpgrade ,
        upgradeLevel: upgradeLevel + 1,
        defaultUpgrade: Number.isInteger(upgradeLevel/10) ? defaultUpgrade * 2 : defaultUpgrade,
        valUpgrade: valUpgrade+1+Number((defaultUpgrade/10).toFixed(0)),
        dano: dano+1,
      })
    }
  }

  autoUpgrade = () => {
    const { ouro, valAutoUpgrade, autoUpgradeLevel, defaultAutoUpgrade, autoDano} = this.state
    if(ouro >= valAutoUpgrade){
      this.setState({
        ouro: ouro - valAutoUpgrade,
        autoUpgradeLevel: autoUpgradeLevel + 1,
        defaultAutoUpgrade: Number.isInteger(autoUpgradeLevel/10) ? defaultAutoUpgrade*2 : defaultAutoUpgrade,
        valAutoUpgrade: valAutoUpgrade+1+Number((defaultAutoUpgrade/10).toFixed(0)),
        autoDano: autoDano + 1
      })
    }
  }

  recebeOuro = () => {
    const { level } = this.state
    let rand = Math.random().toFixed(2) * 2
    if(rand < 1) rand = 1
    return (rand * level).toFixed(0)
  }

  inimigoMorreu = () => {
    const { qtdInimigos, defaultHp, ouro } = this.state
    this.setState({
      qtdInimigos: qtdInimigos+1,
      hpInimigo: defaultHp,
      ouro: ouro + Number(this.recebeOuro())
    })
  }

  hit = (damage) => {
    const { hpInimigo, rebirthUpgrade, dps} = this.state
    this.setState({
      hpInimigo: hpInimigo - (damage + (damage * rebirthUpgrade)),
      dps: dps + (damage + (damage * rebirthUpgrade)),
    })
  }

  rebirth = () => {
    this.setState({
      dano: 1,
      rebirthUpgrade: rebirthUpgrade + 0.1,
      ouro: 0,
      defaultUpgrade: 25,
      valUpgrade: 25,
      upgradeLevel: 1,
      defaultHp: 5,
      hpInimigo: 10,
      level: 1,
      qtdInimigos: 0,
      enableNextLvl: false,
      showNextLvl: true,
    })
  }

  nextLevel = () => {
    const { defaultHp, level } = this.state
    let newHp
    if(Number.isInteger(level/10)){
      newHp = (defaultHp*2) + 5
    }else{
      newHp = defaultHp + 5
    }
    this.setState({
      qtdInimigos: 0,
      defaultHp: newHp,
      hpInimigo: newHp,
      enableNextLvl: false,
      level: level <= 99 ? level + 1 : level,
    })
  }

  render(){
    const styles = StyleSheet.create({
      container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      button: {
    
      },
    
    });
    const { 
      ouro, 
      upgradeLevel, 
      dano, 
      rebirthUpgrade, 
      autoUpgradeLevel, 
      autoDano, 
      hpInimigo,
      qtdInimigos,
      level,
      valUpgrade,
      valAutoUpgrade,
      enableNextLvl,
      showNextLvl,
      autoClick,
    } = this.state
    return (
      <View style={styles.container}>
        <Text>Ouro</Text>
        <Text>{ouro}</Text>
        <Text>Upgrade Dano</Text>
        <Text>{upgradeLevel}</Text>
        <Text>Dano</Text>
        <Text>{dano + (dano*rebirthUpgrade)}</Text>
        <Text>Upgrade autoClick</Text>
        <Text>{autoUpgradeLevel}</Text>
        <Text>AutoDamage</Text>
        <Text>{autoDano + (autoDano*rebirthUpgrade)}</Text>
        <Text>HP</Text>
        <Text>
          {hpInimigo < 0 ? '0' : (
            (hpInimigo > 100) ?
              hpInimigo.toFixed(0)
            :
              hpInimigo.toFixed(2)
          )}
        </Text>
        <Text>qtdInimigos</Text>
        <Text>{qtdInimigos}</Text>
        <Text>Level</Text>
        <Text>{level}</Text>
        <TouchableOpacity
          style={{
            display: 'flex',
            backgroundColor: 'red',
            padding: 40,
          }}
          onPress={() => {
            this.hit(dano)
          }} 
        >
          <Text style={{
            fontSize: 24,
            color: '#FFF',
            fontWeight: 'bold',
          }}>CLIQUE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: ouro < valUpgrade ? '#c5c5c5' : 'blue', 
            padding: 20}}
          onPress={() => {
            this.upgrade()
          }} 
        >
          <Text style={{color: '#FFF'}}>Comprar Upgrade ${valUpgrade}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: ouro < valAutoUpgrade ? '#c5c5c5' : 'orange', 
            padding: 20}}
          onPress={() => {
            this.autoUpgrade()
          }} 
        >
          <Text style={{color: '#FFF'}}>Comprar Upgrade autoClick ${valAutoUpgrade}</Text>
        </TouchableOpacity>
        {enableNextLvl && showNextLvl &&
          <TouchableOpacity
            style={{backgroundColor: 'green', padding: 20}}
            onPress={() => {
              this.nextLevel()
            }}
          >
            <Text>
              Next LVL
            </Text>
          </TouchableOpacity>
        }
        {level === 100 &&
          <TouchableOpacity
            style={{backgroundColor: 'black', padding: 20}}
            onPress={() => {
              this.rebirth()
            }}
          >
            <Text style={{color: '#FFF'}}>
              REBIRTH
            </Text>
          </TouchableOpacity>
        }
        <AutoClick 
          hit={this.hit}
          dano={autoDano}
        />
      </View>
    );
  }
}

export default App