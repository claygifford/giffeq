import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";

type BackButtonProps = {
  onClick: () => void;
};

export default function BackButtonComponent(props: BackButtonProps) {
  return (
    <div className="relative p-2">
      <button
        aria-label="BackButton"
        onClick={props.onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <ArrowSmallLeftIcon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-gray-900" />
      </button>
    </div>
  );
}
