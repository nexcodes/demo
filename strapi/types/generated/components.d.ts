import type { Schema, Struct } from '@strapi/strapi';

export interface ArraysArrayOfString extends Struct.ComponentSchema {
  collectionName: 'components_arrays_array_of_strings';
  info: {
    displayName: 'ArrayOfString';
  };
  attributes: {
    item: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'arrays.array-of-string': ArraysArrayOfString;
    }
  }
}
