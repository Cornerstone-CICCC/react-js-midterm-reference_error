type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}
