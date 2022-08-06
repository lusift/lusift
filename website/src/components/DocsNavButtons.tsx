import Link from 'next/link';
import { Route } from '../types';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

export interface DocsNavButtonsProps {
  prev: Route & { path: string; } | undefined;
  next: Route & { path: string; } | undefined;
}

export const DocsNavButtons: React.FC<DocsNavButtonsProps> = props => {
  const { prev, next } = props;
  return (
    <div className="flex flex-row justify-between mt-10 mb-2">
      {prev ?
        <Link href={prev.path} as={prev.path}>
          <a className="hover:text-blue-700 duration-100 flex items-center justify-start rounded-lg border-2 no-underline border-solid border-gray-200 p-4 py-3 flex-1 max-w-xs text-lg font-semibold">
            <AiOutlineArrowLeft className="mr-3" />
            <p>
            {prev.title}
            </p>
          </a>
        </Link>
        : null}
      {next ?
        <Link href={next.path} as={next.path}>
          <a className="self-end justify-self-end hover:text-blue-700 duration-100 flex items-center justify-end rounded-lg border-2 no-underline border-solid border-gray-200 p-4 py-3 flex-1 max-w-xs text-lg font-semibold text-right">
            <p>
            {next.title}
            </p>
            <AiOutlineArrowRight className="ml-3" />
          </a>
        </Link>
        : null}
    </div>
  );
}
