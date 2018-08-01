import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'

import { NitroSdk } from '../../../nitro.sdk'
import { vars, exitStyles } from '../../styles'
import { MaterialHeader } from '../materialHeader.jsx'
import { ContextMenuService } from '../../services/contextMenuService.js'
import { ListItem } from './listitem.jsx'

export class Lists extends React.Component {
  state = {
    lists: NitroSdk.getLists()
  }
  componentWillMount() {
    NitroSdk.bind('update', this.update)
  }
  componentWillUnmount() {
    NitroSdk.unbind('update', this.update)
  }
  update = () => {
    // we listen to all updates, so the counts also get updated
    this.setState({
      lists: NitroSdk.getLists()
    })
  }
  triggerMenu = e => {
    const items = [
      {
        title: 'Sign Out',
        action: NitroSdk.signOut
      }
    ]
    ContextMenuService.create(e.clientX, e.clientY, 'top', 'right', items)
  }
  createList = () => {
    const list = NitroSdk.addList({ name: 'Untitled List' })
    this.props.history.push('/' + list.id)
  }
  render() {
    const wrapperStyles =
      this.props.transitionState === 'exiting'
        ? [styles.wrapper, styles.wrapperExiting]
        : styles.wrapper
    return (
      <View style={wrapperStyles}>
        <MaterialHeader
          leftIcon="logo"
          h1="NITRO"
          h1Weight="900"
          rightIcon="menu"
          rightAction={this.triggerMenu}
          shadow={false}
        />
        <View style={styles.listWrapper}>
          {this.state.lists.map(list => {
            return (
              <ListItem
                key={list.id}
                id={list.id}
                name={list.name}
                count={list.count}
              />
            )
          })}
          <ListItem
            key="add"
            id="add"
            name="New List"
            onClick={this.createList}
          />
          <ListItem key="logs" id="logs" name="System Logs" />
        </View>
      </View>
    )
  }
}
Lists.propTypes = {
  transitionState: PropTypes.string
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: vars.backColor
  },
  wrapperExiting: {
    ...exitStyles,
    zIndex: -1
  },
  listWrapper: {
    padding: vars.padding / 2
  }
})