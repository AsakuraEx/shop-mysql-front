import { Component } from '@angular/core';
import { Products } from '../../models/products';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-products-index',
  imports: [MatTableModule],
  templateUrl: './products-index.component.html'
})
export class ProductsIndexComponent {

  products: Products[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 10,
      stock: 100,
      deleted: false
    },
    {
      id: 2,
      name: 'Product 2',
      price: 10,
      stock: 100,
      deleted: false
    }
  ]

  displayColumns = ['id', 'name', 'price', 'stock', 'deleted']

  onRowClick(row: any) {
    console.log(row.id);
  }

}
