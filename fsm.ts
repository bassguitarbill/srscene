export default class FSM {
  public currentState: string;
  stateNames: Set<String>;

  constructor(stateNames: Array<string>, readonly transitions: Array<Transition>) {
    if (stateNames.length === 0) throw 'Tried to create a FSM with no states!';
    this.stateNames = new Set(stateNames);
    const invalidTransitions = transitions.filter(t => !(this.stateNames.has(t.to) && this.stateNames.has(t.from)));
    if (invalidTransitions.length > 0) throw `Invalid transition ${invalidTransitions[0]}`;
    this.currentState = stateNames[0];
  }

  transition(action: string) {
    const candidateTransitions = this.transitions.filter(t => t.from === this.currentState);
    if (candidateTransitions.length === 0) return console.log('This state machine appears to be in a dead end!');
    const transition = candidateTransitions.find(t => t.action === action);
    if (transition) this.currentState = transition.to;
  }
}

type Transition = {
  action: string,
  to: string,
  from: string,
}
