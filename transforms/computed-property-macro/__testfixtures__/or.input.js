import { or } from '@ember/object/computed';

class Foo {
  @or('foo', 'bar') fooBar;
}