export interface IInputProps{
  type?:string, 
  value?:string|number,
  inputHandler:(event:React.ChangeEvent<HTMLInputElement>)=>void, 
  placeholder?:string, 
  small?:boolean,
  className?:string,
  name?:string
}
