import { User_Info_Model } from 'src/app/Models/user-info.model';
import { User_Model } from 'src/app/Models/user.model';

export class Helper{
    /*Checks if all spaces Are filled*/ 
    static isObjectFullyFilled(obj: any): boolean {
        for (const prop in obj) {
            if (obj[prop] === null || obj[prop] === '') {
              console.log(`Property ${prop} is returning null`)
              return false;
            }
          }
          return true;
    }

    static build_user(id:string,email:string,username:string,password:string,isAdmin:boolean,isActive:boolean):User_Model{

      let cur_user:User_Model={
        id_User: '',
        email: '',
        username: '',
        password: '',
        is_Admin: false,
        is_Active: false
      }

      cur_user.id_User =id ;
      cur_user.email = email;
      cur_user.username = username;
      cur_user.password = password;
      cur_user.is_Admin = isAdmin;
      cur_user.is_Active = isActive;
  
      console.log(`Built user ${cur_user.email}`);

      return cur_user;
  }

  static build_user_info(uid:string,name:string,last_name:string,phone:string,bd:string):User_Info_Model{

    let cur_user_info:User_Info_Model={
      id_User: '',
      name: '',
      last_name: '',
      phone: '',
      birthday: ''
    }
      cur_user_info.id_User = uid;
      cur_user_info.name = name;
      cur_user_info.last_name = last_name;
      cur_user_info.phone = phone;
      cur_user_info.birthday = bd;
      console.log(`Built user info ${cur_user_info.id_User}`);
    
      return cur_user_info;
  }

  static fix_date(incoming:Date):Date{
    let fixed:Date = new Date();
    console.log(`Incoming Date: ${incoming.getFullYear}/${incoming.getMonth}/${incoming.getDate}`);

    console.log(`Fixed Date now at: ${fixed}`);

    return fixed;
  }

  static fix_date_ISO(incoming:string):Date{
    let fixed:Date = new Date(incoming);    
    console.log(`Fixed Date now at: ${fixed}`);
    return fixed;
  }

  static ngDate_to_Date(y:number,m:number,d:number):Date{
    let date:Date = new Date();
    date.setDate(d);
    date.setMonth(m);
    date.setFullYear(y);
    console.log(date)
    return date;
  }
}