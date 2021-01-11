import { Float } from "./float";
export class Vector {
  static normalize(vector) {
    const len = Vector.length(vector);
    if (len) {
      return Vector.scale(vector, 1 / Vector.length(vector));
    }
    return vector;
  }
  static rotate(vector, angle) {
    const cos0 = Math.cos(angle);
    const sin0 = Math.sin(angle);
    return [vector[0] * cos0 - vector[1] * sin0, vector[1] * cos0 + vector[0] * sin0];
  }
  static dot(vector0, vector1) {
    return vector0[0] * vector1[0] + vector0[1] * vector1[1];
  }
  static cross(vector0, vector1) {
    return vector0[0] * vector1[1] - vector0[1] * vector1[0];
  }
  static add(vector0, vector1) {
    return [vector0[0] + vector1[0], vector0[1] + vector1[1]];
  }
  static sub(vector0, vector1) {
    return [vector0[0] - vector1[0], vector0[1] - vector1[1]];
  }
  static projection(vector0, vector1) {
    var rate = Vector.dot(vector0, vector1) / Vector.dot(vector1, vector1);
    return [vector1[0] * rate, vector1[1] * rate];
  }
  static length(vector) {
    return Math.sqrt(Vector.dot(vector, vector));
  }
  static mul(vector0, vector1) {
    return [vector0[0] * vector1[0], vector0[1] * vector1[1]];
  }
  static div(vector0, vector1) {
    return [vector0[0] / vector1[0], vector0[1] / vector1[1]];
  }
  static scale(vector, scale) {
    return [vector[0] * scale, vector[1] * scale];
  }
  static collisionCalc(vector0, vector1, mass0, mass1) {
    return Vector.scale(
      Vector.add(Vector.scale(vector0, mass0 - mass1), Vector.scale(vector1, 2 * mass1)),
      1 / (mass0 + mass1)
    );
  }
  static getAngle(vector) {
    return Math.atan2(vector[1], vector[0]);
  }

  static floor(vector) {
    return [Math.floor(vector[0]), Math.floor(vector[1])];
  }
  static fract(vector) {
    return [Float.fract(vector[0]), Float.fract(vector[1])];
  }
  static sin(vector) {
    return [Math.sin(vector[0]), Math.sin(vector[1])];
  }
  static cos(vector) {
    return [Math.cos(vector[0]), Math.cos(vector[1])];
  }
  static distance(vector0, vector1) {
    return Vector.length(Vector.sub(vector1, vector0));
  }
  static mix(vector0, vector1, rate) {
    return [Float.mix(vector0[0], vector1[0], rate), Float.mix(vector0[1], vector1[1], rate)];
  }
  static abs(vector) {
    return [Math.abs(vector[0]), Math.abs(vector[1])];
  }
  static getLine(vector0, vector1) {
    return { pos: vector0, dir: Vector.sub(vector1, vector0) };
  }

  static min(vector0, vector1) {
    return [Math.min(vector0[0], vector1[0]), Math.min(vector0[1], vector1[1])];
  }
  static max(vector0, vector1) {
    return [Math.max(vector0[0], vector1[0]), Math.max(vector0[1], vector1[1])];
  }
  /*static refraction(vector, f, n) {
    //var fn = f.normalize();
    let fn = Vector.normalize(f);
    //var fnv = fn.swap();
    let fnv = [-fn[1], fn[0]];
    let n0 = n;
    //var temp = this.sub(this.projection(fn)).cross(fn);
    let temp = Vector.cross(Vector.sub(vector, Vector.projection(vector, fn)), fn);
    if (temp > 0) {
      //fn = fn.scale(-1);
      fn = Vector.scale(fn, -1);
      //fnv = fn.swap();
      fnv = [-fn[1], fn[0]];
    }
    //var v0_u = this.projection(fn);
    let v0_u = Vector.projection(vector, fn);
    //var v0_v = this.sub(v0_u);
    let v0_v = Vector.sub(vector, v0_u);

    //var v0_temp = new createjs.vector(v0_u.length(), v0_v.length());
    let v0_temp = [Vector.length(v0_u), Vector.length(v0_v)];
    //var s = (n0 * (v0_u.cross(fnv) > 0 ? 1 : -1) * v0_temp.x) / v0_temp.length();
    let s = (n0 * (Vector.cross(v0_u, fnv) > 0 ? 1 : -1) * v0_temp.x) / Vector.length(v0_temp);
    if (Math.abs(s) >= 1) {
      return null;
    }
    //var v1_temp = new createjs.vector(s, Math.sqrt(1 - s * s));
    let v1_temp = [s, Math.sqrt(1 - s * s)];
    //var v1 = new createjs.vector(v1_temp.x * fn.x + v1_temp.y * fnv.x, v1_temp.x * fn.y + v1_temp.y * fnv.y);
    let v1 = [v1_temp.x * fn.x + v1_temp.y * fnv.x, v1_temp.x * fn.y + v1_temp.y * fnv.y];
    return v1;
  }*/
}
export class VectorE {
  static set(vector, x, y) {
    vector[0] = x;
    vector[1] = y;
    return vector;
  }
  static normalize(vector) {
    const len = Vector.length(vector);
    if (len) {
      VectorE.scale(vector, 1 / len);
    }
    return vector;
  }
  static add(vector0, vector1) {
    vector0[0] += vector1[0];
    vector0[1] += vector1[1];
    return vector0;
  }
  static sub(vector0, vector1) {
    vector0[0] -= vector1[0];
    vector0[1] -= vector1[1];
    return vector0;
  }
  static scale(vector, scale) {
    vector[0] *= scale;
    vector[1] *= scale;
    return vector;
  }
  static rotate(vector, angle) {
    const cos0 = Math.cos(angle);
    const sin0 = Math.sin(angle);
    [vector[0], vector[1]] = [vector[0] * cos0 - vector[1] * sin0, vector[1] * cos0 + vector[0] * sin0];
    return vector;
  }
}
export const getQuadraticCurveTo = (vector0, vector1, vector2, t) => {
  const x = vector0[0] * (1 - t) * (1 - t) + 2 * vector1[0] * (1 - t) * t + vector2[0] * t * t;
  const y = vector0[1] * (1 - t) * (1 - t) + 2 * vector1[1] * (1 - t) * t + vector2[1] * t * t;
  return [x, y];
};
export const getQuadraticCurveToTangent = (vector0, vector1, vector2, t) => {
  const x = 2 * t * (vector0[0] - vector1[0] * 2 + vector2[0]) + 2 * (-vector0[0] + vector1[0]);
  const y = 2 * t * (vector0[1] - vector1[1] * 2 + vector2[1]) + 2 * (-vector0[1] + vector1[1]);
  return [x, y];
};
