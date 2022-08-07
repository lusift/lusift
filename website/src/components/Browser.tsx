
const WindowButton = ({ color }) => {
  return (
    <i className={`inline-block ${color} h-3 w-3 rounded-lg my-1.5 mx-0.5`}>
    </i>
  );
}

export const Browser = ({ children }) => {
  return (
    <div className="pt-8 bg-gray-100 relative overflow-auto shadow-lg">
      <div className="flex flex-row h-9 absolute top-0 p-1 w-full
        border-b-2 border-b-gray-300 bg-gradient-to-b from-gray-100 to-gray-200">
        <div>
          <WindowButton color="bg-[#ff564f]" />
          <WindowButton color="bg-[#ffb72a]" />
          <WindowButton color="bg-[#25c63a]" />
        </div>
        <input
          className="text-sm flex-1 inline-block h-6 text-gray-400 bg-gray-50 rounded-sm m-0.5 px-1.5 shadow-sm"
          value="http://localhost:3000/docs/tutorial" disabled />
      </div>

      <div className="overflow-y-auto h-96 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
