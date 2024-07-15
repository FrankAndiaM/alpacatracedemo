export function flattenObject(obj: any): any {
  const result: any = {};

  function recurse(cur: any, prop: string): void {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      // eslint-disable-next-line prefer-const
      let l: number = 0;
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
      }
      if (l === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }

  recurse(obj, '');
  return result;
}
