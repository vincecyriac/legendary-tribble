import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  /* { path: '', component : IndexComponent, children: [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: ':id', component: ChatThreadComponent  },
  ]}, */
  { path: '', component: IndexComponent,pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
