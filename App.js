import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, Image, TouchableHighlight, ListView} from 'react-native';
import { Constants } from 'expo';

import * as firebase from 'firebase'; // 4.2.0

const firebaseConfig = {
  apiKey: "AIzaSyD-MTg-vjAzSv46zMmceBGZrkrB_ZWZj6w",
  authDomain: "hype-9758f.firebaseapp.com",
  databaseURL: "https://hype-9758f.firebaseio.com",
  storageBucket: "hype-9758f.appspot.com",
};


try{
 firebase.initializeApp(firebaseConfig);
}
catch(err)
{
  //fadsfa
}

const firebaseApp = firebase;

export class HypeGrid extends Component {
  render() {
    return (
      <View>
      <Text>
      </Text>
      </View>
      );
  }
}

export class HypeButton extends Component {
  _handleHypePress = () => {
    Alert.alert(
      'HYPE HYPE HYPE')
  }
  render() {
    return (
      <TouchableHighlight onPress = {this._handleHypePress}
      underlayColor='red'
      style = {styles.hype_button}>
        <Image
          source={{ uri: 'http://anotherkind.co.uk/wp-content/uploads/2015/06/Hype-Logo-Red.jpg' }}
          style={{ height: 140, width: 200 }}
        />
      </TouchableHighlight>
      );
  }
}

export class BottomBar extends Component {
  _handleButtonPress = () => {
    Alert.alert(
      'Button pressed!',
      'You did it!',
    );
  };

  render() {
    return (
      <View style={styles.bottom_bar}>
      <Button
        title="Top"
        onPress={this._handleButtonPress}
      />
      <Button
        title="Map"
        onPress={this._handleButtonPress}
      />
      <Button
        title="Rising"
        onPress={this._handleButtonPress}
      />
      </View>

      );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
    this.itemsRef = this.getRef().child('items');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });

    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
           style={{flex:1, height: undefined, width: undefined}}
          source={{ uri: 'https://www.sfoutsidelands.com/uploads/MobileMap12000x12000_img.jpg' }}
        />
      <Text>
      </Text>
      <HypeButton
      />
      <BottomBar
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  bottom_bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hype_button : {
    alignItems: 'center',
  }
});
