export interface IProducer {
  produce: (message: any) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
}
