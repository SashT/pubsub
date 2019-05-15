import $ from 'jquery';

let instance;

class Hub {
  constructor(debug = false) {
    if (instance) {
      return instance;
    }
    instance = this;
    this._domNode = $('<i/>');
    this.stack = {};
    this.channels = {};
    this.debug = debug;
    this.logger = window.console;
  }

  publish(channel, data = {}) {
    if (typeof this.stack[channel] === 'undefined') {
      this.stack[channel] = [];
    }
    if (!this.channels[channel]) {
      this.stack[channel].push(data);
      if (this.debug) {
        this.logger.warn("Push channel '" + channel + "' to stack", data);
      }
    } else {
      this._pub(channel, data);
    }
  }

  _pub(channel, data) {
    if (this.debug) {
      this.logger.log('Publish to channel "' + channel + '"', data);
    }
    this._domNode.trigger.apply(this._domNode, arguments);
  }

  subscribe(channel, callback, once = false) {
    this.channels[channel] = true;
    if (this.debug) {
      this.logger.log('Subscribed to channel "' + channel + '"');
    }

    let wrapper = (event, data) => {
      if (once) {
        this.unsubscribe(channel, callback);
      }
      return callback.call(this, data, event);
    };

    wrapper.guid = callback.guid = callback.guid || ($.guid ? $.guid++ : $.event.guid++);
    this._domNode.bind(channel + '.app', wrapper);

    if (this.stack[channel]) {
      for (let i in this.stack[channel]) {
        this._pub(channel, this.stack[channel][i]);
      }
      delete this.stack[channel];
    }
  }

  unsubscribe(channel, callback) {
    if (undefined === callback) {
      this._domNode.unbind(channel + '.app');
    } else if (typeof callback == 'function') {
      this._domNode.unbind(channel + '.app', callback);
    } else if (typeof callback == 'object' && callback.type !== undefined) {
      this._domNode.unbind(callback);
    }
  }

  subscribeOnce(channel, callback) {
    return this.subscribe(channel, callback, true);
  }
}

export default Hub;
