import EventEmitter from 'eventemitter3';
import {v4 as randomUUID} from 'uuid';

export class MessageChannel extends EventEmitter {
  _channelKey: string;
  constructor(channelKey: string) {
    super();

    if (!channelKey) throw 'No channel scope provided';

    this._channelKey = channelKey;
    this._registerEventListener();
  }

  _registerEventListener() {
    window.addEventListener('message', ({data: {isAuro = false, message, source}}) => {
      if (!isAuro || (!message && !source)) return;

      if (source === this._channelKey) return;

      const {action, data} = message;

      this.emit(action, data);
    });
  }

  send(action: string, data = {}) {
    if (!action) return {success: false, error: 'Function requires action {string} parameter'};

    window.postMessage(
      {
        message: {
          action,
          data,
        },
        source: this._channelKey,
        isAuro: false,
      },
      '*',
    );
  }
}

interface response {
  error: Error;
  result: unknown;
}

export class Messenger {
  registeredMessage: {
    [key: string]: {resolve: (res: response) => void; reject: (res: response) => void};
  };
  channel: MessageChannel;
  constructor(channel: MessageChannel) {
    this.channel = channel;
    this.registeredMessage = {};
    this.initListener();
  }

  initListener() {
    this.channel.on('messageFromWallet', ({error, result, id}) => {
      if (!error) this.registeredMessage[id].resolve(result);
      else this.registeredMessage[id].reject(error);

      delete this.registeredMessage[id];
    });
  }

  send(action: string, params = {}): Promise<{result: unknown; error: Error}> {
    const id = randomUUID();
    this.channel.send('messageFromWeb', {
      action,
      payload: {
        params,
        id,
        site: {
          origin: window.location.origin,
          // webIcon: getSiteIcon(window),
        },
      },
    });

    return new Promise((resolve, reject) => {
      this.registeredMessage[id] = {
        resolve,
        reject,
      };
    });
  }
}
