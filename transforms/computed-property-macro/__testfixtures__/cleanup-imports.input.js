import { readOnly, uniqBy } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  @uniqBy('fruits', 'id') uniqueFruits;
}