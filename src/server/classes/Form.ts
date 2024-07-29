
export type OptionType = {id:number, label:string, value:string, selected:boolean | null, hint:null | boolean};
export type PropertyType = {key:string, value:any};
export type HelpType = {
  content:string;
  is_show:boolean;
  api:string;
  icon:any
};

export type ControlType ={
  id?: number,
  tag: "select" | "input" | "input-inline" | "textarea" | "input-key-value" | "group" | "checkbox-group" | "radio" | "checkbox" | "label" | "custom",
  ref_name: string,
  display: string,
  default?: null | string,
  option_api?: null | string,
  properties?: PropertyType[],
  variants?: ({
    ref_name:string,
    controls:ControlType[]
  })[],
  options?: OptionType[],
  children?: ControlType[],
  help?: HelpType | any
  responsive?: number | null
  width?: string | null
  event?:{
    trigger?:string[],
    subscribe?:string[],
  },
  orientation?:string
}

export default class FormConstructor{
  controls: any;
  constructor(){
    this.controls = {};
  }
  createControl(props:ControlType){
    const control = {
      id: Object.keys(this.controls).length + 1,
      ref_name: props.ref_name,
      tag: props.tag,
      display: props.display,
      default: props.default || null,
      option_api: props.option_api || null,
      properties: props.properties || [],
      variants: props.variants || [],
      options: props.options || [],
      children: props.children || [],
      help: props.help || {},
      responsive: props.responsive || null,
      width: props.width || null,
      event: props.event || {},
      orientation: props.orientation || null,
    };

    if(this.controls[props.ref_name]){
      throw new Error(`control ref_name=${props.ref_name} is already existed`)
    };
    
    this.controls[props.ref_name] = control;
    return control;
  }
  updateControl(ref_name:string, update){
    if(!this.controls[ref_name]){
      throw new Error(`control ref_name=${ref_name} is not found`);
    };

    const control = JSON.parse(JSON.stringify(this.controls[ref_name]));

    const newRefName = update.ref_name || ref_name;
    
    Object.keys(update).forEach(key=>{
      control[key] = update[key];
    });

    this.controls[newRefName] = control;

    return control;
  }
  getControls(ctx:string[]){
    return ctx.map(ref=>{
      if(typeof ref == "string"){
        return this.controls[ref];
      } else {
       return ref
     }
   })
    
  }
}


