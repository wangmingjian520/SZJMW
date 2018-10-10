import React from 'react'
import ReactDOM from 'react-dom'
import { Button , Form , Breadcrumb , Modal , message ,Input , InputNumber , Layout , Select , DatePicker } from  'antd';
import BMap from 'BMap';
import FaceUrl from '../../../utils/apiAndInterfaceUrl';
import axios from '../../../axios'

 
export default class Yjzygisgl extends React.Component {
    
//查询物资库点
handleSearchKd = ()=>{
  
   axios.ajax({
                url:FaceUrl.wzkdFindPosition,
                method:FaceUrl.POST,
                baseApi:FaceUrl.bdApi
                
            }).then((res)=>{
              console.log(res)
               this.handFindPosition(res.data)
            })
} 
 //救援队伍
handleSearchJydw = ()=>{
  
  var adds = [{longitude:'114.04254',latitude:'22.756636'},{longitude:'114.246635',latitude:'22.726772'},
  {longitude:'114.08221',latitude:'22.484414'},{longitude:'114.24378',latitude:'22.565204'}
  ];
  /*var adds = [
    new BMap.Point(114.04254,22.756636),
    new BMap.Point(114.246635,22.726772),
    new BMap.Point(114.100607,22.656351),
    new BMap.Point(114.243186,22.569875),
    new BMap.Point(114.074161,22.533561),
    new BMap.Point(113.886738,22.5624),
    new BMap.Point(114.243186,22.565604),
    new BMap.Point(114.08221,22.484414)
  ];*/
  this.handFindPosition(adds);
}
//事件受理
handleSearchSjsl = ()=>{
  var adds = [{longitude:'114.04244',latitude:'22.656236'},{longitude:'114.109607',latitude:'22.626351'},
  {longitude:'113.886238',latitude:'22.533569'},{longitude:'114.24778',latitude:'22.565504'}
  ];
 /*var adds = [
    new BMap.Point(114.04244,22.656236),
    new BMap.Point(114.246235,22.726172),
    new BMap.Point(114.109607,22.626351),
    new BMap.Point(114.243586,22.569375),
    new BMap.Point(114.074861,22.533569),
    new BMap.Point(113.886238,22.5684),
    new BMap.Point(114.243786,22.565204),
    new BMap.Point(114.08121,22.483414)
  ];*/
  this.handFindPosition(adds);
}
//
handFindPosition = (adds)=>{
  var map =  this.state.map;
  console.log(map);
   map.clearOverlays();
  for (var i=0; i < adds.length ; i++) {
    var new_point = new BMap.Point(adds[i].longitude,adds[i].latitude);
      map.addOverlay(new BMap.Marker(new_point));
  }
  this.setState({
    map:map
  })
}

componentDidMount () {
  var map = new BMap.Map("allmap"); // 创建Map实例
  map.centerAndZoom(new BMap.Point(114.062966, 22.55164), 11); // 初始化地图,设置中心点坐标和地图级别
  map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
  map.setCurrentCity("深圳"); // 设置地图显示的城市 此项是必须设置的
  map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
  this.setState({
    map:map
  })
}
 // 用经纬度设置地图中心点
    /*handleSearch() {
       var map =  this.state.map;
        if(document.getElementById("longitude").value != "" && document.getElementById("latitude").value != ""){
            map.clearOverlays(); 
            var dd = document.getElementById("longitude").value;
            alert(dd);
            var new_point = new BMap.Point(document.getElementById("longitude").value,document.getElementById("latitude").value);
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);              // 将标注添加到地图中
            map.panTo(new_point);      
        }
        if(document.getElementById("cityName").value != ""){
          // 创建地址解析器实例
         var myGeo = new BMap.Geocoder();
         var city = document.getElementById("cityName").value;
       // 将地址解析结果显示在地图上,并调整地图视野
         myGeo.getPoint(city, function(point){
           if (point) {
                  map.centerAndZoom(point, 16);
                  map.addOverlay(new BMap.Marker(point));
            }else{
                 alert("您选择地址没有解析到结果!");
             }
         }, "深圳市");
             
        }

    }*/

render () {
  return (
    <div>
      <Breadcrumb separator=">" style={{ margin: '16px 20px' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应急地理信息系统</Breadcrumb.Item>
                    <Breadcrumb.Item>应急资源GIS管理</Breadcrumb.Item>
       </Breadcrumb>
       <ul>
       <li style={{display: 'inline-block',  margin: '0px 20px'}}><a href="javascript:;" onClick={()=>{this.handleSearchKd()}}
         style={{ width: '55px',
                       height: '35px',
                       background: 'chartreuse',
                       display: 'inline-block'
                      }}></a><span>物资库点</span></li>
       <li style={{display: 'inline-block',  margin: '0px 20px'}}><a href="javascript:;" onClick={()=>{this.handleSearchJydw()}}
       style={{ width: '55px',
                       height: '35px',
                       background: 'blue',
                       display: 'inline-block'
                      }}></a><span>救援队伍</span></li>
        <li style={{display: 'inline-block',  margin: '0px 20px'}}><a href="javascript:;" onClick={()=>{this.handleSearchSjsl()}}
        style={{ width: '55px',
                       height: '35px',
                       background: 'chocolate',
                       display: 'inline-block'
                      }}></a><span>事件受理</span></li>
       </ul>
        
      <div style={{ width:'100vw',height:'30px' }}> </div>
      <div
        id='allmap'
        style={{
          width:'100vw',
          height:'80vh'
         }} />
         
    </div>
       )
       }
}
