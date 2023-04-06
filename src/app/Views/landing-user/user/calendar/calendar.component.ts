import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarDateFormatter } from 'angular-calendar';
import { addMonths, subMonths } from 'date-fns';
import { User_Model } from 'src/app/Models/user.model';
import { UserService } from 'src/app/Services/user.service';
import { EventsService } from 'src/app/Services/events.service';
import { User_Events_Model } from '../../../../Models/user_events.model';
import { Event_Model } from 'src/app/Models/event.model';
import { Helper } from 'src/app/Helpers/helper';
declare var window: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnDestroy, OnInit {

  uid:string|null=""

  dataReady = false;

  formModal: any;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

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
    title: '',
    description: '',
    date: '',
    has_reminder: false,
    reminder: '',
    tags: []
  }


  constructor( private tdateFormatter: CalendarDateFormatter, 
               private cdr: ChangeDetectorRef, 
               private datePipe: DatePipe, 
               private user_service:UserService,
               private event_service:EventsService) 
  {
    this.uid = this.user_service.get_uid();
  }

  async ngOnInit(){

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );
    
    this.build_calendar();
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
    this.selected_date = day;
    this.formModal.show();
  }

  /*!!!!!!!!- Needs rework -!!!!!!!*/ 
  save_event(){
    console.log(this.selected_date)
    /* Create event on calendar*/ 
    const new_event: CalendarEvent = {
      start: this.selected_date.date,
      end: this.selected_date.date,
      title: this.empty_event.title,
      color: { primary: '#e3bc08', secondary: '#FDF1BA' },
    };
    this.events = [...this.events, new_event]; // Create a new copy of events array

    /* Add event to API*/
    if(this.uid != null){
      this.empty_event.date = this.selected_date.date.toISOString();
      this.user_events.uid = this.uid; 
      let temp:Event_Model[] = this.user_events.events;
      temp.push(this.empty_event);
      this.user_events.events = temp;
      this.event_service.post_events_to_API(this.user_events);
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
        start: Helper.fix_date_ISO(x.date),
        title: x.title,
        color: { primary: '#e3bc08', secondary: '#FDF1BA' },
      };
      temp = [...temp, new_event];
    })

    return temp;
  }

  eventClicked({event}: {event: CalendarEvent}): void {
    console.log('clicked event', event);
  }
  
  getTitle(): string | null {
    return this.datePipe.transform(this.viewDate, 'MMMM y');
  }

}