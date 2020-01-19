export class Namespacer {
  constructor(private readonly namespace: string) {
  }
  qualify(actionId: string) {
    return `${this.namespace}/${actionId}`
  }
}
