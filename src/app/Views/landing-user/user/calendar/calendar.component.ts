import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarDateFormatter } from 'angular-calendar';
import { addMonths, subMonths } from 'date-fns';
import { UserService } from 'src/app/Services/user.service';
import { EventsService } from 'src/app/Services/events.service';
import { User_Events_Model } from '../../../../Models/user_events.model';
import { Event_Model } from 'src/app/Models/event.model';
import { Helper } from 'src/app/Helpers/helper';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

declare var window: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnDestroy, OnInit {

  @ViewChild('t') timepicker!: NgbTimepicker;

  uid:string|null=""
  meridian = true;

  dataReady = false;

  formModal: any;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  cur_date:Date = new Date();

  is_Editing:boolean = false;

  user_events:User_Events_Model={
    uid: '',
    events: []
  }

  selected_date: CalendarMonthViewDay = {
    inMonth: false,
    events: [],
    badgeTotal: 0,
    date: new Date(),
    day: 0,
    isPast: false,
    isToday: false,
    isFuture: false,
    isWeekend: false
  };

  empty_event:Event_Model ={
    event_id: '',
    title: '',
    description: '',
    date: '',
    has_reminder: false,
    reminder: '',
    tags: [],
  }

  datetime:Date = new Date();

  reminder_time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  event_time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };

  reminder_Date: { year: number, month: number, day: number };

  constructor( private tdateFormatter: CalendarDateFormatter, 
               private cdr: ChangeDetectorRef, 
               private datePipe: DatePipe, 
               private user_service:UserService,
               private event_service:EventsService) 
  {
    this.uid = this.user_service.get_uid();
    this.reminder_Date = {year:this.cur_date.getFullYear(),month:this.cur_date.getMonth()-1,day:this.cur_date.getDate()};
  }

  async ngOnInit(){

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );

    this.build_calendar();
    this.dataReady = true;
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  increment(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.cdr.detectChanges();
  }

  decrement(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.cdr.detectChanges();
  }

  dayClicked({ day }: { day: CalendarMonthViewDay }): void {
    this.is_Editing = false;
    this.selected_date = day; 
    this.formModal.show();
  }

  async save_event(){
    console.log(this.user_events.events)
    try {
      // Create event on calendar the calendar UI 
      const randomId: string = uuidv4();
      const new_event: CalendarEvent = {
        id: randomId,
        start: this.selected_date.date,
        end: this.selected_date.date,
        title: this.empty_event.title,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      };
      // If you save the event, Create a new copy of events array and add the new event. 
      this.events = [...this.events, new_event]; 
  
      /* Add event to API*/
      if(this.uid != null){
        this.empty_event.event_id = randomId;
        // Event date with Date and Time
        let formated_event_date:Date = Helper.set_time_to_dates(this.selected_date.date,this.event_time);
        if(this.empty_event.has_reminder){
          // Reminder for the Event
          let formated_reminder_date:Date = Helper.set_time_to_dates(Helper.ngDate_to_Date(this.reminder_Date.year,this.reminder_Date.month,this.reminder_Date.day),this.reminder_time);
          this.empty_event.reminder = formated_reminder_date.toISOString();
        }
        this.empty_event.date = formated_event_date.toISOString();
        this.user_events.uid = this.uid; 
        await this.user_events.events.push(this.empty_event);
        // Post event to API
        this.event_service.post_events_to_API(this.user_events);
        this.reset_empty_event();
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Event created! `,
        showConfirmButton: true,
        confirmButtonText: 'ok'
      }).then((result) => {
        if(result.isConfirmed){
          window.location.reload();
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

  edit_event(){
    try {
      /* Replace in list */
      this.user_events.events.forEach(element => {
          if(element.event_id === this.empty_event.event_id){
            element = this.empty_event;
          }
      });

      /*Replace in UI*/
      this.events.forEach(e =>{
        if(e.id === this.empty_event.event_id){
            e.id = this.empty_event.event_id,
            e.start = Helper.fix_date_ISO(this.empty_event.date),
            e.title = this.empty_event.title
            this.cdr.detectChanges();
        }
      }); 
      this.event_service.post_events_to_API(this.user_events);
      this.reset_empty_event();
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Event edited! `,
        showConfirmButton: true,
        confirmButtonText: 'ok'
      }).then((result) => {
        if(result.isConfirmed){
          window.location.reload();
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

  delete_event() {
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
          /* Replace in UI */
          this.events.forEach(element => {
            if (element.id === this.empty_event.event_id) {
              this.events.splice(this.events.indexOf(element), 1);
            }
          });

          /*Replace in list*/
          this.user_events.events.forEach(element => {
            if (element.event_id === this.empty_event.event_id) {
              this.user_events.events.splice(this.user_events.events.indexOf(element), 1);
            }
          });
          this.event_service.post_events_to_API(this.user_events);
          this.reset_empty_event();
          window.location.reload();
        }
      })
    } catch (e) {
      let asError = e as Error;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: asError.message,
      })
    }
  }

  build_calendar(){
    if(this.uid != null){
      this.event_service.get_user_events(this.uid).subscribe((events) =>{
        if(events != null){
          try {
            this.user_events.uid = events.uid;
            this.user_events.events = events.events;
            this.events = this.build_calendar_events(events.events);
            this.dataReady = true;
            // trigger change detection cycle
            this.cdr.detectChanges();
          } catch (error) {
            console.log(error)
          }
        }
      })
    }
  }

  build_calendar_events(incoming:Event_Model[]):CalendarEvent[]{
    let temp: CalendarEvent[] = []
    incoming.forEach((x) =>{
      let new_event: CalendarEvent = {
        id: x.event_id,
        start: Helper.fix_date_ISO(x.date),
        title: x.title,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      };
      temp = [...temp, new_event];
    })

    return temp;
  }

  async eventClicked({event}: {event: CalendarEvent}) {
    this.is_Editing = true;
    console.log('clicked event', event);
    let event_model_element: Event_Model | undefined = await this.user_events.events.find((p:Event_Model) => p.event_id === event.id);
    console.log(event_model_element);
    if(event_model_element != undefined ){
      this.empty_event = event_model_element;
      this.formModal.show();
    }
  }
  
  getTitle(): string | null {
    return this.datePipe.transform(this.viewDate, 'MMMM y');
  }

  toggleMeridian() {
		this.meridian = !this.meridian;
	}

  reset_empty_event(){
    this.empty_event.event_id = ''
    this.empty_event.title = ''
    this.empty_event.description = ''
    this.empty_event.date = ''
    this.empty_event.has_reminder = false
    this.empty_event.reminder = ''
    this.empty_event.tags = []
  }
}