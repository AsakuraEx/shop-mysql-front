import { Injectable } from '@angular/core';
import { Client } from '../models/client';
import api from '../config/axios';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private clients: Client[] = [];

  constructor() { }

  async findAll() {

      const { data } = await api.get('/clients');
      this.clients = data;
      return this.clients;

  }

  async addClient(client: Client){

    return await api.post('/clients', client)

  }

  async updateClient(client: Client){

    return await api.put(`/clients/`, client)

  }

  async deleteClient(id: number) {

    return await api.delete(`/clients/${id}`);

  }

}
