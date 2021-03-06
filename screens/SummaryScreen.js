import React, { Component } from 'react';
import {View, StyleSheet, Dimensions, Share} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import SummaryTable from './subviews/SummaryTable';
import SummaryDetails from './subviews/SummaryDetails';
import StickyFooter from "./subviews/StickyFooter";
import SummaryStatistics from "./subviews/SummaryStatistics";

let converter = require('json-2-csv');

var {height, width} = Dimensions.get('window');

export default class SummaryScreen extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Details' },
            { key: 'second', title: 'Timestamps' },
            { key: 'third', title: 'Statistics'}
        ],
    };

    navParams = this.props.navigation.state.params;
    csvStringData = null;


    static navigationOptions = {
        title: 'Summary',
        headerStyle: {
            backgroundColor: '#1e90ff',
        },
        headerTintColor: '#fff'
    };

    _setJsonString(data) {
        converter.json2csv(JSON.parse(data), (err, csv) => {
            this.csvStringData = csv;
        });
    }

    _onCancelPressButton() {
        Share.share({
            message: this.csvStringData,
            title: this.navParams.setupData.missionName + '-' + this.navParams.setupData.sessionName + ' Result'
        }, {
            // Android only:
            dialogTitle: 'Share Mission Result'
        })
    }
    _onProceedPressButton() {
        this.props.navigation.navigate("Home");
    }

    render() {
        let footerButtonText = this.navParams.flow === 'library'? "Main Menu" : "End Mission";
        return (
            <View style = {{flex: 1}}>
                <TabView
                    navigationState={this.state}
                    renderScene = {({ route }) => {
                            switch (route.key) {
                            case 'first':
                                return <SummaryDetails setupData = {this.navParams.setupData} navigation = {this.props.navigation} setJsonStringData = {this._setJsonString.bind(this)}/>;
                            case 'second':
                                return <SummaryTable setupData = {this.navParams.setupData} navigation = {this.props.navigation}/>;
                            case 'third':
                                return <SummaryStatistics setupData = {this.navParams.setupData} navigation = {this.props.navigation}/>;
                            default:
                            return null;
                        }
                    }}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            labelStyle={{fontSize: 8 + (width / 100)}}
                            indicatorStyle={{ backgroundColor: 'pink' }}
                        />
                    }
                />
                <StickyFooter cancelFunc = {this._onCancelPressButton.bind(this)} proceedFunc = {this._onProceedPressButton.bind(this)} backVal={"Share Results"} proceedVal={footerButtonText}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});