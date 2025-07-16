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
  selector: 'app-product-modal',
  imports: [
    MatDialogModule, MatButtonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule
  ],
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent {

  constructor(private service: ProductsService, private toastService: ToastService) {}

  readonly dialogRef = inject(MatDialogRef<ProductModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA)

  isSubmitting: boolean = false

  formProduct = new FormGroup({
    id: new FormControl(this.data?.id ?? null),
    name: new FormControl(this.data?.name ?? '', Validators.required),
    price: new FormControl(this.data?.price ?? null, [Validators.required, Validators.min(0)]),
    stock: new FormControl(this.data?.stock ?? null, [Validators.required, Validators.min(0), Validators.max(1000)]),
    deleted: new FormControl(this.data?.deleted ?? false),
  })

  onNoClick(flag?: boolean) {
    this.dialogRef.close(flag);
  }

  async addProduct() {
    this.isSubmitting = true

    if (this.formProduct.invalid) {
      // Marca todos los controles como tocados para que muestren errores
      this.formProduct.markAllAsTouched();
      return;
    }

    const newProduct = this.formProduct.value;

    try {

      if(!this.data?.id){
        await this.service.addProduct(newProduct)
        this.isSubmitting = false
        this.toastService.toastSuccess('Se agregó el producto correctamente', '¡Creado!')
      }else{
        await this.service.updateProduct(newProduct)
        this.isSubmitting = false
        this.toastService.toastSuccess('Se actualizó el producto correctamente', '¡Actualizado!')
      }

      //Cierra el modal
      this.onNoClick(true);
    
    }catch(error){
      this.toastService.toastError(String(error), 'Atención')
    }

  }

}
