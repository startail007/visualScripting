import Listener from "./listener";

export const completeAssign = (target, ...sources) => {
  sources.forEach((source) => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    Object.getOwnPropertySymbols(source).forEach((sym) => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors, {
      writable: true,
    });
  });
  return target;
};
export const observeDefineProperty = (observe, data, key) => {
  Object.defineProperty(observe, key, {
    get: () => {
      return data[key];
    },
    set: (val) => {
      if (data[key] !== val) {
        const oldVal = data[key];
        data[key] = val;
        observe.listener.fire("change", key, val, oldVal);
      }
    },
    configurable: true,
    enumerable: true,
  });
};
export const observeObj = (data) => {
  const listener = new Listener();
  const observeData = {};
  Object.defineProperty(observeData, "listener", {
    value: listener,
    writable: false,
  });
  Object.defineProperty(observeData, "on", {
    value(type, listener) {
      observeData.listener.on(type, listener);
    },
    writable: false,
  });
  Object.defineProperty(observeData, "off", {
    value(type, listener) {
      observeData.listener.off(type, listener);
    },
    writable: false,
  });
  Object.defineProperty(observeData, "add", {
    value(key, val) {
      data[key] = val;
      observeDefineProperty(observeData, data, key);
      observeData.listener.fire("add", key, val);
    },
    writable: false,
  });
  Object.defineProperty(observeData, "remove", {
    value(key) {
      delete observeData[key];
      delete data[key];
      observeData.listener.fire("remove", key);
    },
    writable: false,
  });
  for (let key in data) {
    observeDefineProperty(observeData, data, key);
  }
  return observeData;
};
