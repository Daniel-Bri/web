import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface VehiculoPayload {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
}

export interface VehiculoResponse {
  id: number;
  usuario_id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  activo: boolean;
  created_at: string;
}

export interface TallerPayload {
  nombre: string;
  direccion: string;
  telefono?: string;
  email_comercial?: string;
  latitud?: number;
  longitud?: number;
}

export interface TallerResponse {
  id: number;
  usuario_id: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  email_comercial?: string;
  latitud?: number;
  longitud?: number;
  disponible: boolean;
  estado: string;
  rating: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private readonly API = `${environment.apiUrl}/api/acceso`;

  constructor(private http: HttpClient) {}

  registrar(payload: VehiculoPayload): Observable<VehiculoResponse> {
    return this.http.post<VehiculoResponse>(`${this.API}/vehiculos`, payload);
  }

  listar(): Observable<VehiculoResponse[]> {
    return this.http.get<VehiculoResponse[]>(`${this.API}/vehiculos`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/vehiculos/${id}`);
  }

  registrarTaller(payload: TallerPayload): Observable<TallerResponse> {
    return this.http.post<TallerResponse>(`${this.API}/talleres`, payload);
  }

  listarTalleres(estado?: string): Observable<TallerResponse[]> {
    const params = estado ? `?estado=${estado}` : '';
    return this.http.get<TallerResponse[]>(`${this.API}/talleres${params}`).pipe(timeout(8000));
  }

  aprobarTaller(id: number): Observable<TallerResponse> {
    return this.http.patch<TallerResponse>(`${this.API}/talleres/${id}/aprobar`, {}).pipe(timeout(8000));
  }

  rechazarTaller(id: number): Observable<TallerResponse> {
    return this.http.patch<TallerResponse>(`${this.API}/talleres/${id}/rechazar`, {}).pipe(timeout(8000));
  }
}
