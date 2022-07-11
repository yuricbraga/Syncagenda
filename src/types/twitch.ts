export interface channelScheduleType {
  data: {
    segments: {
      id: string;
      start_time: string;
      end_time: string;
      title: string;
      canceled_until: string;
      category: {
        id: string;
        name: string;
      };
    }[];
    is_recurring: boolean;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    vacation?: {
      start_time: string;
      end_time: string;
    };
  };
  pagination: any;
}
