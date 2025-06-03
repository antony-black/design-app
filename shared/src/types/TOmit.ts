import lodashOmit from 'lodash/omit';

export const TOmit = <TObject extends Object, TKeys extends keyof TObject>(
  obj: TObject,
  keys: TKeys[],
): Omit<TObject, TKeys> => {
  return lodashOmit(obj, keys);
};
