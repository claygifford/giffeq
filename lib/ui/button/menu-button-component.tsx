import { Bars3Icon } from '@heroicons/react/24/solid';

type MenuButtonProps = {
  //children: React.ReactNode;
  onClick: () => void;
};

export default function MenuButtonComponent(props: MenuButtonProps) {
  const { onClick } = props;
  return (
    <div className="relative pl-2">
      <button
        aria-label='Menu button'
        onClick={onClick}
        className="group relative flex w-full justify-center rounded-full border border-transparent py-2 px-2 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <Bars3Icon className="h-6 w-6 min-h-[1.5rem] min-w-[1.5rem] text-gray-600" />
      </button>
    </div>
  );
}