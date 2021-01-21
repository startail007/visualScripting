export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
export const bubbleLoop = (obj, fun) => {
  if (obj) {
    let bool = true;
    fun(obj, {
      stopPropagation() {
        bool = false;
      },
    });
    if (bool) {
      bubbleLoop(obj.parent, fun);
    }
  }
};
export const rectCollisionRect = (pos0, size0, pos1, size1) => {
  return (
    pos0[0] <= pos1[0] + size1[0] &&
    pos1[0] <= pos0[0] + size0[0] &&
    pos0[1] <= pos1[1] + size1[1] &&
    pos1[1] <= pos0[1] + size0[1]
  );
};

export const arrayRemove = (array, val, callback) => {
  return array.findIndex((el, index, array) => {
    if (el == val) {
      array.splice(index, 1);
      callback && callback(index);
      return true;
    }
  });
};
