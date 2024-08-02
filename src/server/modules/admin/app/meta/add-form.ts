import Form from "~/server/classes/Form";

const FormConstructor = new Form(); 
//name
FormConstructor.createControl({
  tag:'input',
  ref_name:'name',
  display:'Name',
  properties:[{
    key:"name", value:"name"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});

//provider
FormConstructor.createControl({
  tag:'select',
  ref_name:'provider',
  display:'Provider',
  properties:[{
    key:"name", value:"provider"
  },{
    key:"type", value:"text"
  },{
    key:"placeholder", value:"Select..."
  },{
    key:"validator", value:"required=true"
  }],
  options:[{
    id:1,label:'github',value:'github',selected:null, hint:null
  },{
    id:2,label:'bitbucket',value:'bitbucket',selected:null, hint:null
  },{
    id:3,label:'gitlab',value:'gitlab',selected:null, hint:null
  }]
});
//repo
FormConstructor.createControl({
  tag:'textarea',
  ref_name:'repo',
  display:'Repo',
  properties:[{
    key:"name", value:"repo"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});
//branch
FormConstructor.createControl({
  tag:'input',
  ref_name:'branch',
  display:'Branch',
  properties:[{
    key:"name", value:"branch"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
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
  }],
});

//domain
FormConstructor.createControl({
  tag:'input',
  ref_name:'domain',
  display:'Domain',
  properties:[{
    key:"name", value:"domain"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});

//env_group
FormConstructor.createControl({
  tag:'group',
  ref_name:'env_group',
  display:'Environment Variable',
  children:FormConstructor.getControls(["env"])
});





export default FormConstructor.getControls(["name","provider","repo","branch","domain","env_group"]);
