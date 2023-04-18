import { and } from '@ember/object/computed';

class Foo {
  @and('foo', 'bar', 'etc') fooBar;
}