import Form from "~/server/classes/Form";

const FormConstructor = new Form(); 
//first_name
FormConstructor.createControl({
  tag:'input',
  ref_name:'first_name',
  display:'First Name',
  properties:[{
    key:"name", value:"first_name"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});
//last_name
FormConstructor.createControl({
  tag:'input',
  ref_name:'last_name',
  display:'Last Name',
  properties:[{
    key:"name", value:"last_name"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});
//username
FormConstructor.createControl({
  tag:'input',
  ref_name:'username',
  display:'Username',
  properties:[{
    key:"name", value:"username"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});
//password
FormConstructor.createControl({
  tag:'input',
  ref_name:'password',
  display:'Password',
  properties:[{
    key:"name", value:"password"
  },{
    key:"type", value:"password"
  },{
    key:"validator", value:"required=true"
  }],
});
//email
FormConstructor.createControl({
  tag:'input',
  ref_name:'email',
  display:'Email',
  properties:[{
    key:"name", value:"email"
  },{
    key:"type", value:"email"
  },{
    key:"validator", value:"required=true"
  }],
});

//role_id
FormConstructor.createControl({
  tag:'select',
  ref_name:'role_id',
  display:'Role ID',
	option_api:"/api/admin/account/options?module=role",
  properties:[{
    key:"name", value:"role_id"
  },{
    key:"placeholder", value:"Select..."
  },{
    key:"validator", value:"required=true"
  }],
});

export default FormConstructor.getControls(["first_name","last_name","username","password","email","role_id"]);
