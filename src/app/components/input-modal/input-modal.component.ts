import { Component, inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-input-modal',
  imports: [
    MatDialogModule, MatButtonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule
  ],
  templateUrl: './input-modal.component.html'
})
export class InputModalComponent {

  constructor(private service: ProductsService, private toastService: ToastService) {}

  readonly dialogRef = inject(MatDialogRef<InputModalComponent>)
  readonly data = inject(MAT_DIALOG_DATA);
  isSubmitting:boolean = false;

  formProduct = new FormGroup({
    id: new FormControl(this.data?.id, Validators.required),
    stock: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(1000)])
  })

  async incrementStock(increment: boolean) {

    this.isSubmitting = true

    if (this.formProduct.invalid) {
      // Marca todos los controles como tocados para que muestren errores
      this.formProduct.markAllAsTouched();
      return;
    }

    const newStock = this.formProduct.value;

    if(increment){
      try {
        await this.service.incrementStock(newStock)
        this.toastService.toastSuccess('Se incremento el stock en ' + newStock.stock + ' cantidades', 'Confirmación')
      }catch(e){
        this.toastService.toastError(String(e), 'Atención')
      }
    }else{

      try {
        await this.service.decrementStock(newStock)
        this.toastService.toastSuccess('Se decremento el stock en ' + newStock.stock + ' cantidades', 'Confirmación')
      }catch(e){
        this.toastService.toastError(String(e), 'Atención')
      }

    }

    this.onNoClick()

  }

  onNoClick() {
    this.dialogRef.close(true)
  }

}
