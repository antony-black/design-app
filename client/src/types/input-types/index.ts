export type TIdea = {
  name: string;
  nick: string;
  description: string;
  text: string;
};

export type TCustomInput = {
  name: keyof TIdea;
  label: string;
  value: TIdea;
  setValue: React.Dispatch<React.SetStateAction<TIdea>>;
};
