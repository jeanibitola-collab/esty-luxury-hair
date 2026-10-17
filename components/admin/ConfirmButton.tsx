"use client";

type Props = React.ComponentProps<"button"> & { message: string };

export default function ConfirmButton({ message, children, ...props }: Props) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}