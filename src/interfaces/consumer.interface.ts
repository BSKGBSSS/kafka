export type ConsumerMessage = {
  key?: string;
  value: any;
};

export type OnMessage = (message: ConsumerMessage) => Promise<void>;

export interface IConsumer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  consume: (onMessage?: OnMessage) => Promise<void>;
  isConnected: () => boolean;
}
