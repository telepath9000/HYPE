import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { Constants, MapView } from 'expo';

import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDlntIfARaHOjLfnBZ9gYRpiQZI6Sf9p80",
  authDomain: "staging-f322b.firebaseapp.com",
  databaseURL: "https://staging-f322b.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "529805306314"
};

firebase.initializeApp(firebaseConfig);

export class HypeButton extends Component {
  render() {
    return (
      <View style={styles.hype_button}>
      <Text>
      SMASH THAT MF HYPE BUTTON!
      </Text>
      </View>)
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
  state = {
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  render() {
    return (
      <View style={styles.container}>
      <MapView
        style={{ alignSelf: 'stretch', height: 200 }}
        region={this.state.mapRegion}
        onRegionChange={this._handleMapRegionChange}
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
