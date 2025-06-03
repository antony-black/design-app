import lodashPick from 'lodash/pick';

export const TPick = <TObject extends Object, TKeys extends keyof TObject>(
  obj: TObject,
  keys: TKeys[],
): Pick<TObject, TKeys> => {
  return lodashPick(obj, keys);
};
