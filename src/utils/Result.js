const ResultType = {
  ok: 'ok',
  error: 'error',
};

class ResultConstructor {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  ok(fn) {
    if (this.isError()) {
      return ResultConstructor.createError(this.value);
    }
    return ResultConstructor.createOk(fn(this.value));
  }

  error(fn) {
    if (this.isError()) {
      return ResultConstructor.createError(fn(this.value));
    }
    return ResultConstructor.createOk(this.value);
  }

  static createOk(value) {
    return new ResultConstructor(ResultType.ok, value);
  }

  static createError(value) {
    return new ResultConstructor(ResultType.error, value);
  }

  isOk() {
    return this.type === ResultType.ok;
  }

  isError() {
    return this.type === ResultType.error;
  }
}

export const Result = {
  ok(value) {
    return ResultConstructor.createOk(value);
  },
  error(value) {
    return ResultConstructor.createError(value);
  },
};

export function isResult(value) {
  return value instanceof ResultConstructor;
}
