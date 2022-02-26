import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService) { }

  showSuccess(message: string) {
    this.toastr.success(message)
  }
  showError(message: string) {
    this.toastr.error(message);
  }
  showWarning(message: string) {
    this.toastr.warning(message);
  }
}
