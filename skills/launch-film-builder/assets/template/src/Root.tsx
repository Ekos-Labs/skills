import React from 'react';
import {Composition} from 'remotion';
import {Promo} from './Promo';
import {CharacterTest,CHARACTER_TEST_SECONDS} from './CharacterTest';
import {FPS,FRAMES} from './timing';

/* One film, two formats from the same component, plus a turntable for the character. */
export const Root=()=><>
 <Composition id="PromoWide" component={Promo} durationInFrames={FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{vertical:false}}/>
 <Composition id="PromoVertical" component={Promo} durationInFrames={FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{vertical:true}}/>
 <Composition id="CharacterTest" component={CharacterTest} durationInFrames={FPS*CHARACTER_TEST_SECONDS} fps={FPS} width={1080} height={1080}/>
</>;
