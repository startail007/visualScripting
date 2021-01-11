export const stream = (value) => {
  let _value = value;
  function fun(value) {
    if (arguments.length) {
      _value = value;
    }
    return _value;
  }
  return fun;
};
export const streamFun = (callback) => {
  function fun() {
    if (!fun.lock) {
      fun.lock = true;
      fun.value = callback(...arguments);
    }
    return fun.value;
  }
  fun.lock = false;
  return fun;
};
/*const a = stream(100);
  const b = stream(200);
  const c = stream.fun(() => a() + b());
  const d = stream.fun(() => c() + c());
  console.log(d());*/
