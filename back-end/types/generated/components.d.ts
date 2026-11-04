import type { Schema, Struct } from '@strapi/strapi';

export interface CubeAppearance extends Struct.ComponentSchema {
  collectionName: 'components_cube_appearances';
  info: {
    displayName: 'Cube appearance';
  };
  attributes: {
    backColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#ffa500'>;
    bottomColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#ffffff'>;
    frontColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#ff0000'>;
    initialRotationX: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<-45>;
    initialRotationY: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<-45>;
    initialRotationZ: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    leftColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#0000ff'>;
    pieceRadiusPx: Schema.Attribute.Float &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<20>;
    rightColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#008000'>;
    topColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 7;
        minLength: 7;
      }> &
      Schema.Attribute.DefaultTo<'#ffff00'>;
    transitionMs: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    widthPx: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<240>;
  };
}

export interface TutorialPart extends Struct.ComponentSchema {
  collectionName: 'components_tutorial_parts';
  info: {
    displayName: 'Tutorial part';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface TutorialVideo extends Struct.ComponentSchema {
  collectionName: 'components_tutorial_videos';
  info: {
    displayName: 'Tutorial video';
  };
  attributes: {
    embedUrl: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2048;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'cube.appearance': CubeAppearance;
      'tutorial.part': TutorialPart;
      'tutorial.video': TutorialVideo;
    }
  }
}
