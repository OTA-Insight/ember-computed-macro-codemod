import { set, computed } from '@ember/object';

class Foo {
  @computed('foo.bar')
  get bar() {
    return this.foo.bar;
  }

  etc() {
    set(this, 'test', 1);
  }
}