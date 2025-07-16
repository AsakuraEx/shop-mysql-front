import { Injectable } from '@angular/core';
import api from '../config/axios';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: any = [];

  constructor() { }

  async findAll() {
    try {
      this.products = await api.get('products');
      return this.products;
    }catch(e){
      throw new Error ('Ocurrio un problema al cargar los productos: ' + e)
    }
  }

  async addProduct(product: any) {
    try{
      await api.post('products', product);
    }catch(e){
      throw new Error('No se pudo agregar el producto')
    }
  }

  async updateProduct(product: any) {
    try{
      await api.put('products', product);
    }catch(e){
      throw new Error('No se pudo actualizar el producto')
    }
  }

  async incrementStock(stock: any){
    try{
      await api.patch('products/increment-stock', stock);
    }catch(e){
      throw new Error('No se pudo incrementar el stock')
    }
  }

  async decrementStock(stock: any){
    try{
      await api.patch('products/decrement-stock', stock);
    }catch(e){
      throw new Error('No se pudo incrementar el stock')
    }
  }

}
