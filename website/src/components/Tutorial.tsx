import { Browser } from './Browser';

export const Result1 = () => {
  return (
    <Browser>
      <div className="relative h-full">
        <button className="bg-blue-500 text-white p-1 rounded-md absolute top-0 left-0 m-8 button-1">
          button 1
        </button>
        <button className="bg-red text-white p-1 rounded-md absolute top-0 right-0 m-8 button-2">
          button 2
        </button>
        <button className="bg-yellow-500 text-white p-1 rounded-md absolute bottom-0 right-0 m-8 button-3">
          button 3
        </button>
        <button className="bg-cyan-500 text-white p-1 rounded-md absolute bottom-0 left-0 m-8 button-4">
          button 4
        </button>

      </div>
    </Browser>
  );
}


export const Result2 = () => {
  return (
    <Browser>
      <div className="relative h-full lusift-target">
        <button
          data-lusift="button-1"
          className="bg-blue-500 text-white p-1 rounded-md absolute top-0 left-0 m-8 button-1">
          button 1
        </button>
        <button
          data-lusift="button-2"
          className="bg-red text-white p-1 rounded-md absolute top-0 right-0 m-8 button-2">
          button 2
        </button>
        <button
          data-lusift="button-3"
          className="bg-yellow-500 text-white p-1 rounded-md absolute bottom-0 right-0 m-8 button-3">
          button 3
        </button>
        <button
          data-lusift="button-4"
          className="bg-cyan-500 text-white p-1 rounded-md absolute bottom-0 left-0 m-8 button-4">
          button 4
        </button>

      </div>
    </Browser>
  );
}
