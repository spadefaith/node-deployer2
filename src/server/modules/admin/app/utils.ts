import Models from "~/server/db";
import workerpool from 'workerpool';
import path from 'node:path';
import { logCache } from '~/server/modules/admin/app/controller';

const PWD = process.env.PWD;
const pool = workerpool.pool(path.join(PWD, 'deploy.js'));

export const removeContainer = async (name)=>{
    console.log(10, name)
    try {
        await new Promise((res, rej) => {
            let error;
            pool
                .exec('remove', [
                    {
                        name:name
                    }
                ])
                .then(function (result) {
                    console.log('Result: ' + result); // outputs 55
                })
                .catch(function (err) {
                    error = err.message;
                })
                .then(function () {
                    pool.terminate(); // terminate all workers when done
                    if (error) {
                        rej(error);
                    } else {
                        res(true);
                    }
                });
        });

        process.chdir(PWD);
    } catch(err){
        process.chdir(PWD);
        console.log(70,err);
    }
}

export const deployContainer = async (app_id)=>{
    const app = await Models.Apps.findOne({
        raw:true,
        where:{
            app_id
        }
    });

    if(!app){
        return;
    }

    const {name, repo, branch, root_path, old_name} = app;

    const envs = (await Models.Envs.findAll({raw:true,where:{app_id:app_id}})).reduce((accu,item)=>{
        accu[item.prop_key] = item.prop_value;
        return accu;
    },{});

    process.chdir(PWD);


    /**
     * make sure to delete the old application if the name is replaced and saved to old_name
     */
    console.log(68,old_name, name)
    if(old_name && old_name != name){
        try {

            await removeContainer(old_name)
        } catch(err){
            console.log(70,err);
        }
    }

    // process.chdir(PWD);

    return await new Promise((res, rej) => {
        let error;
        pool
            .exec('deploy', [
                {
                    root_path:root_path,
                    branch:branch,
                    repo:repo,
                    name:name,
                    envs
                }
            ],{
                on: function (payload) {
                    logCache(name, payload.message.toString());
                },
            })
            .then(function (result) {
                console.log('Result: ' + result); // outputs 55
            })
            .catch(function (err) {
                error = err.message;
            })
            .then(function () {
                pool.terminate(); // terminate all workers when done
                if (error) {
                    rej(error);
                } else {
                    res(true);
                }
            });
    });
}