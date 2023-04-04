import { Component } from '@angular/core';
import { User_Model } from 'src/app/Models/user.model';
import { UserService } from 'src/app/Services/user.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  cur_user:User_Model={
    id_User: '',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: false
  }

  constructor(private service:UserService) {
    this.cur_user = service.get_current_logged_user();
  }

  logout(){
    this.service.logout();
  }

}
