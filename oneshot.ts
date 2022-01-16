import FSM from './fsm.ts'

export default class OneShot {
  private fsm: FSM;
  constructor(readonly name: string) {
    this.fsm = OneShot.generateOneShotFSM();
  }

  activate() {
    this.fsm.transition('activate');
  }

  cancel() {
    this.fsm.transition('cancel');
  }

  perform() {
    this.fsm.transition('perform');
  }

  finish() {
    this.fsm.transition('finish');
  }

  get state() {
    return this.fsm.currentState;
  }

  static generateOneShotFSM() {
    return new FSM(
      ['inactive', 'queued', 'active'],
      [
        { action: 'activate', to: 'queued',   from: 'inactive' },
        { action: 'cancel',   to: 'inactive', from: 'queued'   },
        { action: 'perform',  to: 'active',   from: 'queued'   },
        { action: 'finish',   to: 'inactive', from: 'active'   },
      ]
    );
  }
}
