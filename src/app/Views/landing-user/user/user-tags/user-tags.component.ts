import { Component,OnInit,OnDestroy } from '@angular/core';
import { User_Tags_Model } from 'src/app/Models/user-tags.model';
import { TagsServiceService } from 'src/app/Services/tags.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

declare var window: any;

@Component({
  selector: 'app-user-tags',
  templateUrl: './user-tags.component.html',
  styleUrls: ['./user-tags.component.css']
})
export class UserTagsComponent implements OnDestroy {

  uid:string | null = "";
  destroy$: any;
  formModal: any;
  selected_tag:string = "";
  has_data:boolean = false;
  is_Editing:boolean = false;
  creating_tag:boolean = false;
  editing_tag:boolean = false;
  update_index:number = 0;

  user_data: User_Tags_Model = {
    uid: '',
    tags: []
  };

  constructor(private tag_service:TagsServiceService, private user_service:UserService){ }

  ngOnInit():void{
    this.uid = this.user_service.get_uid();
    if(this.uid != null){
      this.tag_service.get_user_tags(this.uid).subscribe((data) =>{
          if(data != null){
            this.has_data = true;
            this.user_data = data;
          }
      })
    }

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  add_tags(){
    this.is_Editing = true;
  }

  create_new_tag(){
    if(this.has_data){
      this.creating_tag = true;
    }
    this.formModal.show();
  }

  edit(index:number){
    this.update_index = index;
    this.editing_tag = true;
    let temp:string[] = this.user_data.tags;
    this.selected_tag = temp[index];
    this.formModal.show();
  }

  delete(index:number){
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
        let temp:User_Tags_Model = this.user_data;
        temp.tags.splice(index,1);
        this.tag_service.post_user_tags(temp);
      }
    })
  }

  reset_modal(){
    this.selected_tag = "";
    this.creating_tag = false;
    this.editing_tag = false;
    this.update_index = 0;
  }

  save_tag(){
    if(this.uid != null){
      if(!this.has_data){
        // Check if the space was empty
        if(this.selected_tag != ""){
          let temp = this.user_data;
          temp.uid = this.uid;
          temp.tags.push(this.selected_tag);
          this.tag_service.post_user_tags(temp);
          //Created Msj
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `New tag Created! `,
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          //Empty Msj
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Text is Empty'
          }) 
        }
      }else if(this.has_data && this.creating_tag){
        // Check if not empty
        if(this.selected_tag != ""){
          let temp = this.user_data;
          temp.tags.push(this.selected_tag);
          this.tag_service.post_user_tags(temp);
          // Created Msj 
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `New tag Created! `,
            showConfirmButton: false,
            timer: 1500
          })
        }else{
          //Empty Msj
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Text is Empty'
          }) 
        } 
      }else if(this.has_data && this.editing_tag && !this.creating_tag){
        //Check if empy
        if(this.selected_tag != ""){
          let temp:User_Tags_Model = this.user_data;
          temp.tags[this.update_index] = this.selected_tag;
          this.tag_service.post_user_tags(temp);
          // Created Msj
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Tag Updated! `,
            showConfirmButton: false,
            timer: 1500
          }) 
        }else{
           //Empty Msj 
           Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Text is Empty'
          })
        }
      }
    }
  }
}
