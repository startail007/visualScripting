import Listener from "./listener";

export const observable = (value) => {
  let _value = value;
  const listener = new Listener();
  const fun = (...values) => {
    if (values.length) {
      if (_value !== values[0]) {
        const oldVal = _value;
        _value = values[0];
        listener.fire("notification", _value, oldVal);
      }
    }
    return _value;
  };
  fun.notification = (callback) => {
    listener.on("notification", callback);
  };
  fun.unnotification = (callback) => {
    listener.off("notification", callback);
  };
  return fun;
};
