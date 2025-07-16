import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClientsService } from '../../services/clients.service';


//Libreria externa
import Swal from 'sweetalert2'
import { AxiosError } from 'axios';

@Component({
  selector: 'app-create-client',
  imports: [
    MatIconModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, 
    MatAutocompleteModule, AsyncPipe
  ],
  templateUrl: './create-client.component.html',
})
export class CreateClientComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<CreateClientComponent>);
  items: string[] = ['Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costarrica', 'Panama', 'Belice'];
  filteredItems!: Observable<string[]>
  isSubmitting = false;


  formClient = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    country: new FormControl(null, [Validators.required]),
    province: new FormControl(null, [Validators.required]),
    town: new FormControl(null, [Validators.required]),
    street: new FormControl(null, [Validators.required]),
  })

  constructor(private service: ClientsService) {}

  ngOnInit(): void {
      this.filteredItems = this.formClient.controls['country'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterAutocomplete(value || '')),
      )
  }

  private _filterAutocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.items.filter(option=>option.toLowerCase().includes(filterValue))
  }

  async addClient() {

    this.isSubmitting = true

    if (this.formClient.invalid) {
      // Marca todos los controles como tocados para que muestren errores
      this.formClient.markAllAsTouched();
      return;
    }

    const newClient: any = {
      name: this.formClient.controls['name'].value,
      email: this.formClient.controls['email'].value,
      address: {
        country: this.formClient.controls['country'].value,
        province: this.formClient.controls['province'].value,
        town: this.formClient.controls['town'].value,
        street: this.formClient.controls['street'].value,
      }
    }

    try{

      await this.service.addUser(newClient);

      this.onNoClick(true)
    
      Swal.fire({
        title: "¡Exito!",
        text: "El cliente fue agregado correctamente",
        icon: "success"
      });
      
      this.isSubmitting = false

    }catch(e){

      const error = e as AxiosError;

      const errorJSON = JSON.stringify(error.response?.data) || 'Error de servidor'

      const errorMsg = JSON.parse(errorJSON)

      Swal.fire({
        title: "Error " + errorMsg.statusCode,
        text: "No pudo agregarse un nuevo cliente, " + errorMsg.message,
        icon: "error"
      });


    }


  }

  onNoClick(flag?: boolean) {
    this.dialogRef.close(flag);
  }

}
