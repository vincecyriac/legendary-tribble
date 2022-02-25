import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { SocketService } from 'src/app/common/services/socket.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @ViewChild(NgScrollbar) scrollable!: NgScrollbar;
  arrMessages: any = [
    { self: true, message: 'hello john', name: 'vince' },
    { self: false, message: 'hi vince', name: 'john' },
    { self: true, message: 'how are you', name: 'vince' },
    { self: false, message: 'am fine and you?', name: 'john' },
    { self: true, message: 'same here', name: 'vince' }
  ];

  constructor(private socket: SocketService) {
    this.subscribeToUpdates();
  }

  ngOnInit(): void {
  }

  //subscribe to new updates
  subscribeToUpdates() {
    this.socket.listen('updateMessage').subscribe((data) => {
      this.arrMessages.push(data);
      console.log(this.arrMessages);

      // this.scrollToBottom();
      this.scrollable?.scrollTo({ bottom: 0, end: 0 });
    })
  }

  sendMessage(message: string) {
    this.socket.emit('newMessage', message);
  }

  scrollToBottom() {
    this.scrollable?.scrollTo({ bottom: 0, end: 0, duration: 0 });
  }

}
