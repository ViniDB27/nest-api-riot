import { RegionCode, RegionName } from '../services/riot/riot.types';

export const getRegionName = (regionCode: RegionCode): RegionName => {
  switch (regionCode) {
    case 'kr':
    case 'jp1':
      return 'asia';
    case 'eun1':
    case 'euw1':
    case 'tr1':
    case 'ru':
      return 'europe';
    case 'oc1':
    case 'ph2':
    case 'sg2':
    case 'th2':
    case 'tw2':
    case 'vn2':
      return 'sea';
    case 'br1':
    case 'na1':
    case 'la1':
    case 'la2':
    default:
      return 'americas';
  }
};
