import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../../acceso-registro/auth.service';
import { VehiculoService, VehiculoResponse } from '../../acceso-registro/vehiculo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reportar-emergencia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reportar-emergencia.component.html',
})
export class ReportarEmergenciaComponent implements OnInit {
  vehiculos: VehiculoResponse[] = [];
  vehiculoId: number | null = null;
  prioridad = 'media';
  descripcion = '';

  loadingVehiculos = true;
  loading = false;
  errorMsg = '';

  readonly prioridades = [
    { value: 'alta',  label: 'Alta — Vehículo inmovilizado' },
    { value: 'media', label: 'Media — Falla parcial' },
    { value: 'baja',  label: 'Baja — Revisión preventiva' },
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private vehiculoSvc: VehiculoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.vehiculoSvc.listar().pipe(timeout(10000)).subscribe({
      next: (list) => {
        this.vehiculos = list.filter(v => v.activo);
        if (this.vehiculos.length) this.vehiculoId = this.vehiculos[0].id;
        this.loadingVehiculos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los vehículos.';
        this.loadingVehiculos = false;
        this.cdr.detectChanges();
      },
    });
  }

  submit(): void {
    if (!this.vehiculoId) { this.errorMsg = 'Selecciona un vehículo.'; return; }
    this.loading = true;
    this.errorMsg = '';

    const token = this.auth.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const body: Record<string, unknown> = {
      vehiculo_id: this.vehiculoId,
      prioridad: this.prioridad,
    };
    if (this.descripcion.trim()) body['descripcion'] = this.descripcion.trim();

    this.http
      .post<{ id: number }>(`${environment.apiUrl}/api/emergencias/`, body, { headers })
      .pipe(timeout(12000))
      .subscribe({
        next: (res) => {
          // Navegar a adjuntar-fotos con el ID del incidente recién creado
          this.router.navigate(
            ['/app/emergencias/adjuntar-fotos'],
            { queryParams: { id: res.id } },
          );
        },
        error: (e) => {
          this.errorMsg = e?.error?.detail ?? 'Error al crear el incidente.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  volver(): void {
    this.router.navigate(['/app/dashboard']);
  }
}
