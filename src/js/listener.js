export default class Listener {
  constructor() {
    this.callbackList = {};
  }
  on(type, callback) {
    if (type && callback) {
      this.callbackList[type] = this.callbackList[type] ?? [];
      this.callbackList[type].push(callback);
    }
  }
  off(type, callback) {
    if (type && this.callbackList[type]) {
      if (callback && this.callbackList[type].length > 1) {
        this.callbackList[type] = this.callbackList[type].filter((el) => el !== callback);
      } else {
        delete this.callbackList[type];
      }
    }
  }
  fire(type, ...data) {
    if (this.callbackList[type]) {
      return this.callbackList[type].map((el) => el(...data));
    }
  }
  /*get(type, n, ...data) {
    return new Promise((resolve, reject) => {
      if (this.callbackList[type]) {
        this.callbackList[type][n ?? 0](resolve, reject, ...data);
      }
    });
  }*/
  get(type, n, ...data) {
    if (this.callbackList[type]) {
      return this.callbackList[type][n ?? 0](...data);
    }
  }
  has(type) {
    return !!this.callbackList[type];
  }
  once(type, callback) {
    if (callback) {
      const c = (...data) => {
        callback.call(this, ...data);
        this.off(type, c);
      };
      this.on(type, c);
    }
  }
}

/*component.get("requestData").then((data) => {});
component.on("requestData", (resolve, reject) => {
  resolve(data);
});*/
