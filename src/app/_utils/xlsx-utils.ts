import { Injectable } from '@angular/core';
import { utils, writeFileXLSX } from 'xlsx';
import dayjs from 'dayjs';


export function exportToXLSX(data: any[], fileName: string = 'data'): void {
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Data');
  writeFileXLSX(wb, `${fileName}_${dayjs().format('DD-MM-YYYY')}.xlsx`);
}
