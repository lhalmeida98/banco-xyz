export interface Notification {
  id: number,
  message: string;
  type: 'success' | 'warning' | 'error';
  title: string;
}
