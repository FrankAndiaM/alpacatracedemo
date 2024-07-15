export function renderModelValue(value: any): string {
  let str: string = '';
  if (Array.isArray(value)) {
    str = value?.map((data: any) => data?.value ?? data).join(', ');
    return str;
  }
  if (typeof value === 'string') {
    str = value;
    return str;
  }
  if (typeof value === 'number') {
    str = `${value}`;
    return str;
  }
  if (typeof value === 'object') {
    str = value?.value;
    return str;
  }
  return str;
}
export function renderYarnsCode(yarns: any[]): string {
  let str: string = '';
  if (yarns.length > 0) {
    const arr = yarns.map((element: any) => element?.code ?? '');
    if (arr && arr.length > 0) {
      str = arr.join(', ');
    }
  }
  return str;
}
