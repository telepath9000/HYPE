import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, Image, TouchableHighlight, ListView, ScrollView} from 'react-native';
import { Constants } from 'expo';

import * as firebase from 'firebase'; // 4.2.0

const firebaseConfig = {
        apiKey: "AIzaSyA78htuLAZ-1aBxQNIj9-ZDawnx1Jrgk0I",
		    authDomain: "hype-635d3.firebaseapp.com",
		    databaseURL: "https://hype-635d3.firebaseio.com",
		    storageBucket: "hype-635d3.appspot.com"
};

try{
 firebase.initializeApp(firebaseConfig);
}
catch(err)
{
  //fadsfa
}

const firebaseApp = firebase;
const itemsRef = firebaseApp.database().ref();
		var rootRef = firebase.database().ref();
		/* example of how to set value to the database
		itemsRef.child('/tester').set({
			beef: "boos",
			chicken: "yoos"
		});*/


//const firebaseApp = firebase;

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

    itemsRef.child('/tester').push({
			hack: "fun",
			love: "great"
		});

  }
  render() {
    return (
      <View style = {styles.hype_button}>
      <TouchableHighlight onPress = {this._handleHypePress}
      underlayColor='red'>
        <Image
          source={{ uri: 'http://i.imgur.com/P5LVcrr.png' }}
          style={{ height: 140, width: 200 }}
        />
      </TouchableHighlight>
      </View>
      );
  }
}

export class BottomBar extends Component {
  _handleButtonPress = () => {
    Alert.alert(
      'Button pressed!',
      'You did it!',
    );


	itemsRef.child('/tester').push({
			stew: "yes",
			cool: "poop"
		});
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

export class ScrollingMapView extends Component {
  render(){
    return (
    <ScrollView horizontal={true}
    contentContainerStyle = {styles.scrollMapViewContent}
    showsHorizontalScrollIndicator = {false}
    showsVerticalScrollIndicator = {false}
    overScrollMode = 'never'
    backgroundColor = '#719263'>
    <Image
           style={{flex:1, height: undefined, width: undefined}}
          source={{ uri: 'https://image.ibb.co/dXScZk/outsidelands.png' }}
        />
    </ScrollView>
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
      <ScrollingMapView
      />
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
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#719263',
  },
  bottom_bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 80
  },
  hype_button : {
    alignItems: 'center',
    bottom: 80,
  },
  scrollMapViewContent: {
     width             : 1185,  // <--- set the max width of the scrolled content
     height            : 459,  // <--- set the max height of the scrolled content
   },
});
