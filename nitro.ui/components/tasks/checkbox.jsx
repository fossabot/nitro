import React from 'react'
import PropTypes from 'prop-types'
import { View, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import checkIcon from '../../../assets/icons/feather/check.svg'
import { vars } from '../../styles.js'

export class Checkbox extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func
  }
  state = {
    active: false
  }
  triggerPressIn = () => {
    this.setState({ active: true })
  }
  triggerPressOut = () => {
    this.setState({ active: false })
    this.props.onClick()
  }
  render() {
    let boxStyles = styles.box
    let boxIconStyles = styles.boxIcon
    if (this.state.active) {
      boxStyles = [styles.box, styles.boxChecked, styles.boxActive]
      boxIconStyles = [styles.boxIcon, styles.boxIconVisible]
    } else if (this.props.checked) {
      boxStyles = [styles.box, styles.boxChecked]
      boxIconStyles = [styles.boxIcon, styles.boxIconVisible]
    }
    return (
      <TouchableWithoutFeedback
        onPressIn={this.triggerPressIn}
        onPressOut={this.triggerPressOut}
      >
        <View style={styles.check}>
          <View style={boxStyles}>
            <Image
              accessibilityLabel="Tick Mark"
              source={checkIcon}
              resizeMode="contain"
              style={boxIconStyles}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
const styles = StyleSheet.create({
  check: {
    width: 2 * vars.padding,
    paddingTop: vars.padding / 2,
    paddingBottom: vars.padding / 2,
    display: 'flex',
    justifyContent: 'center'
  },
  box: {
    marginTop: 2,
    width: vars.padding * 1.5,
    height: vars.padding * 1.5,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: '12px',
    transitionDuration: '50ms',
    transitionTimingFunction: 'ease-in',
    transitionProperty: 'transform'
  },
  boxChecked: {
    backgroundColor: vars.boxColor,
    borderColor: vars.boxColor
  },
  boxActive: {
    transform: [{ scale: 0.9 }],
    backgroundColor: vars.boxColorDark,
    borderColor: vars.boxColorDark
  },
  boxIcon: {
    height: 24,
    visibility: 'hidden'
  },
  boxIconVisible: {
    visibility: 'visible'
  }
})
