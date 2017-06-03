import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  View,
  Text,
  ListView,
  ActivityIndicator,
  Button
} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import * as Styles from '../styles'
import Screen from './Screen'

export default class ListScreen extends Screen {

  constructor(props) {
    super(props)
    this._onRetryPressed = this.onRetryPressed.bind(this)
    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = { dataSource }
  }

  onData(type, data) {
    this.updateData(data)
  }

  onRetryPressed() {
    this.retrieveData()
  }

  componentDidMount() {
    this.retrieveData()
  }

  renderError(error = {}) {
    return (<View style={this.styles.containers.main}>
      <Text> { error.message || "" } </Text>
        <Button
          onPress={this._onRetryPressed}
          title="Retry"
        />
      </View>)
  }

  renderProgress() {
    return (<View style={this.styles.containers.main}>
      <ActivityIndicator
        animating={true}
        style={{height: 120}}
        size="small"/>
    </View>)
  }

  updateData(data) {
    if (!data) {
      // Forget invalid data fetches
      return
    }
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(data)})
  }

  onItemPressed(data, section) {
    this.transitions.showDetails(data)
  }

  dataItem(item) {
    return ({title: item.title,
            leftIcon: {name: 'done'}})
  }

  renderDataItem(item, section) {
    const dataItem = this.dataItem(item)
    return (<ListItem
        key={section}
        onPress={this.onItemPressed.bind(this, item, section)}
        {...dataItem}
      />)
  }

  renderData() {
      return (<List containerStyle={styles.container}>
        <ListView
          renderRow={this.renderDataItem.bind(this)}
          dataSource={this.state.dataSource}
        />
      </List>)
  }

  render() {
    if (this.hasError()) {
      return this.renderError()
    }

    if (this.hasData()) {
      return this.renderData()
    }

    return this.renderProgress()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0
  }
})