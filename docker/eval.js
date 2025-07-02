const vm = require('vm')
const { parentPort } = require('worker_threads')
const util = require('util')
const randomstring = require('randomstring')
const ChatMessage = require('prismarine-chat')('1.21.3')
const mc = require('minecraft-protocol')
const mineflayer = require('mineflayer')
const moment = require('moment-timezone')
const crypto = require('crypto')
const nbt = require('prismarine-nbt')
const Item = require('prismarine-item')('1.21.3')
const mcData = require('minecraft-data')('1.21.3')
const net = require('net')
const axios = require('axios')
const EventEmitter = require('events')

const BRIDGE_PREFIX = 'function:'
let promiseResolves = {}
const vms = {}

const proxyHandler = {
  get(target, prop) {
    if (!target[prop]) throw new Error(`Function "${prop}" not available`)
    return (...args) => {
      parentPort.postMessage({ type: 'socketEmit', data: [BRIDGE_PREFIX + prop + ':' + target._server, ...args] })
      const uuid = crypto.randomUUID()
      return new Promise((resolve) => {
        promiseResolves[uuid] = resolve
        parentPort.postMessage({ type: 'socketOnce', uuid, name: `functionOutput:${prop}` })
        setTimeout(() => delete promiseResolves[uuid], 10000)
      })
    }
  }
}

// Harden sandbox against prototype bypasses
function hardenContext(context) {
  // Disable dangerous globals
  context.Function = undefined
  context.eval = undefined
  context.constructor = undefined

  // Freeze global object and its prototype
  Object.freeze(Object.prototype)
  Object.freeze(context)
}

parentPort.on('message', (msg) => {
  switch (msg.type) {
    case 'setFunctions': {
      const parsed = JSON.parse(msg.jsonArray)
      const functions = {}

      for (const { name, server } of parsed) {
        if (!functions[server]) functions[server] = {}
        functions[server][name] = (...args) => {
          parentPort.postMessage({ type: 'socketEmit', data: [BRIDGE_PREFIX + name + ':' + server, ...args] })
          const uuid = crypto.randomUUID()
          return new Promise((resolve) => {
            promiseResolves[uuid] = resolve
            parentPort.postMessage({ type: 'socketOnce', uuid, name: `functionOutput:${name}` })
            setTimeout(() => delete promiseResolves[uuid], 10000)
          })
        }
        functions[server][name]._server = server
      }

      for (const server in functions) {
        const sandbox = {
          bridge: new Proxy(functions[server], proxyHandler),
          randomstring,
          ChatMessage,
          mc,
          mineflayer,
          moment,
          crypto,
          nbt,
          Item,
          mcData,
          net,
          axios,
          EventEmitter,
          inspect: (input, options) => util.inspect(input, {
            depth: options?.depth,
            customInspect: false
          }),
        }

        const context = vm.createContext(sandbox)
        hardenContext(context) // 🔐 Add sandbox hardening
        vms[server] = context
      }

      break
    }

    case 'resolvePromise': {
      if (promiseResolves[msg.uuid]) {
        promiseResolves[msg.uuid](msg.data)
        delete promiseResolves[msg.uuid]
      }
      break
    }

    case 'runCode': {
      try {
        const context = vms[msg.server]
        if (!context) break

        const result = vm.runInContext(msg.code, context, { timeout: 1000 })
        parentPort.postMessage({
          type: 'codeOutput',
          output: util.inspect(result),
          error: false
        })
      } catch (err) {
        parentPort.postMessage({
          type: 'codeOutput',
          output: err.toString(),
          error: true
        })
      }
      break
    }
  }
})

process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception in eval worker:\n${err.stack}`)
})
