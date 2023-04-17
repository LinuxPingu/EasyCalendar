export interface Event_Model{
    event_id:string,
    title:string,
    description:string,
    date:string,
    has_reminder:boolean,
    reminder:string,
    tags:string[]
}