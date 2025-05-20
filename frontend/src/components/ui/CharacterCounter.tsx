type Props = {
  current: number;
  max: number;
};

export function CharacterCounter({ current, max }: Props) {
  return (
    <div className="text-xs text-right text-gray-500 mt-1">
      {current}/{max}
    </div>
  );
}
