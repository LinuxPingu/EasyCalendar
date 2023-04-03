import { Component } from '@angular/core';
import { User } from 'firebase/auth';
import { UserService } from 'src/app/Services/user.service';
import { User_Model } from '../../Models/user.model';
import { user } from '@angular/fire/auth';
@Component({
  selector: 'app-landing-user',
  templateUrl: './landing-user.component.html',
  styleUrls: ['./landing-user.component.css']
})
export class LandingUserComponent {

  private cur_user:User_Model={
    id_User: '',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: false
  }

  constructor(private service:UserService){
    this.service.refersh_auth();
    this.service.get_user_by_UID().subscribe(
      doc =>{
        if(doc != null){
          this.build_user(doc.id_User,doc.email,doc.username,doc.password,doc.is_Admin,doc.is_Active)
        }
      }
    )
  }

  build_user(id:string,email:string,username:string,password:string,isAdmin:boolean,isActive:boolean){
    this.cur_user.id_User =id ;
    this.cur_user.email = email;
    this.cur_user.username = username;
    this.cur_user.password = password;
    this.cur_user.is_Admin = isAdmin;
    this.cur_user.is_Active = isActive;

    console.log(`Built user ${this.cur_user.email}`);
  }


  logout(){
    this.service.logout();
  }
}
