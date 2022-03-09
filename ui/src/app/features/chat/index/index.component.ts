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

  @ViewChild('threadScroll', { static: false }) componentRef?: PerfectScrollbarComponent;

  arrMessages: any = [];
  arrConversations: any = [];
  arrActiveUsers: any = [];
  strCurrentUserId !: string;
  strCurrentConvId!: string;
  strCurrentConvName!: string;
  blnSpinner: boolean = true;
  private objDestroyed$ = new Subject();
  audio: any;

  messageForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  constructor(private socket: SocketService, private common: CommonService, private auth: AuthService, private user: UserService, private modal: NgbModal) {
    this.socket.connect()
    this.subscribeToUpdates();
  }

  async ngOnInit(): Promise<void> {
    await this.getUserDetails();
    this.getAllConversations();
    this.audio = new Audio();
    this.audio.src = '../../../../assets/Notification.mp3';
    this.audio.load();


  }
  ngOnDestroy() {
    this.objDestroyed$.next()
    this.objDestroyed$.complete()
    this.socket.stopListening('updateMessage');
    this.socket.stopListening('activeUsers');
  }


  getAllConversations() {
    this.user.getConversations().pipe(takeUntil(this.objDestroyed$)).subscribe((res: any) => {
      this.arrConversations = res;
      this.selectConversation(this.arrConversations[0]);
    })
  }

  selectConversation(conv: any) {
    if (this.strCurrentConvId == conv._id) {
      return;
    }
    this.arrMessages = [];
    this.blnSpinner = true;
    this.strCurrentConvId ? this.socket.emit('leave', this.strCurrentConvId) : '';
    this.strCurrentConvId = conv._id;
    this.socket.emit('join', conv._id);
    this.strCurrentConvName = conv.group == 0 ? this.getEffectiveUserName(conv.users) : conv.groupName;
    this.getAllMessages()
  }

  getAllMessages() {
    this.user.getMessages(this.strCurrentConvId).pipe(takeUntil(this.objDestroyed$)).subscribe((res: any) => {
      this.arrMessages = res[0].messages;
      this.scrollToBottom(0);
      this.blnSpinner = false;
    })
  }

  getUserDetails() {
    this.user.getCurrentUser().pipe(takeUntil(this.objDestroyed$)).subscribe((data: any) => {
      this.strCurrentUserId = data.id;
    })
  }

  //subscribe to new updates
  subscribeToUpdates() {
    this.socket.listen('updateMessage').pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      if (this.strCurrentUserId !== data.sender._id) {
        this.audio.play();
      }
      this.arrMessages.push(data);
      this.sortConv(data.conv_id);
      this.scrollToBottom(500)
    })
  }

  sendMessage(form: any) {
    const messageData = {
      message: form.value.message,
      conv_id: this.strCurrentConvId,
    }
    this.user.sendMessage(messageData).pipe(takeUntil(this.objDestroyed$)).subscribe((data) => {
      this.messageForm.reset();
    },
      (error) => {
        this.common.showError("Something went wrong");
      }
    )
  }

  scrollToBottom(time: number) {
    setTimeout(() => {
      this.componentRef?.directiveRef?.scrollToBottom(0, time);
    }, 1);
  }

  logOut() {
    this.modal.dismissAll();
    this.auth.logOut();
  }

  openModal(modal: any) {
    this.modal.open(modal, { size: 'sm', });
  }

  getEffectiveUserName(users: any) {
    if (users[0]._id == this.strCurrentUserId) {
      return users[1].name;
    }
    return users[0].name;
  }

  sortConv(conv_id: any) {
    //find index of element with _id as conv_id
    const index = this.arrConversations.findIndex((x: any) => x._id == conv_id);
    this, this.arrConversations[index].lastUpdate = new Date();
    //shift element to the top
    this.arrConversations.unshift(this.arrConversations.splice(index, 1)[0]);

  }

}

