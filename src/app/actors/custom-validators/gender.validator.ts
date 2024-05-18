import { AbstractControl } from '@angular/forms';

export function GenderValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  if (
    control.value === null ||
    control.value === undefined ||
    !(
      String(control.value).toLowerCase() === 'male' ||
      String(control.value).toLowerCase() === 'female'
    )
  ) {
    console.log('false ', control.value);
    return { gender: true };
  }

  return null;
}
