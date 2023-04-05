import { Component, OnInit , OnDestroy } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { User_Info_Model } from 'src/app/Models/user-info.model';
import { User_Model } from 'src/app/Models/user.model';
import { Helper } from 'src/app/Helpers/helper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  cur_user:User_Model={
    id_User: '',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: false
  }

  user_info:User_Info_Model={
    id_User: '',
    name: '',
    last_name: '',
    phone: '',
    birthday: ''
  }

  selectedDate: { year: number, month: number, day: number };

  has_info:Boolean = false;
  editing:Boolean = false;

  constructor(private service:UserService ) {
    let cur_date:Date = new Date();
    this.service.refersh_auth();
    this.cur_user = service.get_current_logged_user();
    this.selectedDate = {year:cur_date.getFullYear(),month:cur_date.getMonth()-1,day:cur_date.getDate()};

    this.service.get_current_user_info().then(
      (info) => {
        let temp:User_Info_Model|null = info;
        console.log(temp)
        if(temp != null){
          if(temp.id_User != ""){
            this.editing = true;
            this.user_info = temp;
            this.has_info = true
            cur_date = Helper.fix_date_ISO(this.user_info.birthday);
            this.selectedDate = {year:cur_date.getFullYear(),month:cur_date.getMonth(),day:cur_date.getDate()};
            console.log(this.user_info);
          }else{
            this.has_info = false;
            this.editing = false;
          }
        }
      },
      (error) => {
        let asError = error as Error;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: asError.message,
        })
      }
    );
  }
  
  async get_user_values(){
    await this.service.get_current_user_info();  
  }

  save_changes() {
    this.user_info.birthday = Helper.ngDate_to_Date(this.selectedDate.year, this.selectedDate.month, this.selectedDate.day).toISOString();
    this.user_info.id_User = this.cur_user.id_User;

    if(Helper.isObjectFullyFilled(this.user_info)){
      if (!this.has_info) {
        try {
          this.service.post_user_info_to_API(this.user_info);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `User information created! `,
            showConfirmButton: false,
            timer: 1500
          })
        } catch (error) {
          let asError = error as Error;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: asError.message,
          })
        }
      } else {
        try {
          this.service.update_user_info(this.user_info).subscribe( 
            (doc) => {
              console.log(doc);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `User information updated! `,
                showConfirmButton: false,
                timer: 1500
              })
            },
            (error) => {
              let asError = error as Error;
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: asError.message,
              })
            }
          )
           
        } catch (error) {
          let asError = error as Error;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: asError.message,
          })
        }
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Not all spaces are filled',
      })
    }
  }

  update(){
    this.editing = true; 
  }
}
