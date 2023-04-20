import { readOnly } from '@ember/object/computed';

class Foo {
  @readOnly('foo.bar') bar;

  @and('foo', 'bar', 'etc') fooBar;
}