import axios from 'axios';

export const api = axios.create({
  baseURL: "https://patralpecas173910.protheus.cloudtotvs.com.br:4050/rest"
});
