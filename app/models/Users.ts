import { oid } from "./common";

export class UserType {
_id: oid
email: string
discord: string
name: string

constructor({
    id = {$oid:""},
    email,
    discord = "",
    name = ""
}:{
    id?: oid,
    email: string,
    discord?: string
    name?: string
}){
    this._id = id
    this.email = email
    this.discord = discord
    this.name = name
}
}

