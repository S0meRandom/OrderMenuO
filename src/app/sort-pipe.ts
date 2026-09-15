import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort', standalone: true })
export class SortPipe implements PipeTransform {
  transform(array: any[], field: string, direction: 'asc' | 'desc' = 'asc'): any[] {
    if (!Array.isArray(array) || !field) return array;

    return [...array].sort((a, b) => {
      let valA = String(a[field] || '');
      let valB = String(b[field] || '');
      let comparison = valA.localeCompare(valB, undefined, { numeric: true });

      return direction === 'asc' ? comparison : -comparison;
    });
  }
}
