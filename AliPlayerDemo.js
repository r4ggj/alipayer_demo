
import React, {Component} from 'react';
import {
	StyleSheet,
	WebView,
	Dimensions,
	View,
	Text,
	PixelRatio,
	Platform
} from 'react-native';
import Orientation from 'react-native-orientation';
const {width,height}=Dimensions.get('window');
const _1px=1/PixelRatio.get();
export default class AliPlayerDemo extends Component {
	constructor(props){
		super(props);
		this.state={
			rotateZ:'0deg',
			orientation:'PORTRAIT'
		}
	}
	componentWillMount() {
		// The getOrientation method is async. It happens sometimes that
		// you need the orientation at the moment the JS runtime starts running on device.
		// `getInitialOrientation` returns directly because its a constant set at the
		// beginning of the JS runtime.
		
		const initial = Orientation.getInitialOrientation();
		if (initial === 'PORTRAIT') {
				// do something
			this.setState({
				orientation:"PORTRAIT"
			});
			
		} else {
			// do something else
			this.setState({
				orientation:"LANDSCAPE"
			});
		}
	}
	componentDidMount() {
		// this locks the view to Portrait Mode
		Orientation.lockToPortrait();
		
		// this locks the view to Landscape Mode
		// Orientation.lockToLandscape();
		
		// this unlocks any previous locks to all Orientations
		Orientation.unlockAllOrientations();
		
		Orientation.addOrientationListener(this._orientationDidChange);
	}
	_orientationDidChange = (orientation) => {
		if (orientation === 'LANDSCAPE') {
			// do something with landscape layout
			Orientation.lockToLandscape();
			Orientation.unlockAllOrientations();
			this.setState({
				orientation:"LANDSCAPE"
			});
			
		} else {
			// do something with portrait layout
			Orientation.lockToPortrait();
			Orientation.unlockAllOrientations();
			this.setState({
				orientation:"PORTRAIT"
			});
		}
	}
	
	componentWillUnmount() {
		Orientation.getOrientation((err, orientation) => {
			console.log(`Current Device Orientation: ${orientation}`);
		});
		
		// Remember to remove listener
		Orientation.removeOrientationListener(this._orientationDidChange);
	}
	
	setFullScreen=()=>{
		this.setState({
			rotateZ:'90deg'
		});
	}
	setNormalSize=()=>{
		this.setState({
			rotateZ:'0deg'
		});
	}
	onMessage = (e) => {
		const data=e.nativeEvent.data;
		let _data;
		if(data){
			try{
				_data=JSON.parse(data);
			}
			catch (e){
				_data=null;
			}
		}
		if(_data){
			const {type,payload}=_data;
			switch (type){
				case "orientation":
					Orientation.lockToLandscapeLeft();
					Orientation.unlockAllOrientations();
					break;
				default:
					break;
			}
		}
	}
	
	play = (params) => {
		if(params){
			let str="setPlayer&&setPlayer("+JSON.stringify(params)+")";
			this.source=str;
		}
	}
	
	pause=()=>{
		this.injectJS("player.pause()")
	}
	
	stop=()=>{
		this.injectJS("player.seek(0);player.pause();")
	}
	
	rePlay=()=>{
		this.injectJS("player.replay()");
	}
	
	injectJS=(str)=>{
		if(this.webview){
			this.webview.injectJavaScript(str)
		}
		else{
			alert()
		}
	}
	
	setSize=()=>{

		this.injectJS("player.setPlayerSize('50%','50%')")
	}
	onLoad=()=>{
		this.source&&this.injectJS(this.source);
	}
	render() {
		return (
					<View style={styles.container}>
						{
							this.state.orientation==="PORTRAIT"?
								<View style={styles.nav}>
									<Text style={styles.back} onPress={this.props.hidePlayer}>返回</Text>
									<View style={styles.titleWrapper} pointerEvents="box-none">
										<Text style={styles.title}>点播|直播</Text>
									</View>
								</View>:null
						}
						<View style={{flex:1}}>
							<WebView
								javaScriptEnabled
								domStorageEnabled
								allowsInlineMediaPlayback
								automaticallyAdjustContentInsets
								scalesPageToFit
								onLoad={this.onLoad}
								scrollEnabled={false}
								ref={webview => {
									this.webview = webview;
								}}
								style={{
									position:'absolute',
									top:0,
									bottom:0,
									left:0,
									right:0,
									backgroundColor:'transparent'
								}}
								contentInset={{
									top:0,
									bottom:0,
									left:0,
									right:0
								}}
								source={Platform.OS==='android'?{uri:'file:///android_asset/test.html'}:require('./test.html')}
								onMessage={this.onMessage}
							/>
						</View>
					</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	nav:{
		height:44,
		flexDirection:'row',
		alignItems:'center',
		backgroundColor:'teal'
	},
	back:{
		fontSize:18,
		color:'#fff',
		margin:4,
		padding:4
	},
	titleWrapper:{
		...StyleSheet.absoluteFillObject,
		justifyContent:'center',
		alignItems:'center'
	},
	title:{
		fontSize:18,
		color:'#fff'
	}
});
