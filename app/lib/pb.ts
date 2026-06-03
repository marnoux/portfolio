import PocketBase from 'pocketbase';

let _pb: PocketBase | null = null;

export function getPb(): PocketBase {
  if (!_pb) _pb = new PocketBase('https://marnoux.fly.dev/_/#/');
  return _pb;
}
