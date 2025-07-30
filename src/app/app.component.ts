import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Chart, registerables } from 'chart.js';
import { ChatBotComponent } from "./_components/chatbot/chatbot.component";
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatBotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'findjob_angular';

  ngOnInit(): void {
  }
}
