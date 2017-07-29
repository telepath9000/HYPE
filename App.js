import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {

	_handleGoogleLogin = async() => {
		try {
			const {type, user} = await Google.logInAsync({
				androidStandaloneAppClientId: '<ANDROID_CLIENT_ID>',
				iosStandAloneAppClientId: '<IOS_CLIENT_DI>',
				androidClientId: '603386649315-9rbv8vmv2vvftetfbvlrbufcps1fajqf.apps.googleusercontent.com',
				iosClientId: '603386649315-vp4revvrcgrcjme51ebuhbkbspl048l9.apps.googleusercontent.com',
				scopes: ['profile', 'email']
			});

			switch (type) {
				case 'succces': {
					Alert.alert(
						'logged in',
						'Hi ${user.name}!',
					);
					break ;
				}
				case 'cancel': {
					Alert.alert(
						'cancelled!',
						'Login was cancelled!',
					);
					break ;
				}
				default: {
					Alert.alert(
						'oops',
						'Login failed!',
					);
				}
			};

			render() {
				return (
					<View style={styles.container}>
						<Text style={styles.paragraph}>
						Do things
						<Button
					title="Login wit g-money"
					onPress={this._handleGoogleLogin}
						/>
						</Text>
						</View>
				);
			}
		}

		const styles = StyleSheet.create({
			container: {
				flex: 1,
				backgroundColor: '#fff',
				alignItems: 'center',
				justifyContent: 'center',
			},
		});
