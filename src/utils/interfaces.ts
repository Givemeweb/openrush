import { DataTableData } from '@semcore/ui/data-table';

export type ProspectState =
  | 'prospect'
  | 'in-progress'
  | 'monitor'
  | 'earned'
  | 'rejected';

export interface NewProspect extends DataTableData {
  sourceDomain: string;
  url: string;
  notes: string;
  as: number | string;
  state?: ProspectState;
  created?: Date;
  updated?: Date;
}

export interface Prospect extends DataTableData {
  _id: string;
  sourceDomain: string;
  url: string;
  notes: string;
  as: number | string;
  state?: ProspectState;
  created?: Date;
  updated?: Date;
}

export interface Umami {
  track: Function;
}
