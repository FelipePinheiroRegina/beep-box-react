import axios from "axios"

export const api = axios.create({
    baseURL: "http://192.168.10.112:8401/rest"
})