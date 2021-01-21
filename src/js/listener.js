export default class Listener {
  constructor() {
    this.listenerList = {};
  }
  on(type, listener) {
    if (type && listener) {
      this.listenerList[type] = this.listenerList[type] ?? [];
      this.listenerList[type].push(listener);
    }
  }
  off(type, listener) {
    if (type && this.listenerList[type]) {
      if (listener && this.listenerList[type].length > 1) {
        this.listenerList[type] = this.listenerList[type].filter((el) => el !== listener);
      } else {
        delete this.listenerList[type];
      }
    }
  }
  fire(type, ...data) {
    if (this.listenerList[type]) {
      return this.listenerList[type].map((el) => el(...data));
    }
  }
  /*get(type, n, ...data) {
    return new Promise((resolve, reject) => {
      if (this.listenerList[type]) {
        this.listenerList[type][n ?? 0](resolve, reject, ...data);
      }
    });
  }*/
  get(type, n, ...data) {
    if (this.listenerList[type]) {
      return this.listenerList[type][n ?? 0](...data);
    }
  }
  has(type) {
    return !!this.listenerList[type];
  }
  once(type, listener) {
    if (listener) {
      const that = this;
      function callback() {
        listener.call(that, ...arguments);
        that.off(type, callback);
      }
      this.on(type, callback);
    }
  }
}

/*component.get("requestData").then((data) => {});
component.on("requestData", (resolve, reject) => {
  resolve(data);
});*/
