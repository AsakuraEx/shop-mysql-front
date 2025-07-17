import { Component, inject, OnInit } from '@angular/core';
import { Client } from '../../models/client';
import { ClientsService } from '../../services/clients.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CreateClientComponent } from '../../components/create-client/create-client.component';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

//Librerias externas
import Swal from 'sweetalert2'
import { ToastService } from '../../services/toast.service';
import { AxiosError } from 'axios';

@Component({
  selector: 'app-clients-index',
  imports: [MatTableModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './clients-index.component.html'
})
export class ClientsIndexComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'country', 'address', 'actions'];
  dataSource = new MatTableDataSource<Client>() 
  readonly dialog = inject(MatDialog)

  constructor(private service :ClientsService, private toastService: ToastService) {}

  ngOnInit(): void {
      this.findAll();
  }

  async findAll() {

    try {
      const response = await this.service.findAll();
      this.dataSource.data = response
    }catch(e) {
      console.log(e)
    }

  }

  deleteClient(id: number) {


    Swal.fire({
      title: "¿Estas seguro?",
      text: "Esto no puede revertirse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c4c4c4",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

          this.service.deleteClient(id).then(()=>{
            
            Swal.fire({
              title: "Eliminado!",
              text: "El cliente ha sido eliminado satisfactoriamente.",
              icon: "success"
            });
  
            this.findAll();
          
          }).catch(e =>{

            const error = e as AxiosError;
            const errorJSON = JSON.stringify(error.response?.data) || 'Error de servidor'
            const errorMsg = JSON.parse(errorJSON)

            if(errorMsg.statusCode === 500){
              Swal.fire({
                title: "Error " + errorMsg.statusCode,
                text: "No pudo eliminarse el cliente debido a que ya tiene ordenes a su nombre",
                icon: "error"
              });
              return
            }

            Swal.fire({
              title: "Error " + errorMsg.statusCode,
              text: "No eliminarse el cliente, " + errorMsg.message,
              icon: "error"
            });


          });
        }
    });
  }

  openCreateModal() {

    const dialogRef = this.dialog.open(CreateClientComponent, {
      maxWidth: 'none',
      width: '30rem',
      enterAnimationDuration: 300,
      exitAnimationDuration: 150
    })

    dialogRef.afterClosed().subscribe(result => {
      
      if(result === true){
        this.findAll();
      }

    })

  }

  openUpdateModal(client?: any) {

    if(client){
      const dialogRef = this.dialog.open(CreateClientComponent, {
        
        data: {
          id: client.id,
          name: client.name,
          email: client.email,
          country: client.address.country,
          province: client.address.province,
          town: client.address.town,
          street: client.address.street
        },
        maxWidth: 'none',
        width: '30rem',
        enterAnimationDuration: 300,
        exitAnimationDuration: 150
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.findAll();
        }
      })

    }else {
      this.toastService.toastError('No se pudo cargar la información del cliente', 'Error')
    }

  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

  }




}
