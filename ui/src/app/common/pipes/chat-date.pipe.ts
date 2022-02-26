import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let date = new Date(value);
    let currentDate = new Date();
    if (date.getDate() == currentDate.getDate()) {
      //return time in 12 hour format
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
    else {
      return date.toLocaleDateString('en-US', {  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    }
  }
}