import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { User_Model } from '../../Models/user.model';
import { doc } from 'firebase/firestore';
@Component({
  selector: 'app-landing-user',
  templateUrl: './landing-user.component.html',
  styleUrls: ['./landing-user.component.css']
})
export class LandingUserComponent {

  cur_user:User_Model={
    id_User: '',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: false
  }
  constructor(private service:UserService){
    this.cur_user = service.get_current_logged_user();
  }
}
