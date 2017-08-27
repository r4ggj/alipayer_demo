import React,{Component} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	AppRegistry,
	ScrollView,
	Modal,
	Alert
} from 'react-native'
import md5 from 'md5'
import AliPlayerDemo from './AliPlayerDemo'

function getLiveUrl(appName,streamName,now){
	var uri="/"+appName+"/"+streamName;
	var timestamp=Math.round(now.getTime()/1000)+1800;
	var _str=uri+"-"+timestamp+"-0-0-ZhongTaiJi2017";
	var key=md5(_str);
	var out="rtmp://video-center.alivecdn.com"+uri+"?vhost=live.zhongtaiji.cn?auth_key="+timestamp+"-0-0-"+key;
	return out;
}

function getPlayUrl(appName,fileName,now){
	var uri="/"+appName+"/"+fileName;
	var timestamp=Math.round(now.getTime()/1000)+1800;
	var _str=uri+"-"+timestamp+"-0-0-ZhongTaiJi2017";
	var key=md5(_str);
	var out="http://live.zhongtaiji.cn"+uri+"?auth_key="+timestamp+"-0-0-"+key;
	return out;
}

export default class App extends Component{
	constructor(props){
		super(props);
		this.state={
			url:"",
			liveUrl:"",
			visible:false
		};
	}
	componentDidMount(){
		var date=new Date();
		var liveUrl=getLiveUrl("zhongtaiji",'test',date);
		const url=getPlayUrl("zhongtaiji","test.flv",date);
		this.setState({
			url,
			liveUrl
		});
	}
	toPlayer=()=>{
		const url="http://qn.media.epub360.com/materials/video/2f8786ac4f080726812c6fdcbd1cae91.mp4_origin.mp4";
		this.setState({
			visible:true
		},()=>{
			this.player&&this.player.play({source:url,isLive:false});
		});
		
	}
	toLive=()=>{
		
		this.setState({
			visible:true,
		},()=>{
			this.player&&this.player.play({source:this.state.url,isLive:true});
		});
	}
	hidePlayer=()=>{
		this.setState({
			visible:false
		})
	}
	onChangeURL=(url)=>{
		this.setState({url})
	}
	render(){
		return (
			<View style={styles.container}>
				<ScrollView
					keyboradShouldPersistOnTaps="handled"
				>
					<Text style={styles.title}>视频直播测试</Text>
					<Text selectable>{this.state.liveUrl}</Text>
					<Text selectable>{this.state.url}</Text>
					<View style={styles.btnWrapper}>
						<TouchableOpacity
							onPress={this.toPlayer}
							style={styles.btn} activeOpacity={0.8}>
							<Text style={styles.btnText}>开始点播</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.btnWrapper}>
						<TouchableOpacity
							onPress={this.toLive}
							style={styles.btn} activeOpacity={0.8}>
							<Text style={styles.btnText}>开始直播</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				<Modal
					visible={this.state.visible}
					onRequestClose={this.hidePlayer}
				>
					<AliPlayerDemo
						ref={ref=>this.player=ref}
						hidePlayer={this.hidePlayer}
					/>
				</Modal>
			</View>
		);
	}
}

const styles=StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:'#FFF'
	},
	title:{
		fontSize:18,
		fontWeight:'bold',
		color:'#fff',
		paddingVertical:8,
		textAlign:'center',
		backgroundColor:'teal'
	},
	inputWrapper:{
		borderWidth:0.5,
		borderColor:'#ccc',
		padding:10,
		margin:10
	},
	input:{
		fontSize:18,
		color:'#333',

	},
	btnWrapper:{
		justifyContent:'center',
		alignItems:'center'
	},
	btn:{
		backgroundColor:'teal',
		paddingVertical:8,
		paddingHorizontal:12,
		borderRadius:2,
		elevation:2,
		shadowColor:'#000',
		shadowOffset:{
			width:0,
			height:2
		},
		shadowOpacity:0.5,
		shadowRadius:2,
		margin:4,
	},
	btnText:{
		color:'#fff',
		fontSize:18
	}
});

AppRegistry.registerComponent('alipayer_demo',()=>App)