import { and } from '@ember/object/computed';

class Foo {
  @and('foo', 'bar', 'etc', 'deep.property') fooBar;
}