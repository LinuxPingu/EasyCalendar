import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User_Model } from 'src/app/Models/user.model';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

declare var window: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnDestroy {
  users: User_Model[] = [];
  private destroy$ = new Subject<void>();
  formModal: any;

  selected_user:User_Model={
    id_User: '',
    email: '',
    username: '',
    password: '',
    is_Admin: false,
    is_Active: false
  }

  constructor(private service:UserService){ }

  ngOnInit(){
    this.set_user_list(this.service.get_all_users());
    this.service.get_users_obvs().pipe(takeUntil(this.destroy$)).subscribe((users) =>{
      this.set_user_list(users)
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  set_user_list(list:User_Model[]){
    this.users = list;
    console.log(this.users)
  }


  delete(user:User_Model){
    this.selected_user = user;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_user(this.selected_user).subscribe( 
          (doc) => {
            console.log(doc);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `User ${this.selected_user.username} deleted! `,
              showConfirmButton: false,
              timer: 1500
            })
          },
          (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            })
          }
        )
      }
    })
  }

  openFormModal(user:User_Model) {
    this.selected_user = user;
    this.formModal.show();
  }

  saveSomeThing() {
    this.service.update_user(this.selected_user).subscribe( 
      (doc) => {
        console.log(doc);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `User ${this.selected_user.username} updated! `,
          showConfirmButton: false,
          timer: 1500
        })
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      }
    )
    this.formModal.hide();
  }
}
