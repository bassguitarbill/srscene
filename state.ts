export default class State {

  public constructor(readonly params: Array<Param> = []) {}

  update(paramName: string, paramValue: string) {
    const pToUpdate = this.findParam(paramName);
    if (!pToUpdate) throw `Updating a nonexistent parameter ${paramName}!`;
    pToUpdate.value = paramValue;
  }

  findParam(paramName: string): Param | null {
    const param = this.params.find(p => p.name === paramName);
    return param || null;
  }
}

type Param = {
  name: string,
  displayName: string,
  value: string,
}

export type { Param }
