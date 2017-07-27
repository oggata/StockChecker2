import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Colors from "../../themes/colors";

//import {Bar,StockLine,SmoothLine,Scatterplot,Radar,Tree,Pie} from 'react-native-pathjs-charts'
//import {Bar,StockLine} from 'react-native-pathjs-charts';
//import {Bar,StockLine,SmoothLine,Scatterplot,Radar,Tree,Pie} from 'react-native-pathjs-charts'
import {
  Button,
  SideMenu,
  Menu,
  List,
  ListItem,
  ButtonGroup,
  SearchBar,
  CheckBox,
  PricingCard
} from "react-native-elements";
//import {Bar,StockLine,SmoothLine,Scatterplot,Radar,Tree,Pie} from 'react-native-pathjs-charts';
import { ScrollView } from "react-native";
//import Chart from 'react-native-charts';
//import Chart2 from 'react-native-pathjs-charts';

//import Table from "react-native-simple-table";

import {
  Bar,
  StockLine,
  SmoothLine,
  Scatterplot,
  Radar,
  Tree,
  Pie
} from "react-native-pathjs-charts";

const data = [["7/1", 1000]];
var api = {
  getPrices(companyCode, interval, range) {
    var url =
      "https://www.google.com/finance/getprices?q=" +
      companyCode +
      "&x=NASDAQ&i=" +
      interval +
      "&p=" +
      range +
      "&f=d,c,v,o,h,l&df=cpct&auto=1&ts=1489550582260&ei=4rrIWJHoIYya0QS1i4IQ";
    return fetch(url).then(res => res.text());
  }
};

class UserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      todays: {},
      prices: [],
      points: data,
      averages: data,
      company: this.props.navigation.state.params
    };
  }

  unixToDate(unixtime) {
    var ux = unixtime;
    var d = new Date(ux * 1000);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    return month + "/" + day;
  }

  componentWillMount() {
    //var companyCode = "AAPL";
    //if(this.state.company.cod){
    var companyCode = this.state.company.code;
    //}
    //console.log("----------------------->");
    if (!this.state.company.code) {
      companyCode = "AAPL";
    }

    //1M:86400sec=1日 3M:86400 * 3 = 259200 : 3日 1Y:86400 * 12
    api.getPrices(companyCode, 259200, "3M").then(res => {
      //改行でsplitしてlineに配列として入れる
      var lines = res.split(/\r\n|\r|\n/);
      //８行目以降は価格部になるので、配列に入れておく
      this.todays = {};
      this.prices = [];
      this.points = [];
      this.heikins = [];
      this.averages = [];
      /*
        a で始まる時刻: aを取った文字列がUNIX時刻
        a で始まらない時刻:
        a で始まる時刻 + INTERVAL × この列の数値
      */
      this.firstUnixTime = 0;
      this.roopCnt = 0;
      for (i = 7; i < lines.length; i++) {
        var columns = lines[i].split(",");
        console.log("a>>>>>>>");
        console.log(columns);
        console.log("a>>>>>>>");
        if (columns[0].startsWith("a")) {


console.log("b1>>>>>>>");
console.log(columns);
console.log("b1>>>>>>>");

          var _unixtime = columns[0].slice(1);
          this.firstUnixTime = _unixtime;
          //var _txt = _unixtime + "," + this.unixToDate(_unixtime) + "," + columns[1] + "," + columns[2] + "," + columns[3];
          //var _txt = "{name:'AAAAA'}";
          var _txt = new Object();
          _txt.name = "hello";
          _txt.strdate = this.unixToDate(_unixtime);
          _txt.owarine = columns[1];
          _txt.takane = columns[2];
          _txt.yasune = columns[3];
          _txt.hajimene = columns[4];
          _txt.dekidaka = columns[5];

          this.prices.push(_txt);

          this.todays = _txt;

          /*
          var _pointData = [];
          _pointData.push(_txt.strdate);
          _pointData.push(Number(columns[1]));
          */
          var _pointData = {
            x: i,
            y: Number(columns[1])
          };
          if (columns[1]) {
            this.points.push(_pointData);
          }

          var _heikin = 0;
          var _heikinCnt = 0;
          if (this.prices[this.roopCnt - 4]) {
            _heikin += Number(this.prices[this.roopCnt - 4].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 3]) {
            _heikin += Number(this.prices[this.roopCnt - 3].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 2]) {
            _heikin += Number(this.prices[this.roopCnt - 2].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 1]) {
            _heikin += Number(this.prices[this.roopCnt - 1].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt]) {
            _heikin += Number(this.prices[this.roopCnt].owarine);
            _heikinCnt++;
          }
          var heikin = Number(_heikin / 5);
          if (_heikinCnt < 5) {
            heikin = _txt.owarine;
          }
          var _heikinData = {
            x: i,
            y: Number(heikin)
          };
          if (columns[1]) {
            this.averages.push(_heikinData);
          }

          this.roopCnt++;
        } else if(columns[0]){

          var _unixtime =
            Number(this.firstUnixTime) + 86400 * Number(columns[0]);
          var _txt = new Object();
          _txt.name = "hello";
          _txt.strdate = this.unixToDate(_unixtime);
          _txt.owarine = columns[1];
          _txt.takane = columns[2];
          _txt.yasune = columns[3];
          _txt.hajimene = columns[4];
          _txt.dekidaka = columns[5];

          this.prices.push(_txt);

          this.todays = _txt;


          //var _pointData = [];
          //_pointData.push(_txt.strdate);
          //_pointData.push(Number(columns[1]));
          //var _pointData = {x:};
          /*
          var _a = this.prices[i-5].owarine;
          var _b = 
*/
          var _pointData = {
            x: i,
            y: Number(columns[1])
          };
          if (columns[1]) {
            this.points.push(_pointData);
          }
          //5 25 75 d
          //13 26 w
          //

          var _heikin = 0;
          var _heikinCnt = 0;
          if (this.prices[this.roopCnt - 4]) {
            _heikin += Number(this.prices[this.roopCnt - 4].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 3]) {
            _heikin += Number(this.prices[this.roopCnt - 3].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 2]) {
            _heikin += Number(this.prices[this.roopCnt - 2].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt - 1]) {
            _heikin += Number(this.prices[this.roopCnt - 1].owarine);
            _heikinCnt++;
          }
          if (this.prices[this.roopCnt]) {
            _heikin += Number(this.prices[this.roopCnt].owarine);
            _heikinCnt++;
          }
          var heikin = Number(_heikin / 5);
          if (_heikinCnt < 5) {
            heikin = _txt.owarine;
          }
          var _heikinData = {
            x: i,
            y: Number(heikin)
          };
          if (columns[1]) {
            this.averages.push(_heikinData);
          }

          this.roopCnt++;
        }
      }
      this.setState({
        todays: this.todays,
        prices: this.prices,
        points: this.points,
        averages: this.averages
      });
    });
  }

  toggle() {}

  renderLoadingView() {
    return (
      <View>
        <Text>Loading temperatures...</Text>
      </View>
    );
  }

  render() {
    const buttons = ["1M", "3M", "6M", "1Y"];
    //const buttons2 = ["1year", "3month", "1month"];
console.log(">>>>>>>>>>>>>>>>");
console.log(this.state.todays);
    console.log(">>>>>>>>>>>>>>>>");
    return (
      <ScrollView>

        <PricingCard
          color='#4f9deb'
          title={this.state.company.name}
          price={this.state.todays.owarine}
          info={['1 User']}
          button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
        />

        <ButtonGroup
          onPress={() => {
            this.setState({ selectedTab: this.updateIndex });
          }}
          buttons={buttons}
        />

        <StockLine
          data={[this.state.points, this.state.averages]}
          options={options}
          xKey="x"
          yKey="y"
        />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

let options = {
  width: 320,
  height: 320,
  color: "#2980B9",
  margin: {
    top: 10,
    left: 35,
    bottom: 30,
    right: 10
  },
  animate: {
    type: "delayed",
    duration: 200
  },
  axisX: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: "bottom",
    tickValues: [],
    label: {
      fontFamily: "Arial",
      fontSize: 8,
      fontWeight: true,
      fill: "#34495E"
    }
  },
  axisY: {
    showAxis: true,
    showLines: true,
    showLabels: true,
    showTicks: true,
    zeroAxis: false,
    orient: "left",
    tickValues: [],
    label: {
      fontFamily: "Arial",
      fontSize: 8,
      fontWeight: true,
      fill: "#34495E"
    }
  }
};

export default UserScreen;
