import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;
}