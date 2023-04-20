import { uniqBy } from '@ember/object/computed';

class Foo {
  get bar() {
    return this.foo.bar;
  }

  @uniqBy('fruits', 'id') uniqueFruits;
}