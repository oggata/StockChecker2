import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import * as Colors from "../../themes/colors";
import * as ducks from "../../ducks";
import { connect } from "react-redux";
import { ScrollView } from "react-native";

import {
  Button,
  SideMenu,
  Menu,
  List,
  ListItem,
  ButtonGroup,
  SearchBar,
  CheckBox
} from "react-native-elements";

var api = {
  getCompanies() {
    var url = "https://oggata.github.io/stockchecker/sample/api-001.json";
    return fetch(url).then(res => res.json());
  },

  getPrices() {
    var url =
      "https://www.google.com/finance/getprices?q=AAPL&x=NASDAQ&i=86400&p=1M&f=d,c,v,o,h,l&df=cpct&auto=1&ts=1489550582260&ei=4rrIWJHoIYya0QS1i4IQ";
    return fetch(url).then(res => res.text());
  }
};

class HomeScreen extends Component {
  logout() {
    const { updateCurrentUser } = this.props;
    updateCurrentUser({});
    console.log("logout");
  }

  constructor(props) {
    super(props);
    this.state = { loading: false, movies: [] };
  }

  componentWillMount() {
    api.getCompanies().then(res => {
      this.setState({
        movies: res.companies
      });
    });
  }

  renderMovies() {
    return this.state.movies.map(movie =>
      <MovieDetail key={movie.title} record={movie} />
    );
  }

  render() {
    return (
      <View>
        <View>
          <SearchBar lightTheme onChangeText="aaa" placeholder="Type Here..." />
          <ScrollView>
            <List>
              {this.state.movies.map((item, i) =>
                <ListItem
                  key={i}
                  title={item.name}
                  subtitle={item.market}
                  icon={{ name: item.icon }}
                  onPress={() =>
                    this.props.navigation.navigate("UserScreen", item)}
                />
              )}
            </List>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btnSubmit: {
    justifyContent: "center",
    padding: 10,
    flexDirection: "row"
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5
  }
});

const mapStateToProps = store => ({
  currentUser: store.currentUser
});

const mapDispatchToProps = {
  updateCurrentUser: ducks.updateCurrentUser
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
