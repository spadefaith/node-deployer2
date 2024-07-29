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

//description
FormConstructor.createControl({
  tag:'input',
  ref_name:'description',
  display:'Desc',
  properties:[{
    key:"name", value:"description"
  },{
    key:"type", value:"text"
  },{
    key:"validator", value:"required=true"
  }],
});

export default FormConstructor.getControls(["name","description"]);