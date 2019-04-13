import axios, { AxiosInstance, AxiosResponse } from "axios";
import { checkServerIdentity } from "tls";

export default class HttpClient {
  private http: AxiosInstance;

  public constructor() {
    this.http = axios.create({ baseURL: "http://localhost:3000" });
  }

  private checkResponse(response: AxiosResponse) {
    if (response.status !== 200) {
      throw new Error(
        `Request failed with ${response.status} - ${response.statusText}`
      );
    }
  }

  public async get(url: string) {
    const response = await this.http.get(url);
    this.checkResponse(response);
    return response.data;
  }
}
