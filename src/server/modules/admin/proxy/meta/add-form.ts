import Form from "~/server/classes/Form";
import Models from "~/server/db";






export default async function(app_id){
	const FormConstructor = new Form(); 



	const envs = await Models.Envs.findAll({
		raw:true,
		where:{
			app_id:app_id
		}
	});





	//env
FormConstructor.createControl({
  tag:'input-key-value',
  ref_name:'env',
  display:'Environment Variable',
  properties:[{
    key:"name", value:"env"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  },{
    key:"value", value:envs.reduce((accu, iter)=>{
			accu.push({
				key:iter.prop_key,
				value:iter.prop_value
			});
			return accu;
		},[])
  }],

});


//env_group
FormConstructor.createControl({
  tag:'group',
  ref_name:'env_group',
  display:'Environment Variable',
  children:FormConstructor.getControls(["env"])
});


	return FormConstructor.getControls(["env_group"])
};
