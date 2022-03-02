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
export class IndexComponent implements OnInit, OnDestroy {

  @ViewChild(PerfectScrollbarComponent, { static: false }) componentRef?: PerfectScrollbarComponent;

  arrMessages: any = [];
  arrActiveUsers: any = [];
  intCurrentUserId !: number;
  blnSpinner: boolean = true;
  private objDestroyed$ = new Subject();

  messageForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  constructor(private socket: SocketService, private common: CommonService, private auth: AuthService, private user: UserService, private modal: NgbModal) {
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

  getAllMessages() {
    this.user.getMessages().pipe(takeUntil(this.objDestroyed$)).subscribe((res: any) => {
      this.arrMessages = res;
      this.scrollToBottom();
    })
  }

  getUserDetails() {
    this.user.getCurrentUser().pipe(takeUntil(this.objDestroyed$)).subscribe((data: any) => {
      this.intCurrentUserId = data.id;
      this.getAllMessages();
    })
  }

  //subscribe to new updates
  subscribeToUpdates() {
    this.socket.listen('updateMessage').pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      this.arrMessages.push(data);
      console.log(data);
      this.scrollToBottom()
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
    setTimeout(() => {
      this.blnSpinner = false;
    }, 1000);
  }

  scrolledToTop() {
    console.log('scrolled to top');
  }

  logOut() {
    this.modal.dismissAll();
    this.auth.logOut();
  }
  openModal(modal: any) {
    this.modal.open(modal, { size: 'sm', });
  }

}

