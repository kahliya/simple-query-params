import { useSearchParams } from "react-router";
import { useQueryParams } from "./useQueryParams";
import { useState } from "react";

const ReactRouterExample = () => {
  const [searchParams] = useSearchParams();
  const [v1, setV1] = useState<string>("");
  const [v2, setV2] = useState<string>("");

  // With a string[] schema given, all unrecognised keys will be flagged by typescript (compile error)
  // The URL param will still be updated though, it is not a runtime error.
  const { params, setParam, replaceParams } = useQueryParams({
    schema: ["cake", "muffin"],
    defaultInit: searchParams,
  });

  return (
    <div className="p-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Using React Router v7</h1>
        
        <div className="bg-purple-100">
          <span className="font-bold">Your params:</span>
          {Array.from(params).map(([k, v], idx) => <p key={idx}>{k}: {v}</p>)}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label>Key in the first value:</label>
            <input id="v1" value={v1} onChange={(e) => setV1(e.target.value)} className="bg-blue-100 border rounded-md" />
          </div>
          <div className="flex gap-2">
            <label>Key in the second value (optional):</label>
            <input id="v2" value={v2} onChange={(e) => setV2(e.target.value)} className="bg-blue-100 border rounded-md" />
          </div>
        </div>
        <button 
          className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => setParam("cake", v2 ? [v1, v2] : v1)}
        >
          Set "cake" param
        </button>
        <button 
          className="bg-purple-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => setParam("cake")}
        >
          Delete "cake" param
        </button>
        <button 
          className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => replaceParams()}
        >
          Clear all params
        </button>
      </div>
    </div>
  );
}

export default ReactRouterExample;
