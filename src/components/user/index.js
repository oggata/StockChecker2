import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Colors from "../../themes/colors";

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
import { ScrollView } from "react-native";
import Table from "react-native-simple-table";
import {
  Bar,
  StockLine,
  SmoothLine,
  Scatterplot,
  Radar,
  Tree,
  Pie
} from "react-native-pathjs-charts";

const data = [[]];
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
      companyCode:"AAPL",
      interval:8600,
      period:'1M',
      todays: {},
      prices: [],
      points: data,
      averages: data,
      company: this.props.navigation.state.params,
      dataSource: array
    };

    this.updateIndex = this.updateIndex.bind(this)
  }

  unixToDate(unixtime) {
    var ux = unixtime;
    var d = new Date(ux * 1000);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    return month + "/" + day;
  }

  setAverage(roopCnt,prices) {
    var _ave = 0;
    var _aveCnt = 0;
    if (this.prices[roopCnt - 4]) {
      _ave += Number(prices[roopCnt - 4].owarine);
      _aveCnt++;
    }
    if (this.prices[roopCnt - 3]) {
      _ave += Number(prices[roopCnt - 3].owarine);
      _aveCnt++;
    }
    if (this.prices[roopCnt - 2]) {
      _ave += Number(prices[roopCnt - 2].owarine);
      _aveCnt++;
    }
    if (this.prices[roopCnt - 1]) {
      _ave += Number(prices[roopCnt - 1].owarine);
      _aveCnt++;
    }
    if (this.prices[roopCnt]) {
      _ave += Number(prices[roopCnt].owarine);
      _aveCnt++;
    }
    var ave = Number(_ave / 5);
    if (_aveCnt < 5) {
      //heikin = obj.owarine;
      ave = 1;
    }
    var _aveData = {
      x: i,
      y: Number(ave)
    };
    return _aveData;
  }

  refreshChart(companyCode,interval,period){
    //1M:86400sec=1日 3M:86400 * 3 = 259200 : 3日 1Y:86400 * 12
    api.getPrices(companyCode, interval, period).then(res => {
      //改行でsplitしてlineに配列として入れる
      var lines = res.split(/\r\n|\r|\n/);
      //８行目以降は価格部になるので、配列に入れておく
      this.todays = {};
      this.prices = [];
      this.points = [];
      this.heikins = [];
      this.averages = [];
      this.firstUnixTime = 0;
      this.roopCnt = 0;
      this.unixTime = 0;
      for (i = 7; i < lines.length; i++) {
        var columns = lines[i].split(",");
        /*
          a で始まる時刻: aを取った文字列がUNIX時刻
          a で始まらない時刻:
          a で始まる時刻 + INTERVAL × この列の数値
        */
        if (columns[0].startsWith("a")) {
          this.unixTime = columns[0].slice(1);
          this.firstUnixTime = this.unixTime;
        } else {
          this.unixTime =
            Number(this.firstUnixTime) + 86400 * Number(columns[0]);
        }
        if (columns[0]) {
          var obj = new Object();
          obj.name = "hello";
          obj.strdate = this.unixToDate(this.unixTime);
          obj.owarine = columns[1];
          obj.takane = columns[2];
          obj.yasune = columns[3];
          obj.hajimene = columns[4];
          obj.dekidaka = columns[5];
          this.prices.push(obj);
          this.todays = obj;
          var _point = {
            x: i,
            y: Number(columns[1])
          };
          if (columns[1]) {
            this.points.push(_point);
            //this.averages.push(this.setAverage(this.roopCnt,this.prices,obj));
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

  componentWillMount() {
    //var companyCode = this.state.company.code;
    if (!this.state.companyCode) {
      this.setState({ companyCode: "AAPL" });
    }
    this.refreshChart(this.state.companyCode,this.state.interval, this.state.period);
  }

  componentWillUpdate(){
    this.refreshChart(this.state.companyCode,this.state.interval, this.state.period);
  }

  toggle() {}

  renderLoadingView() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  updateIndex (selectedIndex) {    
    if(selectedIndex == 0){
      this.setState({ interval:86400, period:'1M'});
    }else if(selectedIndex == 1){
      this.setState({ interval:86400, period:'3M'});
    }else if(selectedIndex == 2){
      this.setState({ interval:86400*6, period:'6M'});
    }else if(selectedIndex == 3){
      this.setState({ interval:86400*6, period:'1Y'});
    }
  }

  render() {
    const buttons = ["1M", "3M", "6M", "1Y"];
    const aveButtons = ["ave:none", "5D", "12D", "70D"];
    const { selectedIndex } = this.state
    return (
      <ScrollView>
        <PricingCard
          color="#4f9deb"
          title={this.state.company.name}
          price={this.state.todays.owarine}
          info={["1 User"]}
          button={{ title: "ADD FAVORITE", icon: "flight-takeoff" }}
        />

        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
        />

        <StockLine
          data={[this.state.points]}
          options={options}
          xKey="x"
          yKey="y"
        />

        <ButtonGroup
          onPress={() => {
            this.setState({ selectedTab: this.updateIndex });
          }}
          buttons={aveButtons}
        />

        <Table
          height={180}
          columnWidth={60}
          columns={columns}
          dataSource={this.state.dataSource}
        />

        <Button
          raised
          icon={{ name: "home", size: 32 }}
          buttonStyle={{ backgroundColor: "#4f9deb", borderRadius: 0 }}
          textStyle={{ textAlign: "center" }}
          title={`Comment`}
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

var array = [
  { date: "7/1/2017", note: "ttttt", gender: "F", age: 25 },
  { date: "7/1/2017", note: "ttttt", gender: "M", age: 27 },
  { date: "7/1/2017", note: "ttttt", gender: "M", age: 23 },
  { date: "7/1/2017", note: "ttttt", gender: "F", age: 28 },
  { date: "7/1/2017", note: "ttttt", gender: "F", age: 30 }
];

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    width: 80
  },
  {
    title: "Note",
    dataIndex: "note",
    width: 280
  }
];

export default UserScreen;
