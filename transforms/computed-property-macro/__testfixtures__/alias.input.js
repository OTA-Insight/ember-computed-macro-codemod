import { alias } from '@ember/object/computed';

class Foo {
  @alias('foo.bar') fooBar;
}