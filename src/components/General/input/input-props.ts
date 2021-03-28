export interface IInputProps{
  type?:string, 
  value?:string|number,
  inputHandler:(event:React.FormEvent<HTMLInputElement>)=>void, 
  placeholder?:string, 
  small?:boolean,
  className?:string,
  name?:string
}
