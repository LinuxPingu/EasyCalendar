import { Component,OnInit,OnDestroy } from '@angular/core';
import { System_Tags_Model } from 'src/app/Models/system-tags.model';
import { TagsServiceService } from 'src/app/Services/tags.service.service';
import Swal from 'sweetalert2';

declare var window: any;

@Component({
  selector: 'app-system-tags',
  templateUrl: './system-tags.component.html',
  styleUrls: ['./system-tags.component.css']
})
export class SystemTagsComponent implements OnDestroy {

  data: System_Tags_Model = {
    id: '',
    tags: []
  };
  destroy$: any;
  is_Editing:boolean = false;
  selected_tag:string ='';
  formModal: any;
  creating_new_tag:boolean =false;
  selected_index:number = 0;
  constructor(private tags_service:TagsServiceService) {
    
  }
  
  ngOnInit(): void {
   this.tags_service.get_system_tags().subscribe((data) =>{
    if (data != null) {
    this.data = data;
    this.is_Editing = true;
    }else{
      this.data = data;
    }
    console.log(this.data);
   })

   this.formModal = new window.bootstrap.Modal(
    document.getElementById('myModal')
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  Add_Tags(){
    if(this.data != null){
    this.is_Editing = true;
    }else{
      this.formModal.show();
    }
  }

  edit(index:number){
    this.creating_new_tag = false;
    this.selected_index = index;
    this.selected_tag = this.data.tags[index];
    this.formModal.show();
  }

  delete(index:number){
    try {
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
          this.data.tags.splice(index,1); 
          this.tags_service.post_tags_to_API(this.data);
        }
      })
    } catch (error) {
      let asError = error as Error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: asError.message,
      })
    }
  }

  save_first_tag(){
    let temp:System_Tags_Model = {
      id: 'System',
      tags: []
    };
    console.log(this.creating_new_tag)
    try {
      if(this.selected_tag != "" && this.data === null){
        temp.tags.push(this.selected_tag);
        this.tags_service.post_tags_to_API(temp);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `New tag Created! `,
          showConfirmButton: false,
          timer: 1500
        })
      }else if(this.data != null && this.creating_new_tag){
        let temp:string[] = this.data.tags;
        console.log(temp);
        console.log(this.selected_tag);
        temp.push(this.selected_tag);
        this.data.tags = temp; 
        this.tags_service.post_tags_to_API(this.data);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `New tag Created! `,
          showConfirmButton: false,
          timer: 1500
        })
        this.selected_tag = "";
      }else if(this.data != null && !this.creating_new_tag){
        this.data.tags[this.selected_index] = this.selected_tag;
        this.tags_service.post_tags_to_API(this.data);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Tag information updated! `,
          showConfirmButton: false,
          timer: 1500
        })
      }
    } catch (error) {
      let asError = error as Error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: asError.message,
      })
    }
  }

  create_new_tag(){
    this.creating_new_tag = true;
    this.formModal.show();
  }

  reset_modal(){
    this.creating_new_tag = false;
  }
}
