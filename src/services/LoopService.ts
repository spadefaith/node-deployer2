export default async function LoopService(array, callback) {
  const l = array.length;
  let index = 0;
  const cache = [];

  function recurse(callback, res, rej) {
    if (index < l) {
      const item = array[index];
      callback(item, index)
        .then((result) => {
          index += 1;
          cache.push(result);

          recurse(callback, res, rej);
        })
        .catch((err) => {
          rej(err);
        });
    } else {
      res(cache);
    }
  }

  return new Promise((res, rej) => {
    try {
      recurse(callback, res, rej);
    } catch (err) {
      rej(err);
    }
  });
}
