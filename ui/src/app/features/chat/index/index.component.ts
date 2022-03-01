import { Component, OnInit, ViewChild, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonService } from 'src/app/common/services/common.service';
import { SocketService } from 'src/app/common/services/socket.service';
import { UserService } from 'src/app/common/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit,OnDestroy {

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;

  arrMessages: any = [
   /*  { error: false, userId: 1, message: 'ASA', time: '2022-02-26T09:09:37.150Z', name: 'John' },
    { error: false, userId: 2, message: 'ASA', time: '2022-02-26T09:09:37.150Z', name: 'John' },
    { error: false, userId: 1, message: 'ASA', time: '2022-02-26T09:09:37.150Z', name: 'John' },
    { error: false, userId: 2, message: 'ASA', time: '2022-02-26T09:09:37.150Z', name: 'John' }, */
  ];
  arrActiveUsers: any = [];
  intCurrentUserId !: number;
  private objDestroyed$ = new Subject();

  messageForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  constructor(private socket: SocketService, private common: CommonService, private auth: AuthService, private user: UserService,private modal: NgbModal) {
    this.socket.connect()
    this.subscribeToUpdates();
    this.listenToActiveUsers();
  }

  ngOnInit(): void {
    this.getUserDetails();
  }
  ngOnDestroy() {
    this.objDestroyed$.next()
    this.objDestroyed$.complete()
    this.socket.stopListening('updateMessage');
    this.socket.stopListening('activeUsers');
  }

  getUserDetails() {
    this.user.getCurrentUser().pipe(takeUntil(this.objDestroyed$)).subscribe((data: any) => {
      this.intCurrentUserId = data.id;
    })
  }

  //subscribe to new updates
  subscribeToUpdates() {
    this.socket.listen('updateMessage').pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      if (data.error) {
        this.common.showError("Please login again");
        this.auth.logOut();
      } else {
        this.arrMessages.push(data);
        this.scrollToBottom()
      }
    })
  }

  //listen to active user event
  listenToActiveUsers() {
    this.socket.listen('activeUsers').pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      this.arrActiveUsers = data;
    })
  }

  sendMessage(form: any) {
    // this.socket.emit('newMessage', form.value.message);
    this.user.sendMessage(form.value.message).pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      this.messageForm.reset();
    },
      (error) => {
        this.common.showError("Something went wrong");
      }
    )
  }

  scrollToBottom() {
    setTimeout(() => {
      this.componentRef?.directiveRef?.scrollToBottom(0, 500);  
    }, 1);
  }

  scrolledToTop() {
    console.log('scrolled to top');    
  }

  logOut() {
    this.modal.dismissAll();
    this.auth.logOut();
  }
  openModal(modal:any){
    this.modal.open(modal, { size: 'sm',});    
  }

}

