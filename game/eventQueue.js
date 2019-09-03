//
// queue factory
//
module.exports.makeQueue = function() {
    return Object.create(queueProto);
}

//
// properties
//
let queueProto = {
  eventQueue: [],
  eventPromise: undefined,
  resolvePromise: undefined,
  rejectPromise: undefined,
  enqueueEvent(event) {
    this.eventQueue.push(event);
    if(this.eventPromise) {
      this.resolvePromise(this.eventQueue.shift());
      this.eventPromise = null;
    }
  },
  async waitEvent()  {
    if(this.eventQueue.length) {
      return this.eventQueue.shift();
    } else {
      if(this.eventPromise) {
        throw 'invariant error: eventPromise not null'
      }
      this.eventPromise = new Promise((resolve, reject) => {
        this.resolvePromise = resolve;
        this.rejectPromise = reject;

      });
      return this.eventPromise;
    }
  }
}
