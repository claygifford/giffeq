import { XCircleIcon } from "@heroicons/react/24/solid";

type DeleteButtonProps = {
  onClick: () => void;
};

export default function DeleteButtonComponent(props: DeleteButtonProps) {
  return (
    <div>
      <button
        aria-label="BackButton"
        onClick={props.onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <XCircleIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-blue-900" />
      </button>
    </div>
  );
}
