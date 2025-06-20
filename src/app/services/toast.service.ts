import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastrService) { }

  toastSuccess(message: string, title: string){
    this.toast.success(message, title);
  }

  toastError(message: string, title: string){
    this.toast.error(message, title);
  }

  toastInfo(message: string, title: string){
    this.toast.info(message, title);
  }

  toastWarning(message: string, title: string){
    this.toast.warning(message, title);
  }
}
