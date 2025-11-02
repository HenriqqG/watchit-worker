export interface OnGoingAPIResponse {
  payload: {
    [key: string]: {
      id: string;
      game: string;
      region: string;
      teams: {
        faction1: {
          id: string;
          avatar: string;
          name: string;
          leader: string;
          roster: {
            id: string;
            avatar: string;
            nickname: string;
          }[];
        };
        faction2: {
          id: string;
          avatar: string;
          name: string;
          leader: string;
          roster: {
            id: string;
            avatar: string;
            nickname: string;
          }[];
        };
      };
      state: string;
      status: string;
      playing: boolean;
      createdAt: Date;
    }[];
  };
}