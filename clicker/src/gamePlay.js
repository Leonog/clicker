import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, AsyncStorage, TouchableWithoutFeedback } from 'react-native';
import AutoClick from './autoClick';
import Char from './char'

class GamePlay extends Component {

  state = {
    rebirthUpgrade: 0,
    rebirthLevel: 0,
    ouro: 0,
    dano: 1,
    defaultUpgrade: 25,
    valUpgrade: 25,
    upgradeLevel: 1,
    defaultHp: 5,
    hpInimigo: 5,
    level: 1,
    qtdInimigos: 0,
    enableNextLvl: false,
    showNextLvl: true,
    dps: [],
    autoDano: 0,
    defaultAutoUpgrade: 10,
    valAutoUpgrade: 10,
    autoUpgradeLevel: 0,
    timer: null,
    danoDps: 0,
    showUpgrades: false,
    showMenu: false,
    attacking: false,
  }

  setAttacking = (attack) => {
    this.setState({ attacking: attack})
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({ timer: null })
    AsyncStorage.setItem('gameState', JSON.stringify(this.state))
  }

  componentDidMount() {
    let timer = setInterval(this.calcDps, 1000);
    this.setState({ timer });
    AsyncStorage.getItem('gameState').then(storage => {
      console.log('storage', JSON.parse(storage), 'state', this.state)
      this.setState(JSON.parse(storage), () => {
        this.setState({hpInimigo: this.state.defaultHp})
      })
      console.log('state', this.state)
    })
    .catch(err => {
      console.log('error:', err)
    })

  }

  calcDps = () => {
    const { dps } = this.state
    let dano = 0
    dps.map((d, i) => {
      dano = dano + d
    })
    this.setState({ danoDps: dano, dps: [] })
  }

  componentDidUpdate() {
    const { hpInimigo, qtdInimigos, enableNextLvl, level, showNextLvl } = this.state
    if (hpInimigo <= 0) {
      this.inimigoMorreu()
    }
    if (qtdInimigos >= 10 && !enableNextLvl) {
      this.setState({ enableNextLvl: true })
    }
    if (level === 100 && showNextLvl) {
      this.setState({ showNextLvl: false })
    }
  }

  upgrade = () => {
    const { ouro, valUpgrade, upgradeLevel, defaultUpgrade, dano } = this.state
    if (ouro >= valUpgrade) {
      this.setState({
        ouro: ouro - valUpgrade,
        upgradeLevel: upgradeLevel + 1,
        defaultUpgrade: Number.isInteger(upgradeLevel / 10) ? defaultUpgrade * 2 : defaultUpgrade,
        valUpgrade: valUpgrade + 1 + Number((defaultUpgrade / 10).toFixed(0)),
        dano: dano + 1,
      })
    }
  }

  autoUpgrade = () => {
    const { ouro, valAutoUpgrade, autoUpgradeLevel, defaultAutoUpgrade, autoDano } = this.state
    if (ouro >= valAutoUpgrade) {
      this.setState({
        ouro: ouro - valAutoUpgrade,
        autoUpgradeLevel: autoUpgradeLevel + 1,
        defaultAutoUpgrade: Number.isInteger(autoUpgradeLevel / 10) ? defaultAutoUpgrade * 2 : defaultAutoUpgrade,
        valAutoUpgrade: valAutoUpgrade + 1 + Number((defaultAutoUpgrade / 10).toFixed(0)),
        autoDano: autoDano + 1
      })
    }
  }

  recebeOuro = () => {
    const { level } = this.state
    let rand = Math.random().toFixed(2) * 2
    if (rand < 1) rand = 1
    return (rand * level).toFixed(0)
  }

  inimigoMorreu = () => {
    const { qtdInimigos, defaultHp, ouro } = this.state
    this.setState({
      qtdInimigos: qtdInimigos + 1,
      hpInimigo: defaultHp,
      ouro: ouro + Number(this.recebeOuro())
    }, () => {
      AsyncStorage.setItem('gameState', JSON.stringify(this.state))
    })
  }

  hit = (damage) => {
    const { hpInimigo, rebirthUpgrade, dps } = this.state
    let dano = damage + (damage * rebirthUpgrade)
    dps.push(dano)
    this.setState({
      hpInimigo: hpInimigo - dano,
      dps,
    })
  }

  rebirth = () => {
    const { rebirthUpgrade, rebirthLevel } = this.state
    this.setState({
      rebirthUpgrade: rebirthUpgrade + 0.1,
      rebirthLevel: rebirthLevel + 1,
      ouro: 0,
      dano: 1,
      defaultUpgrade: 25,
      valUpgrade: 25,
      upgradeLevel: 1,
      defaultHp: 5,
      hpInimigo: 5,
      level: 1,
      qtdInimigos: 0,
      enableNextLvl: false,
      showNextLvl: true,
      dps: [],
      autoDano: 0,
      defaultAutoUpgrade: 10,
      valAutoUpgrade: 10,
      autoUpgradeLevel: 0,
      timer: null,
      danoDps: 0,
      showUpgrades: false,
      showMenu: false,
      attacking: false,
    })
  }

  nextLevel = () => {
    const { defaultHp, level } = this.state
    let newHp
    if (Number.isInteger(level / 10)) {
      newHp = (defaultHp * 2) + 5
    } else {
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

  render() {
    const styles = StyleSheet.create({
      container: {
        height: '100%',
        backgroundColor: '#f1f1f1',
      },
      content: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        height: '100%',
      },
      headRow: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headRowCol: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomMenu: {
        position: "absolute",
        bottom: 0,
        width: '100%',
        display: "flex",
        flexDirection: 'column',
      },
      bottomMenuRow: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      bottomMenuContent: {
        width: '100%',
        backgroundColor: '#e5e5e5',
        borderStyle: 'solid',
        borderColor: '#e5e5e5',
        borderTopLeftRadius: 8,
        padding: 20,
      },
      upgradesButton: {
        borderStyle: "solid",
        borderColor: "#4a5b64",
        backgroundColor: "#4a5b64",
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        elevation: 5,
      },
      upgradesButtonSelected: {
        borderStyle: "solid",
        borderColor: "#283942",
        backgroundColor: "#283942",
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        elevation: 5,
      },
      upgradesButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
      },
      upgradesRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        padding: 5,
      }
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
      danoDps,
      defaultHp,
      showMenu,
    } = this.state
    const { language } = this.props
    return (
      <View style={styles.container}>
        <Char hit={this.hit} dano={dano}/>
        <View style={styles.content}>

          <View style={styles.headRow}>
            <View style={styles.headRowCol}>
              <Text style={{
                fontWeight: 'bold',
              }}>DPS</Text>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: danoDps > (dano + autoDano) * 6 ? 'red' : (danoDps > (dano + autoDano) * 3 ? 'orange' : '#000')
              }}>
                {danoDps === 0 ? 0 : (
                  danoDps < 10 ?
                    danoDps.toFixed(2)
                    :
                    danoDps.toFixed(0)
                )}
              </Text>
            </View>
            <View style={styles.headRowCol}>
              <Text style={{
                fontWeight: 'bold',
              }}>{language ? 'Nível' : 'Level'}</Text>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000'
              }}>{level}</Text>
            </View>
            <View style={styles.headRowCol}>
              <Text style={{
                fontWeight: 'bold',
              }}>{language ? 'Ouro' : 'Gold'}</Text>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000'
              }}>{ouro}</Text>
            </View>
          </View>

          <View style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '70%',
            backgroundColor: '#a3a3c2',
            padding: 3,
            borderRadius: 3,
            height: 30,
            position: 'relative',
            elevation: 5,
            marginTop: 20,
          }}>
            <View style={{
              width: `${(hpInimigo / defaultHp) * 100}%`,
              height: '100%',
              backgroundColor: '#c00',
              position: 'absolute',
              marginTop: 3,
              marginLeft: 3,
              borderRadius: 2,
            }} />
            <View style={{ position: 'absolute', display: 'flex', alignSelf: 'center', marginTop: 4 }}>
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                {hpInimigo < 0 ? '0' :
                  hpInimigo.toFixed(0) +
                  '/' + defaultHp}
              </Text>
            </View>
          </View>
          <View style={{
            padding: 15,
          }}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 16,
            }}>{qtdInimigos > 9 ? '' : `${qtdInimigos}/10`}</Text>
          </View>
          <AutoClick
            hit={this.hit}
            dano={autoDano}
          />
        </View>
        <View style={styles.bottomMenu}>
          {enableNextLvl && showNextLvl &&
            <View style={styles.bottomMenuRow}>
              <TouchableOpacity style={{
                backgroundColor: '#ffbf00',
                padding: 15,
                paddingLeft: 30,
                paddingRight: 30,
                borderRadius: 50,
                elevation: 8,
                marginRight: 20,
                marginBottom: 40,
              }}
                onPress={() => {
                  this.nextLevel()
                }}
              >
                <Text style={{
                  fontSize: 20,
                  color: '#FFF',
                  fontWeight: 'bold'
                }}>Next Level</Text>
              </TouchableOpacity>
            </View>
          }
          {level >= 100 && !showNextLvl && enableNextLvl &&
            <View style={styles.bottomMenuRow}>
              <TouchableOpacity style={{
                backgroundColor: 'black',
                padding: 15,
                paddingLeft: 30,
                paddingRight: 30,
                borderRadius: 50,
                elevation: 8,
                marginRight: 20,
                marginBottom: 40,
              }}
                onPress={() => {
                  this.rebirth()
                }}
              >
                <Text style={{
                  fontSize: 20,
                  color: '#FFF',
                  fontWeight: 'bold'
                }}>REBIRTH</Text>
              </TouchableOpacity>
            </View>
          }
          <View style={styles.bottomMenuRow}>
            <TouchableOpacity
              style={
                this.state.showUpgrades ? 
                  styles.upgradesButtonSelected
                :
                  styles.upgradesButton
              }
              onPress={() => {
                this.setState({ 
                  showUpgrades: !this.state.showUpgrades,
                  showMenu: false
                })
              }}
            >
              <Text style={styles.upgradesButtonText}>{language ? 'Melhorias' : 'Upgrades'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                this.state.showMenu ? 
                  styles.upgradesButtonSelected
                :
                  styles.upgradesButton
              }
              onPress={() => {
                this.setState({ 
                  showMenu: !this.state.showMenu,
                  showUpgrades: false
                })
              }}
            >
              <Text style={styles.upgradesButtonText}>Menu</Text>
            </TouchableOpacity>
          </View>
          {this.state.showMenu &&
            <ScrollView style={styles.bottomMenuContent}>
              <View style={styles.upgradesRow}>
                <Text />
                <TouchableOpacity
                  style={{
                    backgroundColor: 'e5e5e5',
                    padding: 4,
                  }}
                  onPress={() => {
                    this.props.goBackToMenu()
                  }}
                >
                  <Text style={{ color: '#4a5b64', fontWeight: "bold" }}>{language ? 'VOLTAR' : 'BACK'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.upgradesRow}>
                <View style={{ padding: 4}}><Text> </Text></View>
              </View>
            </ScrollView>
          }
          {this.state.showUpgrades &&
            <ScrollView style={styles.bottomMenuContent}>
              <View style={styles.upgradesRow}>
                <Text>
                  {language ? 'Dano por clique' : 'Click Damage'}: {dano}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: ouro < valUpgrade ? '#c5c5c5' : 'green',
                    padding: 4
                  }}
                  onPress={() => {
                    this.upgrade()
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: "bold" }}>{language ? 'Comprar' : 'Buy'} ${valUpgrade}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.upgradesRow}>
                <Text>
                  {language ? 'Dano ocioso' : 'Idle Damage'}: {autoDano}/s
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: ouro < valAutoUpgrade ? '#c5c5c5' : 'green',
                    padding: 4
                  }}
                  onPress={() => {
                    this.autoUpgrade()
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: "bold" }}>{language ? 'Comprar' : 'Buy'} ${valAutoUpgrade}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          }
        </View>
      </View>
    );
  }
}

export default GamePlay