/**
 * @file request methods, connected to rpc node
 * @author atom-yang
 */

export default class RequestManager {
  constructor(provider) {
    this.provider = provider;
  }

  static prepareRequest({ requestMethod, method, params = {} }) {
    return {
      method: requestMethod.toUpperCase(),
      url: method,
      params
    };
  }

  setProvider(provider) {
    this.provider = provider;
  }

  send(requestBody) {
    if (!this.provider) {
      return null;
    }

    const payload = RequestManager.prepareRequest(requestBody);
    const result = this.provider.send(payload);

    return result.result;
  }

  sendAsync(requestBody) {
    if (!this.provider) {
      return null;
    }

    const payload = RequestManager.prepareRequest(requestBody);
    return this.provider.sendAsync(payload).then(result => result.result);
  }
}
