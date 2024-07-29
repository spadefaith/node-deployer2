

export default async function LoopService(array, callback){
    let l = array.length;
    let index = 0;
    let cache = [];
    return new Promise((res, rej)=>{
        try {
            function recurse(callback){
                if(index < l){
                    let item = array[index];
                    callback(item, index).then((result)=>{
                        index += 1;
                        cache.push(result);


                        recurse(callback);
                    }).catch(err=>{
                        rej(err);
                    });
                } else {
                    res(cache);
                };
            };recurse(callback);
        } catch(err){
            rej(err);
        }
    });
};