import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './common/guards/auth.guard';
import { NoAuthGuard } from './common/guards/no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo : 'login', pathMatch : 'full'},
  { path: 'chat', loadChildren: ()=> import('./features/chat/chat.module').then(m => m.ChatModule), canActivate: [AuthGuard] },
  { path: 'login', loadChildren: ()=> import('./auth/auth.module').then(m => m.AuthModule), canActivate: [NoAuthGuard] },
  { path: '**', redirectTo : 'login', pathMatch : 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
