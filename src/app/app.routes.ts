import { Routes } from '@angular/router';
import { ProductsIndexComponent } from './views/products-index/products-index.component';
import { ClientsIndexComponent } from './views/clients-index/clients-index.component';

export const routes: Routes = [
    {
        path: 'products',
        component: ProductsIndexComponent
    },
    {
        path: 'clients',
        component: ClientsIndexComponent
    },
];
