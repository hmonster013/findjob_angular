import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerQuantityStatisticsComponent } from '../../_components/employers/employer-quantity-statistics/employer-quantity-statistics.component';
import { RecruitmentChartComponent } from '../../_components/employers/charts/recruitment-chart/recruitment-chart.component';
import { CandidateChartComponent } from '../../_components/employers/charts/candidate-chart/candidate-chart.component';
import { ApplicationChartComponent } from '../../_components/employers/charts/application-chart/application-chart.component';
import { HiringAcademicChartComponent } from '../../_components/employers/charts/hiring-academic-chart/hiring-academic-chart.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    EmployerQuantityStatisticsComponent,
    RecruitmentChartComponent,
    CandidateChartComponent,
    ApplicationChartComponent,
    HiringAcademicChartComponent,
  ],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {}
