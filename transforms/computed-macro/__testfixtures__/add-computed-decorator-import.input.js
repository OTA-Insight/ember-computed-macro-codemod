import { set } from '@ember/object';
import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  etc() {
    set(this, 'test', 1);
  }
}