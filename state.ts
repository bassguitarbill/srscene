export default class State {

  public constructor(readonly params: Array<Param> = []) {}

  update(paramName: string, paramValue: string | number | boolean) {
    const pToUpdate = this.findParam(paramName);
    if (!pToUpdate) throw `Updating a nonexistent parameter ${paramName}!`;
    if (pToUpdate.type === 'boolean') {
      if (!(paramValue === true || paramValue === false)) {
        throw `Updating boolean param ${paramName} with invalid value ${paramValue}!`;
      }
      pToUpdate.value = new Boolean(paramValue).valueOf();
    } else if (pToUpdate.type === 'number') {
      const numValue = new Number(paramValue).valueOf();
      if (isNaN(numValue)) {
        throw `Updating number param ${paramName} with invalid value ${paramValue}!`;
      }
      pToUpdate.value = numValue;
    } else if (pToUpdate.type === 'string') {
      if (paramValue !== paramValue.toString()) {
        throw `Updating string param ${paramName} with non-string value ${paramValue}!`;
      }
      pToUpdate.value = new String(paramValue).valueOf();
    }
  }

  findParam(paramName: string): Param | null {
    const param = this.params.find(p => p.name === paramName);
    return param || null;
  }
}

type _param = {
  name: string,
  displayName: string,
}

type StringParam = _param & {
  type: 'string',
  value: string,
}

type NumParam = _param & {
  type: 'number',
  value: number,
}

type BoolParam = _param & {
  type: 'boolean',
  value: boolean,
}

type Param = StringParam | NumParam | BoolParam;

export type { Param }
