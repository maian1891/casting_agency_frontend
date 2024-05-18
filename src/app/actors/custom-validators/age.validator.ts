import { AbstractControl } from '@angular/forms';

export function AgeValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value == null ||
    control.value == undefined ||
    control.value < 0 ||
    control.value > 150
  ) {
    return { age: true };
  }

  return null;
}
