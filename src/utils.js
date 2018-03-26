'use strict'

import diff from 'arr-diff'

export function noop () { /* nothing */ }

export const transitionGroupProps = {
  tag: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  moveClass: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
}

export function collectProps (props, args) {
  if (props.length === 0 && args[0] && typeof args[0] === 'object') {
    return args[0]
  }

  return props.reduce((propsData, prop, i) => {
    propsData[prop] = args[i]
    return propsData
  }, {})
}

export function isVueConstructor (obj) {
  if (obj != null) {
    const type = typeof obj
    if (type === 'object') {
      return typeof obj.then === 'function' ||
        typeof obj.render === 'function' ||
        typeof obj.template === 'string'
    } else if (type === 'function') {
      return isVueConstructor(obj.options)
    }

    return false
  }
}

export function generateDialogData (props, component) {
  let dialogData

  // eslint-disable-next-line no-return-assign
  return dialogData = {
    props,
    createdCallback: noop,
    component: Promise.resolve(component).then(component => ({
      extends: component.default || component,
      props: diff(['dialogId', 'arguments', ...props], Object.keys(component.props || (component.options && component.options.props) || [])),
      created () {
        // Resolves componentPromise that is created in DialogsWrapper.add()
        dialogData.createdCallback(this)
      },
      methods: {
        $close (data) {
          this.$emit('vue-modal-dialogs:close', data)
        },
        $error (data) {
          this.$emit('vue-modal-dialogs:error', data)
        }
      }
    }))
  }
}
