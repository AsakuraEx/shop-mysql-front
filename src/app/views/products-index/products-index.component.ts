import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Products } from '../../models/products';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';
import { ProductsService } from '../../services/products.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { InputModalComponent } from '../../components/input-modal/input-modal.component';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-products-index',
  imports: [MatTableModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  templateUrl: './products-index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsIndexComponent implements OnInit{

  constructor(private service: ProductsService, private toastService: ToastService) {}

  dataSource = new MatTableDataSource<Products>()
  displayColumns = ['id', 'name', 'price', 'stock']
  productSelected: any
  tableCount:number = 0;

  readonly dialog = inject(MatDialog)

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
      const productList = await this.service.findAll();
      this.dataSource.data = productList.data;
  }

  onRowClick(row: any) {
    this.productSelected = row
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      maxWidth: 'none',
      enterAnimationDuration: 300,
      exitAnimationDuration: 150
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.cancelSelect()
        this.loadProducts();
      }
    })
  }

  openUpdateModal() {

    if(this.productSelected){

      const dialogRef = this.dialog.open(ProductModalComponent, {
        data: {
          id: this.productSelected.id,
          name: this.productSelected.name,
          price: this.productSelected.price,
          stock: this.productSelected.stock,
          deleted: this.productSelected.deleted,
        },
        maxWidth: 'none',
        enterAnimationDuration: 300,
        exitAnimationDuration: 150
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.cancelSelect()
          this.loadProducts();
        }
      })
    }else{

      this.toastService.toastError('No ha seleccionado un registro de la tabla', 'Error')
      
    }

  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }

  openInputModal(isIncrement: boolean) {

    if(isIncrement){
      if(this.productSelected){
  
        const dialogRef = this.dialog.open(InputModalComponent, {
          data: {
            id: this.productSelected.id,
            increment: true
          },
          maxWidth: 'none',
          enterAnimationDuration: 300,
          exitAnimationDuration: 150
        })
  
        dialogRef.afterClosed().subscribe(result => {
          if (result == true){
            this.cancelSelect()
            this.loadProducts()
          }
        })
  
      } else {
       
        this.toastService.toastError('No ha seleccionado un registro de la tabla para incrementar el stock', 'Error')
  
      }
    }else {

      if(this.productSelected){
  
        const dialogRef = this.dialog.open(InputModalComponent, {
          data: {
            id: this.productSelected.id,
            increment: false
          },
          maxWidth: 'none',
          enterAnimationDuration: 300,
          exitAnimationDuration: 150
        })
  
        dialogRef.afterClosed().subscribe(result => {
          if (result == true){
            this.cancelSelect()
            this.loadProducts()
          }
        })
  
      } else {
       
        this.toastService.toastError('No ha seleccionado un registro de la tabla para incrementar el stock', 'Error')
  
      }
    
    }
  }

  cancelSelect() {
    this.productSelected = null
  }

  deleteProduct(product: any){
    
    if(product){
      try{
        this.service.deleteProduct(product.id)
        this.loadProducts()
      }catch(e){
        this.toastService.toastError('Ocurrio un error al eliminar el elemento', 'Error')
      }
    }else{
      this.toastService.toastError('Para eliminar un elemento, primero debe seleccionarlo de la tabla', 'Error')
    }

  }

}
