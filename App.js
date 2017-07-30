import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, Image, ListView, ScrollView, Animated, TouchableOpacity} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

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
		//var rootRef = firebase.database().ref();
		/* example of how to set value to the database
		itemsRef.child('/tester').set({
			beef: "boos",
			chicken: "yoos"
		});*/


//const firebaseApp = firebase;

export class HypeButton extends Component {

  constructor (props) {
    super(props)
  this.springValue = new Animated.Value(1)
  }
  spring() {
    this.springValue.setValue(0.4)
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1,
      }
      ).start()
  }

  distance(lat, lon) {
    const loc = JSON.parse(this.props.location);
    return Math.sqrt(Math.pow(lat - loc.coords.latitude, 2) + Math.pow(lon - loc.coords.longitude, 2));
  }

  _handleHypePress = () => {
    if (this.props.location == null){
      return;
    }
    var d = 0;
    var next = 0;
    var ret = 1;

      d = this.distance(-122.494806, 37.769745);
      if (d > (next = this.distance(-122.492956, 37.769745))) {
        d = next;
        ret = 2;
      }
      if (d > (next = this.distance(-122.486318, 37.769447))) {
        d = next;
        ret = 3;
      }
      if (d > this.distance(-122.483202, 37.769656)) {
        ret = 4;
      }
      this.spring()
      console.log(this.props.zones);
      const zone = this.props.zones[ret-1];
      const value = zone["score"] + 1;
      const name = zone["title"];
      const lat = zone["latitude"];
      const long = zone["longitude"];
      itemsRef.child('zones').child(this.props.zones[ret-1]["_key"]).set({
        score : value,
        title : name,
        latitude: lat,
        longitude: long,
    })

  }
  render() {
    return (
      <View style = {styles.hype_button}>
      <TouchableOpacity onPress = {this._handleHypePress}>
        <Animated.Image
          source={{ uri: 'http://i.imgur.com/P5LVcrr.png' }}
          style={{ height: 140, width: 200, transform: [{scale: this.springValue}] }}
        />
      </TouchableOpacity>
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
  _handleButtonPress = () => {
    Alert.alert(
      'Button pressed!',
      'You did it!',
    );
  };

  styleZone(zone){
    if (zone["user_inside"]){
      return {transform : [{scale : 2}]};
    }
    else{
      return {};
    }
  }

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

        <View style={[styles.hype_score, styles.zone1, this.styleZone(this.props.zones[0])]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold'}}>
            {this.props.zones[0]["score"]}
          </Text>
        </View>

        <View style={[styles.hype_score, styles.zone2, this.styleZone(this.props.zones[1])]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold'}}>
            {this.props.zones[1]["score"]}
          </Text>
        </View>

        <View style={[styles.hype_score, styles.zone3, this.styleZone(this.props.zones[2])]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold'}}>
            {this.props.zones[2]["score"]}
          </Text>
        </View>

        <View style={[styles.hype_score, styles.zone4, this.styleZone(this.props.zones[3])]}>
          <Text style={{ fontSize: 15, fontWeight: 'bold'}}>
            {this.props.zones[3]["score"]}
          </Text>
        </View>

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
      }),

      locationResult: null
    };
    this.itemsRef = this.getRef().child('zones');
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((zone) => {
        items.push({
          title: zone.child("title").val(),
          score: zone.child("score").val(),
          latitude: zone.child("latitude").val(),
          longitude: zone.child("longitude").val(),
          _key: zone.key
        });
      });
      this.markNearestZone(items, JSON.parse(this.state.locationResult));
      this.setState({
       zones: items
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef);
    this._getLocationAsync();
  }

  dist(zone, location) {
    return Math.sqrt(Math.pow(zone['latitude'] - location.coords.latitude, 2) + Math.pow(zone['longitude'] - location.coords.longitude, 2));
  }

  markNearestZone(zones, location) {
    var mindist = 1000000;
    var minind = 0;
    zones.forEach((zone, index) => {
      if (this.dist(zone, location) < mindist){
        mindist = this.dist(zone, location);
        minind = index;
      }
    })
    zones.forEach((zone, index) =>{
      if (index == minind){
        zone["user_inside"] = true;
      }
      else{
        zone["user_inside"] = false;
      }
    })
  }
  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.markNearestZone(this.state.zones, location);
   this.setState({ locationResult: JSON.stringify(location),
     zones : this.state.zones
   });
 };

  render() {
    return (
      <View style={styles.container}>
      <ScrollingMapView zones = {this.state.zones}
      />
      <HypeButton location = {this.state.locationResult}
      zones = {this.state.zones}
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
   hype_score: {position: 'absolute', right: 0, bottom: 0, width: 65, height: 30, borderRadius: 10, borderColor: '#f00', borderWidth: 5,  backgroundColor: '#ff0', alignItems: 'center', fontSize: 100},
   zone1: {top: 270, left: 90},
   zone2: {top: 110, left: 220},
   zone3: {top: 110, left: 770},
   zone4: {top: 110, left: 970},
});
