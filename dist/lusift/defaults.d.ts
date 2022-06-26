import { Content, DeepPartial } from '../common/types';
import { ContentDefaults } from './types';
export default function combineContentWithDefaults(content: any, contentDefaults?: DeepPartial<ContentDefaults>): Content;
