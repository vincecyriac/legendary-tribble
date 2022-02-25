import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { IndexComponent } from './index/index.component';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { NgScrollbarModule, } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    IndexComponent,
    ChatThreadComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NgScrollbarModule.withConfig({
      visibility : 'hover',
      appearance : 'compact',
   })
  ],
})
export class ChatModule { }
