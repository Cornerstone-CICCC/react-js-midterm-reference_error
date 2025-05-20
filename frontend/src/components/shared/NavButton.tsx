import type React from "react";

type BottomNavIconProps = {
  icon: React.ReactNode;
};

export function NavButton({ icon }: BottomNavIconProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="text-2xl mb-1">{icon}</div>
    </div>
  );
}
