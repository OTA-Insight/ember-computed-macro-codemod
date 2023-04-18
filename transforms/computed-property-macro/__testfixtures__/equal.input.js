import { equal } from '@ember/object/computed';

class Foo {
  @equal('foo.bar', 1) isOne;
}