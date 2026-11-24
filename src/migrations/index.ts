import * as migration_20261124_190156_initial from './20261124_190156_initial';

export const migrations = [
  {
    up: migration_20261124_190156_initial.up,
    down: migration_20261124_190156_initial.down,
    name: '20261124_190156_initial'
  },
];
