export function generateUUID() {
  const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  const hexDigits = '0123456789abcdef';
  const allowY = '89ab';
  const uuid = pattern.replace(/[xy]/g, (char) => {
    if (char === 'y') {
      return allowY.charAt(Math.floor(Math.random() * allowY.length));
    }
    return hexDigits.charAt(Math.floor(Math.random() * hexDigits.length));
  });
  return uuid;
}

export function makeId(length: number = 6) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function toSlug(s: string) {
  return s
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') //remove diacritics
    .toLowerCase()
    .replace(/\s+/g, '-') //spaces to dashes
    .replace(/&/g, '-and-') //ampersand to and
    .replace(/[^\w\-]+/g, '') //remove non-words
    .replace(/\-\-+/g, '-') //collapse multiple dashes
    .replace(/^-+/, '') //trim starting dash
    .replace(/-+$/, ''); //trim ending dash
}
