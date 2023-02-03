export const cacheIsValid = (cache: string) => {
  if (
    cache === '' ||
    cache === ' ' ||
    cache === '[]' ||
    cache === '[ ]' ||
    cache === '{}' ||
    cache === '{ }'
  ) {
    return false;
  } else {
    return true;
  }
};
